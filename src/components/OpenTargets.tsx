import React from "react";
import { useQuery } from "@apollo/client";
import { Bar } from "react-chartjs-2";
import client from "../apollo";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";

interface Target {
  id: string;
  approvedSymbol: string;
  approvedName: string;
}

interface DatatypeScore {
  id: string;
  score: number;
}

interface Row {
  target: Target;
  score: number;
  datatypeScores: DatatypeScore[];
}

interface AssociatedTargets {
  rows: Row[];
}

interface DiseaseData {
  disease: {
    associatedTargets: AssociatedTargets;
  };
}

const OPEN_TARGETS_QUERY = gql`
  query lungCarcinomaAssociatedTargets {
    disease(efoId: "EFO_0001071") {
      associatedTargets(page: { index: 0, size: 10 }) {
        rows {
          target {
            id
            approvedSymbol
            approvedName
          }
          score
        }
      }
    }
  }
`;

const OpenTargets = () => {
  const { loading, error, data } = useQuery<DiseaseData>(OPEN_TARGETS_QUERY, {
    client: client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const targets = data?.disease.associatedTargets.rows;

  return (
    <div className="px-12 mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Top 10 Targets by Overall Association Score
      </h1>
      <table className="w-full border-collapse">
        <thead className="bg-emerald-500 text-white">
          <tr>
            <th className="p-2 border">Target Symbol</th>
            <th className="p-2 border">Overall Score</th>
            <th className="p-2 border">Approved Name</th>
          </tr>
        </thead>
        <tbody>
          {targets?.slice(0, 10).map((row, index) => (
            <tr key={index}>
              <td className="p-2 border text-center hover:text-emerald-600">
                <Link
                  to={`https://platform.opentargets.org/target/${row.target.id}/associations`}
                >
                  {row.target.approvedSymbol}
                </Link>
              </td>

              <td className="p-2 border text-center">{row.score.toFixed(4)}</td>
              <td className="p-2 border text-center">
                {row.target.approvedName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenTargets;
