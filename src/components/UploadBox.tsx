"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Tabs from "@/components/Tabs";
import { generateWhatsAppText } from "@/lib/share";
import Button from "@/components/ui/Button";

const EditableItems = dynamic(() => import("@/components/EditableItems"));
const SplitEqual = dynamic(() => import("@/components/SplitEqual"));
const SplitPercentage = dynamic(() => import("@/components/SplitPercentage"));
const SplitByItem = dynamic(() => import("@/components/SplitByItem"));

type SplitType = "equal" | "percentage" | "item";

export default function UploadBox() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finalData, setFinalData] = useState<any>(null);

  const [peopleNames, setPeopleNames] = useState<string[]>([
    "Orang 1",
    "Orang 2",
  ]);

  const [splitResult, setSplitResult] = useState<any[]>([]);
  const [splitType, setSplitType] = useState<SplitType>("equal");

  const handleChange = (file: File) => {
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔥 OCR + PARSE
  const handleScan = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);

    const { runOCR } = await import("@/lib/ocr");

    const text = await runOCR(image, (p: number) => setProgress(p));

    try {
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      let items: any[] = [];

      if (Array.isArray(data.items) && data.items.length > 0) {
        items = data.items.map((item: any) => ({
          name: item.name || "Unknown",
          price: Number(item.price) || 0,
          qty: Number(item.qty) || 1,
        }));
      } else {
        const cleanText = text.replace(/\./g, "");
        const matches = cleanText.matchAll(
          /([A-Za-z\s]+?)\s*x?\s*(\d+)?\s+(\d{3,6})/g
        );

        items = Array.from(matches).map((m) => ({
          name: m[1].trim(),
          qty: Number(m[2]) || 1,
          price: Number(m[3]),
        }));
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      setFinalData({ items, total });
    } catch {
      alert("❌ gagal parse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="
  bg-white text-black 
  dark:bg-[#0f172a] dark:text-white
  border border-gray-300 dark:border-gray-800 
  rounded-xl p-4 space-y-4 transition-colors
">
      <h2 className="text-xl font-bold text-center">Split Bill AI</h2>

      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleChange(e.target.files[0])
          }
          className="hidden"
          id="upload"
        />
        <label htmlFor="upload" className="cursor-pointer text-gray-400">
          Upload Receipt
        </label>
      </div>

      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            className="max-h-64 object-contain rounded border border-gray-700"
          />
        </div>
      )}

      {image && (
        <Button onClick={handleScan}>
          {loading ? "Scanning..." : "Scan Receipt"}
        </Button>
      )}

      {loading && (
        <div className="w-full bg-gray-800 h-2 rounded">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {finalData && <EditableItems data={finalData} onChange={setFinalData} />}

      {finalData && (
        <Tabs
          onChange={(value: string) => setSplitType(value as SplitType)}
          tabs={[
            {
              label: "Equal",
              value: "equal",
              content: (
                <SplitEqual
                  total={finalData.total}
                  peopleNames={peopleNames}
                  setPeopleNames={setPeopleNames}
                  onResult={(res) => setSplitResult(res)}
                />
              ),
            },
            {
              label: "Percentage",
              value: "percentage",
              content: (
                <SplitPercentage
                  total={finalData.total}
                  peopleNames={peopleNames}
                  onResult={(res) => setSplitResult(res)}
                />
              ),
            },
            {
              label: "By Item",
              value: "item",
              content: (
                <SplitByItem
                  items={finalData.items}
                  total={finalData.total}
                  peopleNames={peopleNames}
                  onResult={(res) => setSplitResult(res)}
                />
              ),
            },
          ]}
        />
      )}

      {finalData && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            generateWhatsAppText({
              type: splitType,
              people: splitResult,
              total: finalData.total,
            })
          )}`}
          target="_blank"
          className="block w-full text-center bg-green-600 py-3 rounded-xl font-semibold"
        >
          Share to WhatsApp
        </a>
      )}
    </motion.div>
  );
}
