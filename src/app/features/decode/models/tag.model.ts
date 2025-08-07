export interface TagData {
    value: string;
    severity: severityType;
}

type severityType = 'info' | 'success' | 'warning' | 'danger';