/**
 * @generated
 * @context Runtime configurable chart — Data Page rows aggregated to Adapt line/bar/column/pie/donut.
 * @decisions RxRecordInstanceDataPageService; OnPush; RxLogService for errors; no console.log.
 * @references catalog-view built-in query pattern, cookbook/04-ui-services-and-apis.md
 * @modified 2026-03-25
 */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';
import {
  AdaptChartAxis,
  AdaptChartHeader,
  AdaptLineGraphData,
  AdaptLineGraphModule,
  AdaptPieChartModule,
  AdaptStackedChartModule,
  AdaptStackedChartSeries,
  AdaptStackedChartType
} from '@bmc-ux/adapt-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RxRecordInstanceDataPageService } from '@helix/platform/record/api';
import { IDataPageRequestConfiguration, RxLogService } from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { IConfigurableChartProperties } from '../configurable-chart.types';
import {
  aggregateSumByCategory,
  buildBarSeries,
  buildLinePoints,
  buildPieSeries,
  buildPropertySelection,
  coerceRecords,
  type RecordRow
} from '../configurable-chart.utils';

// @context Deploy-time VC scanner (CLIE) expects @RxViewComponent immediately above export class — same order as cookbook/02-ui-view-components.md (Component, then RxViewComponent).
@Component({
  standalone: true,
  selector: 'com-amar-dashboard-configurable-chart',
  templateUrl: './configurable-chart.component.html',
  styleUrls: ['./configurable-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    AdaptLineGraphModule,
    AdaptStackedChartModule,
    AdaptPieChartModule
  ]
})
@RxViewComponent({
  name: 'com-amar-dashboard-configurable-chart'
})
export class ConfigurableChartComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input() config!: Observable<IConfigurableChartProperties>;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly rxLogService = inject(RxLogService);
  private readonly translate = inject(TranslateService);
  private readonly rxRecordInstanceDataPageService = inject(RxRecordInstanceDataPageService);

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IConfigurableChartProperties;

  isLoading = false;
  errorMessage = '';
  rawRowCount = 0;

  chartKind: IConfigurableChartProperties['chartKind'] = 'bar';
  chartHeight = 400;

  xAxis: AdaptChartAxis = { title: '', categories: [] };
  yAxis: AdaptChartAxis = { title: '' };
  stackedType: AdaptStackedChartType = AdaptStackedChartType.Bar;

  lineSeries: AdaptLineGraphData[] = [];
  stackedChartSeries: AdaptStackedChartSeries[] = [{ name: 'Values', data: [] }];

  pieSeries = buildPieSeries([], []);

  chartHeader: AdaptChartHeader | undefined;

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config
      .pipe(
        distinctUntilChanged(
          (a, b) =>
            a.recordDefinitionName === b.recordDefinitionName &&
            a.chartQueryExpression === b.chartQueryExpression &&
            a.chartPageSize === b.chartPageSize &&
            a.categoryFieldId === b.categoryFieldId &&
            a.valueFieldId === b.valueFieldId &&
            a.chartKind === b.chartKind &&
            a.chartTitle === b.chartTitle &&
            a.chartHeight === b.chartHeight &&
            a.hidden === b.hidden
        ),
        switchMap((c) => {
          this.state = { ...c };
          this.isHidden = Boolean(c.hidden);
          this.chartKind = c.chartKind ?? 'bar';
          this.applyHeader(c);
          const h = parseInt((c.chartHeight ?? '400').trim(), 10);
          this.chartHeight = Number.isFinite(h) && h > 0 ? h : 400;
          this.stackedType =
            this.chartKind === 'column' ? AdaptStackedChartType.Column : AdaptStackedChartType.Bar;

          const rd = (c.recordDefinitionName ?? '').trim();
          const cat = (c.categoryFieldId ?? '').trim();
          const val = (c.valueFieldId ?? '').trim();
          if (!rd || !cat || !val) {
            this.errorMessage = this.translate.instant(
              'com.amar.dashboard.view-components.configurable-chart.err.missing-fields'
            );
            this.clearSeries();
            this.isLoading = false;
            this.cdr.markForCheck();
            return of<RecordRow[]>([]);
          }

          this.errorMessage = '';
          this.isLoading = true;
          const propertySelection = buildPropertySelection(cat, val);
          if (propertySelection.length < 2) {
            this.errorMessage = this.translate.instant(
              'com.amar.dashboard.view-components.configurable-chart.err.field-ids'
            );
            this.clearSeries();
            this.isLoading = false;
            this.cdr.markForCheck();
            return of<RecordRow[]>([]);
          }

          const rawSize = (c.chartPageSize ?? '-1').trim();
          const pageSize = parseInt(rawSize, 10);
          const params: Record<string, string | number | number[]> = {
            recorddefinition: rd,
            propertySelection,
            pageSize: Number.isFinite(pageSize) ? pageSize : -1,
            startIndex: 0
          };
          const qe = (c.chartQueryExpression ?? '').trim();
          if (qe) {
            params.queryExpression = qe;
          }
          const req: IDataPageRequestConfiguration = { params };
          return this.rxRecordInstanceDataPageService.post(req).pipe(
            map((res) => coerceRecords(res as unknown)),
            catchError((e) => {
              this.rxLogService.error(`ConfigurableChart: Data Page failed: ${String(e)}`);
              this.errorMessage = this.translate.instant(
                'com.amar.dashboard.view-components.configurable-chart.err.load'
              );
              this.clearSeries();
              return of<RecordRow[]>([]);
            })
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((rows) => {
        if (!this.state) {
          return;
        }
        this.isLoading = false;
        if (this.errorMessage) {
          this.cdr.markForCheck();
          return;
        }
        this.rawRowCount = rows.length;
        const { categories, totals } = aggregateSumByCategory(
          rows,
          this.state.categoryFieldId.trim(),
          this.state.valueFieldId.trim()
        );
        this.xAxis = {
          title: this.translate.instant('com.amar.dashboard.view-components.configurable-chart.axis.category'),
          categories
        };
        this.yAxis = {
          title: this.translate.instant('com.amar.dashboard.view-components.configurable-chart.axis.value')
        };

        const linePts = buildLinePoints(categories, totals);
        this.lineSeries = [
          {
            name: this.translate.instant('com.amar.dashboard.view-components.configurable-chart.series.values'),
            data: linePts
          }
        ];
        this.stackedChartSeries = buildBarSeries(categories, totals);
        this.pieSeries = buildPieSeries(categories, totals);
        this.cdr.markForCheck();
      });
  }

  private applyHeader(c: IConfigurableChartProperties): void {
    const t = (c.chartTitle ?? '').trim();
    this.chartHeader = t ? { title: t, allowHideLegend: true } : undefined;
  }

  private clearSeries(): void {
    this.rawRowCount = 0;
    this.xAxis = { title: '', categories: [] };
    this.lineSeries = [];
    this.stackedChartSeries = [{ name: 'Values', data: [] }];
    this.pieSeries = [];
  }

  get pieInnerRadius(): number {
    return this.chartKind === 'donut' ? 45 : 0;
  }

  get hasRenderableChart(): boolean {
    return this.xAxis.categories.length > 0 && !this.errorMessage;
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    switch (propertyPath) {
      case 'hidden':
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      default:
        return throwError(
          () => new Error(`ConfigurableChart: property ${propertyPath} is not settable.`)
        );
    }
  }
}
