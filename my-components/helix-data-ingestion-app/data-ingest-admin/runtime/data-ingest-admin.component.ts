/**
 * @generated
 * @context DataIngest Admin runtime — shell, pages, 4-step modal wizard per dataingest-v2.html; mock data until record APIs.
 * @decisions OnPush; RxNotificationService toasts; RxCurrentUserService for sidebar chip; no RBAC.
 * @references cookbook/02-ui-view-components.md, CONTEXT.md
 * @modified 2026-03-21
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RxCurrentUserService, RxNotificationService } from '@helix/platform/shared/api';
import { RxViewComponent } from '@helix/platform/view/api';
import { BaseViewComponent, IViewComponent } from '@helix/platform/view/runtime';
import { Observable } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import type { IDataIngestSubmissionRow, IDataIngestTemplateCard } from '../../data-ingest.models';
import { IDataIngestAdminProperties } from '../data-ingest-admin.types';

export type DataIngestAdminPage = 'admin-dash' | 'admin-templates' | 'admin-submissions' | 'admin-settings';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-data-ingest-admin',
  styleUrls: ['./data-ingest-admin.component.scss'],
  templateUrl: './data-ingest-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-data-ingest-admin'
})
export class DataIngestAdminComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config!: Observable<IDataIngestAdminProperties>;

  protected state!: IDataIngestAdminProperties;

  readonly pageTitles: Record<DataIngestAdminPage, string> = {
    'admin-dash': 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.page.dashboard',
    'admin-templates': 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.page.templates',
    'admin-submissions': 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.page.submissions',
    'admin-settings': 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.page.settings'
  };

  curPage: DataIngestAdminPage = 'admin-dash';
  wizardOpen = false;
  wizardStep = 1;
  wizardTab2: 'mapping' | 'dup2' | 'opts2' = 'mapping';

  wizardJobName = '';
  wizardJobDesc = '';
  wizardFileName: string | null = null;
  wizardSelectedTable = 'Product';
  wizardDupMode = 'generate-all';

  wizardMappingRows: { source: string; target: string }[] = [];
  wizardValRows: { field: string; ruleType: string; value: string; onError: string }[] = [];

  optTrim = true;
  optDate = true;
  optCurrency = false;
  optStopOnError = false;

  readonly wizardSteps = [
    { labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s1', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s1d' },
    { labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s2', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s2d' },
    { labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s3', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s3d' },
    { labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s4', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.wizard.s4d' }
  ];

  readonly dupOptions = [
    { mode: 'generate-all', labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.all', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.all-d' },
    { mode: 'generate-dup', labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.gendup', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.gendup-d' },
    { mode: 'reject', labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.reject', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.reject-d' },
    { mode: 'replace', labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.replace', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.replace-d' },
    { mode: 'update', labelKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.update', descKey: 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.dup.update-d' }
  ];

  readonly srcFields = [
    'Product Name',
    'SKU Code',
    'Category',
    'Unit Price',
    'Stock Qty',
    'Launch Date',
    'Brand',
    'Description',
    'Weight',
    'Dimensions'
  ];

  readonly tgtFields = [
    'Data Set Id',
    'Name',
    'SKU',
    'Price',
    'Quantity',
    'Category ID',
    'Brand Name',
    'Description',
    'Status',
    'Created Date'
  ];

  readonly dbTables = [
    'Product',
    'Employee',
    'Vendor',
    'Asset',
    'Department',
    'CostCenter',
    'ABYI-AdditionalFields-Parent'
  ];

  templates: IDataIngestTemplateCard[] = [
    {
      id: 1,
      name: 'Product Catalog',
      cat: 'Commerce',
      cols: 12,
      status: 'published',
      subs: 34,
      icon: '◈',
      desc: 'Bulk create or update product listings.'
    },
    {
      id: 2,
      name: 'Vendor Onboarding',
      cat: 'Procurement',
      cols: 8,
      status: 'published',
      subs: 17,
      icon: '◎',
      desc: 'Register new suppliers and compliance data.'
    },
    {
      id: 3,
      name: 'Employee Directory',
      cat: 'HR',
      cols: 15,
      status: 'draft',
      subs: 0,
      icon: '⬟',
      desc: 'Import employee records and org structure.'
    },
    {
      id: 4,
      name: 'Asset Register',
      cat: 'IT',
      cols: 10,
      status: 'published',
      subs: 8,
      icon: '▣',
      desc: 'Track hardware and software assets.'
    }
  ];

  submissions: IDataIngestSubmissionRow[] = [
    { id: 'SUB-041', tmpl: 'Product Catalog', user: 'Priya S.', rows: 204, errs: 0, status: 'success', date: '2 hrs ago' },
    { id: 'SUB-040', tmpl: 'Vendor Onboarding', user: 'Rahul M.', rows: 12, errs: 3, status: 'partial', date: '5 hrs ago' },
    { id: 'SUB-039', tmpl: 'Asset Register', user: 'Lin T.', rows: 88, errs: 0, status: 'success', date: 'Yesterday' },
    { id: 'SUB-038', tmpl: 'Product Catalog', user: 'Amar K.', rows: 56, errs: 12, status: 'failed', date: '2 days ago' },
    { id: 'SUB-037', tmpl: 'Vendor Onboarding', user: 'Priya S.', rows: 5, errs: 0, status: 'success', date: '3 days ago' }
  ];

  settingsPlatformName = 'DataIngest Platform';
  settingsMaxMb = 50;
  settingsAllowed = '.csv, .xlsx, .xls';
  settingsEmail = true;
  settingsErr = true;
  settingsDigest = false;

  tableSearch = '';

  sidebarUserName = '—';
  sidebarUserRole = 'Administrator';
  sidebarInitials = '—';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
    private readonly rxNotificationService: RxNotificationService,
    private readonly rxCurrentUserService: RxCurrentUserService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.config
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroyed$)
      )
      .subscribe((c: IDataIngestAdminProperties) => {
        this.state = { ...c };
        this.isHidden = Boolean(c.hidden);
        this.cdr.markForCheck();
      });

    const u = this.rxCurrentUserService.get();
    const full = u?.fullName?.trim() || u?.loginName || '—';
    this.sidebarUserName = full;
    this.sidebarInitials = this.initials(full);
  }

  private initials(name: string): string {
    const p = name.split(/\s+/).filter(Boolean);
    if (p.length === 0) {
      return '—';
    }
    if (p.length === 1) {
      return p[0].slice(0, 2).toUpperCase();
    }
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  nav(page: DataIngestAdminPage): void {
    this.curPage = page;
    this.cdr.markForCheck();
  }

  openWizard(): void {
    this.wizardOpen = true;
    this.wizardStep = 1;
    this.wizardTab2 = 'mapping';
    this.wizardJobName = '';
    this.wizardJobDesc = '';
    this.wizardFileName = null;
    this.wizardSelectedTable = 'Product';
    this.wizardDupMode = 'generate-all';
    this.wizardMappingRows = this.srcFields.slice(0, 4).map((s, i) => ({ source: s, target: this.tgtFields[i] ?? '' }));
    this.wizardValRows = [
      { field: 'Product Name', ruleType: 'required', value: '', onError: 'skip row' },
      { field: 'SKU Code', ruleType: 'regex', value: '^[A-Z]{2}-\\d{4}$', onError: 'skip row' },
      { field: 'Unit Price', ruleType: 'min value', value: '0', onError: 'skip row' },
      { field: 'Unit Price', ruleType: 'decimal places', value: '2', onError: 'warn' },
      { field: 'Product Name', ruleType: 'max length', value: '120', onError: 'warn' }
    ];
    this.cdr.markForCheck();
  }

  closeWizard(): void {
    this.wizardOpen = false;
    this.cdr.markForCheck();
  }

  wizardBack(): void {
    if (this.wizardStep > 1) {
      this.wizardStep -= 1;
      this.cdr.markForCheck();
    }
  }

  wizardNext(): void {
    if (this.wizardStep === 4) {
      this.rxNotificationService.addSuccessMessage(this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-admin.toast.published'));
      this.closeWizard();
      return;
    }
    this.wizardStep += 1;
    this.cdr.markForCheck();
  }

  goWizardStep(step: number): void {
    if (step >= 1 && step <= this.wizardStep) {
      this.wizardStep = step;
      this.cdr.markForCheck();
    }
  }

  setWizardTab2(tab: 'mapping' | 'dup2' | 'opts2'): void {
    this.wizardTab2 = tab;
    this.cdr.markForCheck();
  }

  selectDup(mode: string): void {
    this.wizardDupMode = mode;
    this.cdr.markForCheck();
  }

  selectTable(name: string): void {
    this.wizardSelectedTable = name;
    this.cdr.markForCheck();
  }

  simulateWizardUpload(): void {
    this.wizardFileName = 'Employee_Extension_Interface_Template.xlsx';
    this.rxNotificationService.addSuccessMessage(this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-admin.toast.uploaded'));
    this.cdr.markForCheck();
  }

  addMappingRow(): void {
    const i = this.wizardMappingRows.length;
    this.wizardMappingRows = [
      ...this.wizardMappingRows,
      { source: this.srcFields[i % this.srcFields.length] ?? '—', target: '' }
    ];
    this.cdr.markForCheck();
  }

  removeMappingRow(index: number): void {
    this.wizardMappingRows = this.wizardMappingRows.filter((_, j) => j !== index);
    this.cdr.markForCheck();
  }

  autoMap(): void {
    this.wizardMappingRows = this.srcFields.slice(0, 6).map((s, i) => ({ source: s, target: this.tgtFields[i] ?? '' }));
    this.rxNotificationService.addSuccessMessage(this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-admin.toast.automap'));
    this.cdr.markForCheck();
  }

  addValRow(): void {
    this.wizardValRows = [
      ...this.wizardValRows,
      { field: 'Product Name', ruleType: 'required', value: '', onError: 'skip row' }
    ];
    this.cdr.markForCheck();
  }

  removeValRow(index: number): void {
    this.wizardValRows = this.wizardValRows.filter((_, j) => j !== index);
    this.cdr.markForCheck();
  }

  notify(msgKey: string): void {
    this.rxNotificationService.addSuccessMessage(this.translate.instant(msgKey));
  }

  saveSettings(): void {
    this.notify('com.amar.helix-vibe-studio.view-components.data-ingest-admin.toast.settings-saved');
  }

  filteredTables(): string[] {
    const q = this.tableSearch.trim().toLowerCase();
    if (!q) {
      return this.dbTables;
    }
    return this.dbTables.filter((t) => t.toLowerCase().includes(q));
  }

  statusBadgeClass(s: IDataIngestSubmissionRow['status']): string {
    if (s === 'success') {
      return 'dia-badge dia-badge--green';
    }
    if (s === 'partial') {
      return 'dia-badge dia-badge--amber';
    }
    return 'dia-badge dia-badge--red';
  }

  statusLabelKey(s: IDataIngestSubmissionRow['status']): string {
    if (s === 'success') {
      return 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.status.success';
    }
    if (s === 'partial') {
      return 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.status.partial';
    }
    return 'com.amar.helix-vibe-studio.view-components.data-ingest-admin.status.failed';
  }
}
