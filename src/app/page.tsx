"use client";
import { useState, useEffect } from "react";

const STEPS = [
  { id: "step_1", title: "Extracting Images" },
  { id: "step_2", title: "Shopify Gallery Sync" },
  { id: "step_3", title: "Vision AI Analysis" },
  { id: "step_4", title: "Category Identification" },
  { id: "step_5", title: "SEO Content Generation" },
  { id: "final_step", title: "Finalization & Email" },
];

export default function Page() {
  const [folder, setFolder] = useState("");
  const [status, setStatus] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Polling only AFTER user starts
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data);
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = async () => {
    if (!folder) return alert("Enter folder name");

    // 🔥 Reset UI state for fresh run
    setStatus({});
    setHasStarted(true);
    setIsRunning(true);

    try {
      await fetch("/api/trigger", {
        method: "POST",
        body: JSON.stringify({ folder_name: folder }),
      });
    } catch (e) {
      alert("Failed to start automation");
      setIsRunning(false);
    }
  };

  // 🧠 Step logic (STRICT ORDER)
  const getStepState = (index: number) => {
    if (!hasStarted) return "pending";

    // If final step complete → everything complete
    if (status.final_step === "complete") return "complete";

    const currentStep = STEPS[index];
    const prevStep = STEPS[index - 1];

    // First step
    if (index === 0) {
      return status[currentStep.id] === "complete"
        ? "complete"
        : "active";
    }

    // Only unlock step if previous is complete
    if (status[prevStep.id] === "complete") {
      return status[currentStep.id] === "complete"
        ? "complete"
        : "active";
    }

    return "pending";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg" />
          <span className="font-semibold text-lg">CompanyBrand</span>
        </div>
        <h1 className="text-sm text-slate-600 tracking-wide">
          PRODUCT ONBOARDING AUTOMATOR
        </h1>
        <div />
      </div>

      <div className="max-w-xl mx-auto mt-6">
        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">
            Start New Onboarding
          </h2>

          <label className="text-sm text-slate-500">
            Google Drive Folder Name
          </label>

          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. Vendor_Summer_Collection_2024"
            className="w-full mt-1 mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleStart}
            disabled={isRunning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {isRunning ? "Running..." : "Run Automation"}
          </button>
        </div>

        {/* Progress */}
        <h3 className="font-semibold mb-4">
          Automation Progress Path
        </h3>

        <div className="relative pl-6">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-300" />

          {STEPS.map((step, index) => {
            const state = getStepState(index);

            return (
              <div key={step.id} className="mb-6 flex items-start gap-4">
                {/* Circle */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2
                  ${
                    state === "complete"
                      ? "bg-green-500 border-green-500 text-white"
                      : state === "active"
                      ? "border-blue-500 bg-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {state === "complete" ? "✓" : ""}
                </div>

                {/* Text */}
                <div>
                  <p
                    className={`font-medium ${
                      state === "complete"
                        ? "text-green-600"
                        : state === "active"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {state === "complete"
                      ? "Completed"
                      : state === "active"
                      ? "Processing..."
                      : "Waiting..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final message */}
        {status.final_step === "complete" && (
          <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl">
            🎉 Automation completed! Check your email for the CSV.
          </div>
        )}
      </div>
    </main>
  );
}