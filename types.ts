
export type AreaType = 'Public' | 'High Risk' | 'Mid Risk';

export interface ObservationOption {
  label: string;
  checked: boolean;
}

export interface InspectionItem {
  no: number;
  title: string;
  titleArabic?: string;
  maxScore: number;
  givenScore: number;
  observations: ObservationOption[];
  inspectorComment?: string;
}

export interface InspectionData {
  id: string;
  date: string;
  time: string;
  areaRoom: string;
  areaType: AreaType;
  inspectorName: string;
  inspectorSignature?: string;
  supervisorReviewer: string;
  approver: string;
  items: InspectionItem[];
  unavailableTools: string[];
  isSupervisorAvailable: boolean;
  totalScore: number;
  maxTotalScore: number;
}

export type StyleVariant = 'Classic' | 'Modern' | 'Audit' | 'Emerald' | 'Minimal';

export interface AppSettings {
  style: StyleVariant;
  includeSummary: boolean;
}
