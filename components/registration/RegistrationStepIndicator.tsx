"use client";

type Props = {
  step: number;
  onSelectStep: (step: number) => void;
  unlockedSteps: number[];
};

export default function RegistrationStepIndicator({
  step,
  onSelectStep,
  unlockedSteps,
}: Props) {
  const steps = [
    { number: 1, label: "01. Business Info" },
    { number: 2, label: "02. Account Details" },
  ];

  return (
    <div className="flex gap-4 w-full mt-6">
      {steps.map((s) => (
        <button
          key={s.number}
          type="button"
          disabled={!unlockedSteps.includes(s.number)}
          onClick={() => onSelectStep(s.number)}
          className={`pb-2 border-b-2 text-sm font-semibold transition-all duration-200 text-left flex-1 disabled:opacity-40 disabled:cursor-not-allowed ${
            step === s.number
              ? "border-orange-500 text-orange-600"
              : "border-gray-200 text-gray-400"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
