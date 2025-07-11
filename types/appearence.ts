// Types
export interface AppearanceSettings {
  theme: string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

export interface Language {
  value: string;
  label: string;
}

export interface Currency {
  value: string;
  label: string;
}

export interface AppearanceSettingsProps {
  onSave?: (settings: AppearanceSettings) => void;
  onExport?: () => void;
  initialSettings?: Partial<AppearanceSettings>;
}
