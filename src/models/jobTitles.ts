export interface JobTitleTranslation {
  id?: number;
  job_title_id?: number;
  name?: string;
  language_code?: string;
}

export interface JobTitle {
  id?: number;
  translations: JobTitleTranslation[];
  icon?: string;
  flat_photo_path?: string;
  outline_photo_path?: string;
  fill_photo_path?: string;
  png_photo_path?: string;
}
