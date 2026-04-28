"use client";

import { useState, useEffect, useMemo } from "react";

type Item = {
  name: string;
  price: number;
  qty: number;
};

type Props = {
  data: {
    items: Item[];
    total: number;
  };
  onChange: (data: any) => void;
};

export default function EditableItems({ data, onChange }: Props) {
  const [items, setItems] = useState<Item[]>(data.items || []);
  const [manualTotal, setManualTotal] = useState<number | null>(null);
  const [paid, setPaid] = useState<number>(0);

  const calculatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const finalTotal = useMemo(() => {
    return manualTotal ?? calculatedTotal;
  }, [manualTotal, calculatedTotal]);

  const change = useMemo(() => {
    return Math.max(paid - finalTotal, 0);
  }, [paid, finalTotal]);

  useEffect(() => {
    const t = setTimeout(() => {
      onChange({
        items,
        total: finalTotal,
        paid,
        change,
      });
    }, 300);

    return () => clearTimeout(t);
  }, [items, manualTotal, paid]);

  const updateItem = (
    index: number,
    field: "name" | "price" | "qty",
    value: any,
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = field === "name" ? value : Number(value);
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { name: "Item", price: 0, qty: 1 }]);
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold">Edit Items</h3>

      {/* HEADER */}
      <div className="grid grid-cols-12 text-xs text-gray-400 px-1">
        <div className="col-span-6">Nama Item</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-3">Price</div>
        <div className="col-span-1"></div>
      </div>

      {/* ITEMS */}
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-12 gap-2 items-center bg-gray-100 dark:bg-[#020617] p-3 rounded-xl border border-gray-700"
        >
          <input
            value={item.name}
            onChange={(e) => updateItem(i, "name", e.target.value)}
            className="col-span-6 bg-[#334155] p-2 rounded-lg text-white"
          />

          <input
            type="number"
            value={item.qty}
            onChange={(e) => updateItem(i, "qty", e.target.value)}
            className="col-span-2 bg-[#334155] p-2 rounded-lg text-center text-white"
          />

          <input
            type="number"
            value={item.price}
            onChange={(e) => updateItem(i, "price", e.target.value)}
            className="col-span-3 bg-[#334155] p-2 rounded-lg text-white"
          />

          <button
            onClick={() => removeItem(i)}
            className="col-span-1 bg-red-500 hover:bg-red-600 rounded-lg text-white"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
      >
        + Add Item
      </button>

      {/* TOTAL */}
      <div className="border-t border-gray-700 pt-4 space-y-3">
        <div>
          <p className="text-sm text-gray-400">Auto Total</p>
          <p className="font-semibold">Rp {calculatedTotal}</p>
        </div>
        <input
          type="number"
          placeholder="Edit total (optional)"
          value={manualTotal ?? ""}
          onChange={(e) =>
            setManualTotal(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full bg-gray-200 dark:bg-gray-200 dark:bg-[#1e293b] p-2 rounded"
        />
        <p className="text-lg font-bold text-blue-400">
          Final: Rp {finalTotal}
        </p>
      </div>

      {/* PAYMENT */}
      <div className="border-t border-gray-700 pt-4 space-y-3">
        <div className="bg-gray-100 dark:bg-[#020617] p-3 rounded-lg">
          <p className="text-xs text-gray-400">Uang Dibayar</p>
          <input
            type="number"
            value={paid}
            onChange={(e) => setPaid(Number(e.target.value))}
            className="w-full bg-[#334155] p-2 rounded mt-1 text-white"
          />
        </div>

        <div className="bg-gray-100 dark:bg-[#020617] p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span>Rp {finalTotal}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Dibayar</span>
            <span className="text-blue-400">Rp {paid}</span>
          </div>

          <div className="flex justify-between font-bold mt-1">
            <span>Kembalian</span>
            <span className="text-green-400">
              Rp {Math.max(paid - finalTotal, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
