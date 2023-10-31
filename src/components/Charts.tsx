import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { DiseaseData, Target } from "../types";
import { OPEN_TARGETS_QUERY } from "../queries";
import { useQuery } from "@apollo/client";
import client from "../apollo";


interface ChartsProps {
  target: Target;
}

const Charts = ({ target }: ChartsProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const { loading, error, data } = useQuery<DiseaseData>(OPEN_TARGETS_QUERY, {
    client: client,
  });

  console.log(data)

  useEffect(() => {
    if (!canvasRef.current) return;

    const datatypeScores = target.datatypeScores;

    // Destroy the existing Chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Extract scores and labels from datatypeScores
    const labels = datatypeScores?.map((score) => score.id);
    const scores = datatypeScores?.map((score) => score.score);

    console.log(scores)

    // Create a new chart with proper type definitions
    const ctx = canvasRef.current;
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels as string[], // Typecast to match expected type
        datasets: [
          {
            label: "Association Scores",
            data: scores as number[], // Typecast to match expected type
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [target.datatypeScores]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Association Scores for {target.approvedSymbol}
      </h2>
      <canvas ref={canvasRef} width="400" height="200"></canvas>
    </div>
  );
};

export default Charts;
