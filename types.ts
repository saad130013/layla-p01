
export type AreaType = 'Public Area' | 'High Risk Area' | 'Mid Risk Area';

export interface ObservationOption {
  label: string;
  checked: boolean;
}

export interface InspectionItem {
  no: number;
  title: string;
  titleArabic?: string;
  maxScore: number;
  lowScoreMarker?: number;
  givenScore: number;
  observations: ObservationOption[];
  inspectorComment?: string;
}

export interface InspectionData {
  id: string;
  formNumber: string;
  date: string;
  time: string;
  areaRoom: string;
  areaType: AreaType;
  inspectorName: string;
  supervisorName: string;
  items: InspectionItem[];
  comments: string;
  missingTools: string[];
  isToolAvailable: boolean;
  totalScore: number;
  maxTotalScore: number;
}

export type StyleVariant = 'Classic' | 'Executive' | 'Slate' | 'Sand' | 'Minimal';

export interface AppSettings {
  style: StyleVariant;
  includeSummary: boolean;
}
