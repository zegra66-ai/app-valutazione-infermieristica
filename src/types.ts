export interface VitalSigns {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  respiratoryRate: number;
  temperature: number;
  spo2: number;
  painLevel: number;
}

export interface PhysicalAssessment {
  neurological: string;
  respiratory: string;
  cardiovascular: string;
  gastrointestinal: string;
  genitourinary: string;
  integumentary: string;
  musculoskeletal: string;
}

export interface ClinicalEvaluation {
  id: string;
  date: string;
  patientInitials: string;
  vitals: VitalSigns;
  assessment: PhysicalAssessment;
  nursingDiagnosis: string;
  interventions: string[];
  notes: string;
}

export interface ReferenceValue {
  parameter: string;
  range: string;
  unit: string;
  category: 'Vitals' | 'Lab' | 'Scale';
}
