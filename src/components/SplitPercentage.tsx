"use client";

import { useState, useEffect } from "react";

type PersonResult = {
  name: string;
  total: number;
};

type Props = {
  total: number;
  peopleNames: string[];
  onResult?: (data: PersonResult[]) => void;
};

export default function SplitPercentage({
  total,
  peopleNames,
  onResult,
}: Props) {
  const [percentages, setPercentages] = useState<number[]>([]);

  useEffect(() => {
    setPercentages(peopleNames.map(() => Math.floor(100 / peopleNames.length)));
  }, [peopleNames]);

  useEffect(() => {
    const result: PersonResult[] = peopleNames.map(
      (name: string, i: number) => ({
        name,
        total: Math.floor((percentages[i] / 100) * total),
      }),
    );

    onResult?.(result);
  }, [percentages, total, peopleNames, onResult]);

  return (
    <div className="p-4 bg-[#0f172a] rounded-xl space-y-3">
      {peopleNames.map((name: string, i: number) => {
        const amount = Math.floor((percentages[i] / 100) * total);

        return (
          <div
            key={i}
            className="flex gap-2 items-center bg-gray-100 dark:bg-[#020617] p-2 rounded-lg border border-gray-700"
          >
            <span className="flex-1">{name}</span>

            <input
              type="number"
              value={percentages[i] || 0}
              onChange={(e) => {
                const updated = [...percentages];
                updated[i] = Number(e.target.value);
                setPercentages(updated);
              }}
              className="w-20 bg-gray-200 dark:bg-[#1e293b] p-2 rounded text-center"
            />

            <span>%</span>
            <span className="ml-auto text-blue-400">Rp {amount}</span>
          </div>
        );
      })}

      <p className="text-center mt-3 text-sm text-gray-400">
        Total: Rp {total}
      </p>
    </div>
  );
}
