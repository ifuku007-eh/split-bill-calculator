"use client";

import { useState, useEffect } from "react";

type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  onChange?: (value: string) => void;
};

export default function Tabs({ tabs, onChange }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
  onChange?.(tabs[active].value);
}, [active, tabs, onChange]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-lg ${
              active === i ? "bg-blue-600" : "bg-gray-200 dark:bg-[#1e293b]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div key={i} className={active === i ? "block" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
