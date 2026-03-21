/**
 * @generated
 * @context View Designer placeholder for DataIngest Admin VC.
 * @decisions Minimal hint — full UI at runtime matches dataingest-v2.html Admin persona.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-21
 */
import { Component, Input } from '@angular/core';
import { DataIngestAdminDesignModel } from './data-ingest-admin-design.model';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-data-ingest-admin-design',
  styleUrls: ['./data-ingest-admin-design.component.scss'],
  templateUrl: './data-ingest-admin-design.component.html'
})
export class DataIngestAdminDesignComponent {
  @Input()
  model!: DataIngestAdminDesignModel;
}
