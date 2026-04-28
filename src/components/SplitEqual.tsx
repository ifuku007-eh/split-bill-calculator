"use client";

import { useEffect } from "react";

type Props = {
  total: number;
  peopleNames: string[];
  setPeopleNames: (names: string[]) => void;
  onResult?: (data: any[]) => void;
};

export default function SplitEqual({
  total,
  peopleNames,
  setPeopleNames,
  onResult,
}: Props) {
  const peopleCount = peopleNames.length || 1;
  const perPerson = Math.floor(total / peopleCount);

  useEffect(() => {
    onResult?.(
      peopleNames.map((name) => ({
        name,
        total: perPerson,
      })),
    );
  }, [total, peopleNames]);

  const updateName = (index: number, value: string) => {
    const updated = [...peopleNames];
    updated[index] = value;
    setPeopleNames(updated);
  };

  const changePeople = (value: number) => {
    const count = Math.max(1, value);
    let updated = [...peopleNames];

    if (count > updated.length) {
      for (let i = updated.length; i < count; i++) {
        updated.push(`Orang ${i + 1}`);
      }
    } else {
      updated = updated.slice(0, count);
    }

    setPeopleNames(updated);
  };

  return (
    <div className="p-4 bg-[#0f172a] rounded-xl space-y-4">
      {/* JUMLAH ORANG */}
      <div className="flex justify-between items-center bg-gray-100 dark:bg-[#020617] border border-gray-700 p-3 rounded-lg">
        <span className="text-sm text-gray-300">Jumlah Orang</span>
        <input
          type="number"
          min={1}
          value={peopleCount}
          onChange={(e) => changePeople(Number(e.target.value))}
          className="w-20 text-center bg-gray-200 dark:bg-[#1e293b] p-2 rounded border border-gray-700"
        />
      </div>

      {/* INPUT NAMA */}
      {peopleNames.map((name, i) => (
        <input
          key={i}
          value={name}
          onChange={(e) => updateName(i, e.target.value)}
          className="w-full p-3 bg-gray-200 dark:bg-[#1e293b] rounded-lg border border-gray-700"
        />
      ))}

      {/* KETERANGAN */}
      <div className="bg-gray-100 dark:bg-[#020617] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 space-y-2">
        <p>Total belanja akan dibagi rata untuk tiap orang.</p>

        <p>
          Setiap orang harus membayar:
          <span className="text-blue-400 font-semibold"> Rp {perPerson}</span>
        </p>

        <div className="border-t border-gray-700 pt-2 text-xs text-gray-400">
          <p>Harap diperhatikan:</p>
          <p>
            Apakah ada yang tidak makan atau minum apa pun? Jika ya, Anda
            mungkin ingin menggunakan metode pembagian lain seperti "Split by
            Item" atau "Split by Percentage" untuk hasil yang lebih adil.
          </p>
          <p>
            Jika pembelian terasa tidak sesuai, harap lapor petugas dan cek
            kembali belanjaan anda.
          </p>
        </div>
      </div>

      {/* HASIL */}
      <p className="text-center text-lg font-semibold text-green-400">
        Rp {total} ÷ {peopleCount} = Rp {perPerson}
      </p>
    </div>
  );
}
