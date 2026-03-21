/**
 * @generated
 * @context Shared mock / future API types for DataIngest Admin and User view components.
 * @modified 2026-03-21
 */

export interface IDataIngestTemplateCard {
  id: number;
  name: string;
  cat: string;
  cols: number;
  status: 'published' | 'draft';
  subs: number;
  icon: string;
  desc: string;
}

export interface IDataIngestSubmissionRow {
  id: string;
  tmpl: string;
  user: string;
  rows: number;
  errs: number;
  status: 'success' | 'partial' | 'failed';
  date: string;
}
