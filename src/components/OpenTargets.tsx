import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import client from "../apollo";
import { Link } from "react-router-dom";
import Charts from "./Charts";
import { OPEN_TARGETS_QUERY } from "../queries";
import { DiseaseData } from "../types";
import { BeatLoader } from "react-spinners";

const OpenTargets = () => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const { loading, error, data } = useQuery<DiseaseData>(OPEN_TARGETS_QUERY, {
    client: client,
  });

  if (loading) {
    // Render the BeatLoader from react-spinners while loading
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h4 className="text-emerald-500 text-xl">Loading...</h4>
        <BeatLoader size={15} margin={5} color={"#36D7B7"} loading={true} />
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  const targets = data?.disease.associatedTargets.rows;
  console.log(targets);

  const toggleRow = (rowIndex: number) => {
    setExpandedRows({
      ...expandedRows,
      [rowIndex]: !expandedRows[rowIndex],
    });
  };

  return (
    <div className="px-12 mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold mb-4 text-center mt-4">
        Top 10 Targets by Overall Association Score
      </h1>
      <table className="w-full border-collapse">
        <thead className="bg-emerald-500 text-white">
          <tr>
            <th className="p-2 border"></th>
            <th className="p-2 border">Target Symbol</th>
            <th className="p-2 border">Overall Score</th>
            <th className="p-2 border">Approved Name</th>
          </tr>
        </thead>
        <tbody>
          {targets?.slice(0, 10).map((row, index) => (
            <React.Fragment key={index}>
              <tr>
                <td
                  className="p-2 border text-center hover:text-emerald-600 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  {expandedRows[index] ? (
                    <MinusCircleIcon className="h-6 w-6 inline-block mr-2 text-emerald-500" />
                  ) : (
                    <PlusCircleIcon className="h-6 w-6 inline-block mr-2 text-emerald-500" />
                  )}
                </td>
                <td className="p-2 border text-center hover:text-emerald-600">
                  <Link
                    to={`https://platform.opentargets.org/target/${row.target.id}/associations`}
                  >
                    {row.target.approvedSymbol}
                  </Link>
                </td>
                <td className="p-2 border text-center">
                  {row.score.toFixed(4)}
                </td>
                <td className="p-2 border text-center">
                  {row.target.approvedName}
                </td>
              </tr>
              {expandedRows[index] && (
                <tr>
                  <td className="p-2 border" colSpan={4}>
                    <Charts target={row.target} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenTargets;
