/**
 * @generated
 * @context View Designer placeholder for DataIngest User VC.
 * @modified 2026-03-21
 */
import { Component, Input } from '@angular/core';
import { DataIngestUserDesignModel } from './data-ingest-user-design.model';

@Component({
  standalone: true,
  selector: 'com-amar-helix-vibe-studio-data-ingest-user-design',
  styleUrls: ['./data-ingest-user-design.component.scss'],
  templateUrl: './data-ingest-user-design.component.html'
})
export class DataIngestUserDesignComponent {
  @Input()
  model!: DataIngestUserDesignModel;
}
