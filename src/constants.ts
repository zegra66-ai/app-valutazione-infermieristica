import { ReferenceValue } from './types';

export const NORMAL_RANGES: ReferenceValue[] = [
  { parameter: 'Frequenza Cardiaca', range: '60 - 100', unit: 'bpm', category: 'Vitals' },
  { parameter: 'Pressione Sistolica', range: '90 - 120', unit: 'mmHg', category: 'Vitals' },
  { parameter: 'Pressione Diastolica', range: '60 - 80', unit: 'mmHg', category: 'Vitals' },
  { parameter: 'Frequenza Respiratoria', range: '12 - 20', unit: 'atti/min', category: 'Vitals' },
  { parameter: 'Saturazione (SpO2)', range: '95 - 100', unit: '%', category: 'Vitals' },
  { parameter: 'Temperatura', range: '36.0 - 37.2', unit: '°C', category: 'Vitals' },
  { parameter: 'Glicemia (digiuno)', range: '70 - 100', unit: 'mg/dL', category: 'Lab' },
  { parameter: 'Emoglobina (U)', range: '13.5 - 17.5', unit: 'g/dL', category: 'Lab' },
  { parameter: 'Emoglobina (D)', range: '12.0 - 15.5', unit: 'g/dL', category: 'Lab' },
  { parameter: 'Creatinina', range: '0.7 - 1.3', unit: 'mg/dL', category: 'Lab' },
];

export const ASSESSMENT_CATEGORIES = [
  { id: 'neurological', label: 'Neurologico', icon: 'Brain' },
  { id: 'respiratory', label: 'Respiratorio', icon: 'Wind' },
  { id: 'cardiovascular', label: 'Cardiovascolare', icon: 'Heart' },
  { id: 'gastrointestinal', label: 'Gastrointestinale', icon: 'Activity' },
  { id: 'genitourinary', label: 'Genitourinario', icon: 'Droplets' },
  { id: 'integumentary', label: 'Tegumentario', icon: 'User' },
  { id: 'musculoskeletal', label: 'Muscoloscheletrico', icon: 'Dna' },
];
