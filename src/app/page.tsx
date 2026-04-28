import UploadBox from "@/components/UploadBox";

export default function Home() {
  return (
    <main className="min-h-screen 
      bg-gradient-to-br 
      from-gray-100 via-white to-gray-200 
      dark:from-[#020617] dark:via-[#0f172a] dark:to-[#020617]
      text-black dark:text-white
      flex flex-col items-center px-4 transition-colors duration-300"
    >
      {/* HERO */}
      <div className="text-center mt-20 mb-10">
        <h1 className="text-4xl font-bold mb-2">💰 Split Bill</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Scan receipt, split instantly
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-800 rounded-xl transition-colors">
        <UploadBox />
      </div>

      {/* FOOTER */}
      <p className="text-gray-500 text-sm mt-10">
        Built with OCR • AI • Next.js
      </p>
    </main>
  );
}
