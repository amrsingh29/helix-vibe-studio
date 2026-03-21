/**
 * @generated
 * @context DataIngest User runtime — workspace, 3-step upload, history per dataingest-v2.html.
 * @decisions Mock validation panel after simulated upload; RxCurrentUserService for chip.
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
import { IDataIngestUserProperties } from '../data-ingest-user.types';

export type DataIngestUserPage = 'user-dash' | 'user-upload' | 'user-history';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-data-ingest-user',
  styleUrls: ['./data-ingest-user.component.scss'],
  templateUrl: './data-ingest-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslateModule]
})
@RxViewComponent({
  name: 'com-amar-helix-vibe-studio-data-ingest-user'
})
export class DataIngestUserComponent extends BaseViewComponent implements OnInit, IViewComponent {
  @Input()
  config!: Observable<IDataIngestUserProperties>;

  protected state!: IDataIngestUserProperties;

  readonly pageTitles: Record<DataIngestUserPage, string> = {
    'user-dash': 'com.amar.helix-vibe-studio.view-components.data-ingest-user.page.workspace',
    'user-upload': 'com.amar.helix-vibe-studio.view-components.data-ingest-user.page.upload',
    'user-history': 'com.amar.helix-vibe-studio.view-components.data-ingest-user.page.history'
  };

  curPage: DataIngestUserPage = 'user-dash';
  uploadStep = 1;
  selTmpl: number | null = null;
  uploadSimulated = false;
  submissionNote = '';
  templateSearch = '';
  categoryFilter = 'all';

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
    { id: 'SUB-037', tmpl: 'Vendor Onboarding', user: 'Priya S.', rows: 5, errs: 0, status: 'success', date: '3 days ago' },
    { id: 'SUB-036', tmpl: 'Product Catalog', user: 'Priya S.', rows: 145, errs: 0, status: 'success', date: '4 days ago' },
    { id: 'SUB-035', tmpl: 'Asset Register', user: 'Priya S.', rows: 22, errs: 2, status: 'partial', date: '1 week ago' }
  ];

  historyRows = [...this.submissions];

  sidebarUserName = '—';
  sidebarInitials = '—';
  readonly sidebarUserRole = 'Data Custodian';

  previewRows: string[][] = [
    ['Apex Wireless Headphones', 'AP-2401', 'Audio', '$129.00', '50'],
    ['Summit Laptop Stand', 'SM-1103', 'Accessories', '$49.99', '200'],
    ['Flux USB-C Hub', 'FL-0892', 'Connectivity', '$79.00', '120']
  ];

  previewHeaders = ['Product Name', 'SKU', 'Category', 'Price', 'Qty'];

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
      .subscribe((c: IDataIngestUserProperties) => {
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

  nav(page: DataIngestUserPage): void {
    this.curPage = page;
    if (page === 'user-upload') {
      this.uploadStep = 1;
      this.uploadSimulated = false;
    }
    this.cdr.markForCheck();
  }

  selectTemplate(id: number): void {
    this.selTmpl = id;
    this.cdr.markForCheck();
  }

  filteredPublishedTemplates(): IDataIngestTemplateCard[] {
    return this.templates.filter((t) => {
      if (t.status !== 'published') {
        return false;
      }
      const q = this.templateSearch.trim().toLowerCase();
      if (q && !t.name.toLowerCase().includes(q)) {
        return false;
      }
      if (this.categoryFilter !== 'all' && t.cat !== this.categoryFilter) {
        return false;
      }
      return true;
    });
  }

  nextUploadStep(): void {
    if (this.uploadStep === 1 && this.selTmpl) {
      this.uploadStep = 2;
      this.uploadSimulated = false;
      this.cdr.markForCheck();
    }
  }

  simulateUpload(): void {
    this.uploadSimulated = true;
    this.cdr.markForCheck();
  }

  goConfirm(): void {
    if (this.uploadSimulated) {
      this.uploadStep = 3;
      this.cdr.markForCheck();
    }
  }

  submitUpload(): void {
    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-user.toast.submitted')
    );
    this.uploadStep = 1;
    this.selTmpl = null;
    this.uploadSimulated = false;
    this.nav('user-history');
  }

  downloadBlank(): void {
    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-user.toast.download-template')
    );
  }

  selectedTemplateName(): string {
    const t = this.templates.find((x) => x.id === this.selTmpl);
    return t?.name ?? '—';
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

  toastErrorReport(): void {
    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-user.toast.err-report')
    );
  }

  toastExport(): void {
    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-user.toast.export')
    );
  }

  toastViewDetail(): void {
    this.rxNotificationService.addSuccessMessage(
      this.translate.instant('com.amar.helix-vibe-studio.view-components.data-ingest-admin.toast.sub-detail')
    );
  }

  backToUploadStep1(): void {
    this.uploadStep = 1;
    this.uploadSimulated = false;
    this.cdr.markForCheck();
  }
}
