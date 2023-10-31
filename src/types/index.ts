export interface Target {
  id: string;
  approvedSymbol: string;
  approvedName: string;
  datatypeScores?: DatatypeScore[]; 
}
export interface DatatypeScore {
  id: string;
  score: number;
}

export interface Row {
  target: Target;
  score: number;
  datatypeScores: DatatypeScore[];
}

export interface AssociatedTargets {
  rows: Row[];
}

export interface DiseaseData {
  disease: {
    associatedTargets: AssociatedTargets;
  };
}
