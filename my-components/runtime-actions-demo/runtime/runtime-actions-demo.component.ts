/**
 * @generated
 * @context Runtime: triggerSinkActions for configured rx-actions; legacy direct services when sink has no enabled actions.
 * @decisions Prefer platform action execution via sink guid; legacy path unchanged for migration.
 * @references cookbook/04-ui-services-and-apis.md, BaseViewComponent.triggerSinkActions
 * @modified 2026-03-21
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AdaptButtonModule } from '@bmc-ux/adapt-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IPlainObject, RxLogService, RxNotificationService } from '@helix/platform/shared/api';
import { OpenViewActionType, RxViewComponent } from '@helix/platform/view/api';
import { RxLaunchProcessViewActionService, RxOpenViewActionService } from '@helix/platform/view/actions';
import { ILaunchProcessViewActionParams } from '@helix/platform/view/actions/launch-process/launch-process-view-action.types';
import { IOpenViewActionParams } from '@helix/platform/view/actions/open-view/open-view-action.types';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IRuntimeActionsDemoProperties } from '../runtime-actions-demo.types';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-runtime-actions-demo',
  styleUrls: ['./runtime-actions-demo.component.scss'],
  templateUrl: './runtime-actions-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AdaptButtonModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-runtime-actions-demo'
})
export class RuntimeActionsDemoComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config!: Observable<IRuntimeActionsDemoProperties>;

  api = {
    setProperty: this.setProperty.bind(this)
  };

  protected state!: IRuntimeActionsDemoProperties;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly rxLogService: RxLogService,
    private readonly translate: TranslateService,
    private readonly rxOpenViewActionService: RxOpenViewActionService,
    private readonly rxLaunchProcessViewActionService: RxLaunchProcessViewActionService,
    private readonly rxNotificationService: RxNotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notifyPropertyChanged('api', this.api);

    this.config
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroyed$)
      )
      .subscribe((c: IRuntimeActionsDemoProperties) => {
        this.state = { ...c };
        this.isHidden = Boolean(c.hidden);
        this.cdr.markForCheck();
      });
  }

  onOpenView(): void {
    if (this.tryRunSinkActions('openViewActions')) {
      return;
    }

    const viewDef = (this.state?.targetViewDefinitionName ?? '').trim();
    if (!viewDef) {
      this.rxNotificationService.addWarningMessage(
        this.translate.instant(
          'com.amar.helix-vibe-studio.view-components.runtime-actions-demo.warn-no-view-name'
        )
      );
      this.rxLogService.debug('RuntimeActionsDemo: open view skipped — no actions and empty targetViewDefinitionName.');
      return;
    }

    const presentationType = resolveOpenViewPresentationType(this.state?.openViewPresentationType);
    const modalTitle = (this.state?.openViewModalTitle ?? '').trim();
    const params: IOpenViewActionParams = {
      viewDefinitionName: viewDef,
      viewParams: this.buildViewParams(this.state?.openViewParamsJson),
      presentation: {
        type: presentationType,
        ...(modalTitle ? { title: modalTitle } : {})
      }
    };

    this.rxOpenViewActionService
      .execute(params)
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => {
          this.rxLogService.debug('RuntimeActionsDemo: open view cancelled or dismissed.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.rxLogService.debug('RuntimeActionsDemo: open view closed.');
        this.cdr.markForCheck();
      });
  }

  onLaunchProcess(): void {
    if (this.tryRunSinkActions('launchProcessActions')) {
      return;
    }

    const proc = (this.state?.targetProcessDefinitionName ?? '').trim();
    if (!proc) {
      this.rxNotificationService.addWarningMessage(
        this.translate.instant(
          'com.amar.helix-vibe-studio.view-components.runtime-actions-demo.warn-no-process-name'
        )
      );
      this.rxLogService.debug(
        'RuntimeActionsDemo: launch process skipped — no actions and empty targetProcessDefinitionName.'
      );
      return;
    }

    const message = (this.state?.demoMessage ?? '').trim();
    const processParams: ILaunchProcessViewActionParams = {
      processDefinitionName: proc,
      waitForProcessCompletion: true,
      actionProcessInputParams: {
        message
      }
    };

    this.rxLaunchProcessViewActionService
      .execute(processParams)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((err: unknown) => {
          this.rxLogService.error(`RuntimeActionsDemo: launch process failed: ${String(err)}`);
          this.rxNotificationService.addWarningMessage(
            this.translate.instant(
              'com.amar.helix-vibe-studio.view-components.runtime-actions-demo.warn-process-failed'
            )
          );
          return EMPTY;
        })
      )
      .subscribe((out: IPlainObject) => {
        this.rxLogService.debug(
          `${this.translate.instant('com.amar.helix-vibe-studio.view-components.runtime-actions-demo.log-process-done')} ${JSON.stringify(out)}`
        );
        this.cdr.markForCheck();
      });
  }

  onShowNotification(): void {
    if (this.tryRunSinkActions('notificationActions')) {
      return;
    }

    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.runtime-actions-demo.notify-success')
    );
    this.rxNotificationService.addWarningMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.runtime-actions-demo.notify-warning')
    );
  }

  /**
   * Runs rx-actions configured under the named action sink (same execution path as palette Button).
   * @returns true when a non-empty chain was started
   */
  private tryRunSinkActions(sinkName: string): boolean {
    const guid = this.state?.actionSinks?.find((s) => s.name === sinkName)?.guid;
    if (!guid) {
      return false;
    }
    const enabled = this.runtimeViewModelApi.getEnabledActions(guid);
    if (!enabled.length) {
      return false;
    }
    this.triggerSinkActions(sinkName)
      .pipe(
        takeUntil(this.destroyed$),
        catchError(() => EMPTY)
      )
      .subscribe(() => this.cdr.markForCheck());
    return true;
  }

  private buildViewParams(json: string | undefined): Record<string, string> {
    const fallback: Record<string, string> = { demo: 'runtime-actions-demo' };
    const raw = (json ?? '').trim();
    if (!raw) {
      return fallback;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          out[k] = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
        }
        return Object.keys(out).length ? out : fallback;
      }
    } catch {
      this.rxLogService.debug('RuntimeActionsDemo: openViewParamsJson invalid; using default viewParams.');
    }
    return fallback;
  }

  private setProperty(propertyPath: string, propertyValue: unknown): void | Observable<never> {
    switch (propertyPath) {
      case 'hidden': {
        this.state = { ...this.state, hidden: propertyValue as boolean };
        this.isHidden = Boolean(propertyValue);
        this.notifyPropertyChanged(propertyPath, propertyValue);
        this.cdr.markForCheck();
        break;
      }
      default: {
        return throwError(() => new Error(`RuntimeActionsDemo: property ${propertyPath} is not settable.`));
      }
    }
  }
}

function resolveOpenViewPresentationType(raw: string | undefined): OpenViewActionType {
  const v = (raw ?? '').trim();
  const allowed = Object.values(OpenViewActionType) as string[];
  if (v && allowed.includes(v)) {
    return v as OpenViewActionType;
  }
  return OpenViewActionType.CenteredModal;
}
