"use client";

import { useMemo, useState, useEffect } from "react";

type Item = {
  name: string;
  price: number;
};

type Props = {
  items: Item[];
  total: number;
  peopleNames: string[];
  onResult?: (data: any[]) => void;
};

export default function SplitByItem({
  items,
  total,
  peopleNames,
  onResult,
}: Props) {
  const [qtyMap, setQtyMap] = useState<{
    [itemIndex: number]: { [personIndex: number]: number };
  }>({});

  const handleQtyChange = (
    itemIndex: number,
    personIndex: number,
    value: number,
  ) => {
    setQtyMap((prev) => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [personIndex]: value,
      },
    }));
  };

  const result = useMemo(() => {
    return peopleNames.map((name, personIndex) => {
      let total = 0;

      items.forEach((item, itemIndex) => {
        const qty = qtyMap[itemIndex]?.[personIndex] || 0;
        total += qty * item.price;
      });

      return { name, total };
    });
  }, [qtyMap, items, peopleNames]);

  useEffect(() => {
    onResult?.(result);
  }, [result]);

  return (
    <div className="p-4 bg-[#0f172a] rounded-xl space-y-4">
      {/* ITEMS */}
      {items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className="bg-gray-100 dark:bg-[#020617] border border-gray-700 rounded-xl p-4 space-y-3"
        >
          {/* ITEM HEADER */}
          <div className="flex justify-between text-sm font-semibold">
            <span>{item.name}</span>
            <span className="text-blue-400">Rp {item.price}</span>
          </div>

          {/* ORANG */}
          <div className="space-y-2">
            {peopleNames.map((name, personIndex) => (
              <div
                key={personIndex}
                className="flex justify-between items-center bg-gray-200 dark:bg-[#1e293b] border border-gray-700 p-2 rounded-lg"
              >
                <span>{name}</span>

                <input
                  type="number"
                  min={0}
                  value={qtyMap[itemIndex]?.[personIndex] || 0}
                  onChange={(e) =>
                    handleQtyChange(
                      itemIndex,
                      personIndex,
                      Number(e.target.value),
                    )
                  }
                  className="w-20 bg-gray-100 dark:bg-[#020617] text-center rounded p-1 border border-gray-700"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* RESULT */}
      <div className="border-t border-gray-700 pt-4 space-y-2">
        {result.map((r, i) => (
          <div
            key={i}
            className="flex justify-between bg-[#1e293b] p-3 rounded-lg border border-gray-700"
          >
            <span>{r.name}</span>
            <span className="text-green-400">Rp {r.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
