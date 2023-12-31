import { ChartData, DiseaseData, Labels, Scores, Target } from "../types";
import { OPEN_TARGETS_QUERY } from "../queries";
import { useQuery } from "@apollo/client";
import client from "../apollo";
import { Bar, Radar } from "react-chartjs-2";

import { Chart, registerables } from "chart.js";
import { useState } from "react";
import { formatLabel } from "../utils";
import { BeatLoader } from "react-spinners";

Chart.register(...registerables);

interface ChartsProps {
  target: Target;
}

const Charts = ({ target }: ChartsProps) => {
  const [activeTab, setActiveTab] = useState<"bar" | "radar">("bar");

  const { loading, error, data } = useQuery<DiseaseData>(OPEN_TARGETS_QUERY, {
    client: client,
  });

  if (loading) {
    // Render the BeatLoader from react-spinners while loading
    return (
      <div className="spinner-container">
        <BeatLoader size={15} margin={5} color={'#36D7B7'} loading={true} />
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  // Initialize an object to store chart data for each target
  const chartDataMap: Record<string, ChartData> = {};

  data?.disease.associatedTargets.rows.forEach((row) => {
    const approvedSymbol = row.target.approvedSymbol;
    const labels: Labels = row.datatypeScores.map((datatype) => formatLabel(datatype.id));
    const scores: Scores = row.datatypeScores.map((datatype) => datatype.score);

    // Create chart data for each target
    chartDataMap[approvedSymbol] = {
      labels,
      datasets: [
        {
          label: `Data Type Scores: ${target.approvedSymbol} and lung carcinoma`,
          data: scores,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  });

  const chart =
    activeTab === "bar" ? (
      <Bar data={chartDataMap[target.approvedSymbol]} />
    ) : (
      <Radar data={chartDataMap[target.approvedSymbol]} />
    );

  return (
    <div>
      <div key={target.approvedSymbol}>
        <h2 className="text-2xl font-bold mb-4">
          Data Type Scores: {target.approvedSymbol} and lung carcinoma
        </h2>
        <div className="space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("bar")}
            className={`${
              activeTab === "bar" ? "bg-emerald-500" : "bg-emerald-200"
            } text-white px-2 py-1 rounded-md`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`${
              activeTab === "radar" ? "bg-emerald-500" : "bg-emerald-200"
            } text-white px-2 py-1 rounded-md`}
          >
            Radar Chart
          </button>
        </div>
      </div>
      {chart}
    </div>
  );
};

export default Charts;
