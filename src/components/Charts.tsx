import { useState } from "react";
import { DiseaseData, Target } from "../types";
import { OPEN_TARGETS_QUERY } from "../queries";
import { useQuery } from "@apollo/client";
import client from "../apollo";
import { Bar, Radar } from "react-chartjs-2";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ChartsProps {
  target: Target;
}

// Define types for labels and scores
type Labels = string[];
type Scores = number[];

const Charts = ({ target }: ChartsProps) => {
  const { loading, error, data } = useQuery<DiseaseData>(OPEN_TARGETS_QUERY, {
    client: client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Initialize an object to store chart data for each target
  const chartDataMap: Record<string, ChartData> = {};

  data?.disease.associatedTargets.rows.forEach((row) => {
    const approvedSymbol = row.target.approvedSymbol;
    const labels: Labels = row.datatypeScores.map((datatype) => datatype.id);
    const scores: Scores = row.datatypeScores.map((datatype) => datatype.score);

    // Create chart data for each target
    chartDataMap[approvedSymbol] = {
      labels,
      datasets: [
        {
          label: `Association Scores for ${approvedSymbol}`,
          data: scores,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  });

  return (
    <div>
      <div key={target.approvedSymbol}>
        <h2 className="text-2xl font-bold mb-4">
          Association Scores for {target.approvedSymbol}
        </h2>
        <Bar data={chartDataMap[target.approvedSymbol]} />
      </div>
    </div>
  );
};

export default Charts;

// Define ChartData type
type ChartData = {
  labels: Labels;
  datasets: ChartDataset[];
};

type ChartDataset = {
  label: string;
  data: Scores;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
};
