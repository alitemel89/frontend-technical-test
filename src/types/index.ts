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

// Define types for labels and scores
export type Labels = string[];
export type Scores = number[];

export interface ChartData {
    labels: Labels;
    datasets: ChartDataset[];
  };
  
  export interface ChartDataset {
    label: string;
    data: Scores;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  
