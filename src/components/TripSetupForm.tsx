import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TEMPLATES } from "@/lib/templates";
import { useTripStore } from "@/lib/store";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";

const LUGGAGE = ["Carry-on only", "Checked bag", "Backpack"];

export function TripSetupForm() {
  const navigate = useNavigate();
  const createTrip = useTripStore((s) => s.createTrip);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<string>("template_weekend");
  const [luggageType, setLuggageType] = useState<string>(LUGGAGE[0]);
  const [customInput, setCustomInput] = useState("");
  const [customs, setCustoms] = useState<string[]>([]);

  function addCustom() {
    const v = customInput.trim();
    if (!v) return;
    if (!customs.includes(v)) setCustoms([...customs, v]);
    setCustomInput("");
  }

  function start() {
    createTrip({ name, templateId, customItems: customs, luggageType });
    navigate({ to: "/pack" });
  }

  return (
    <div className="min-h-dvh pb-32">
      <header className="flex h-16 items-center justify-between px-5">
        <div className="h-10 w-10" />
        <div className="font-display text-xl font-semibold tracking-tight text-primary">
          PackSwipe
        </div>
        <div className="h-10 w-10" />
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5">
        <section className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[40px] text-on-surface">Plan your trip</h1>
          <p className="text-lg text-on-surface-variant">Let's build your perfect pack list.</p>
        </section>

        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold tracking-wide text-on-surface-variant" htmlFor="trip-name">
            Trip name
          </label>
          <div className="flex items-center gap-3 overflow-hidden rounded-[24px] border border-white/10 bg-surface-low px-4 py-3 focus-within:border-primary-container focus-within:glow-amber">
            <MaterialIcon name="flight_takeoff" className="text-on-surface-variant" />
            <input
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Winter in Tokyo"
              className="w-full bg-transparent text-lg text-on-surface outline-none placeholder:text-on-surface-variant/50"
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Trip vibe</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TEMPLATES.map((t) => {
              const active = t.id === templateId;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={cn(
                    "relative h-28 overflow-hidden rounded-[24px] border bg-surface-high text-left transition-all",
                    active
                      ? "border-primary-container glow-amber"
                      : "border-white/10 hover:border-white/20",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-tr",
                      active
                        ? "from-primary-container/30 via-transparent to-tertiary/10"
                        : "from-surface-high to-surface-container",
                    )}
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <MaterialIcon name={t.icon} className="text-primary" />
                    <span className={cn("font-display text-lg font-semibold", active ? "text-primary" : "text-on-surface")}>
                      {t.name}
                    </span>
                  </div>
                  {active && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                      <MaterialIcon name="check" filled className="text-[16px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Luggage</label>
          <div className="flex flex-wrap gap-2">
            {LUGGAGE.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLuggageType(l)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  luggageType === l
                    ? "border-primary-container bg-primary-container/15 text-primary"
                    : "border-white/10 bg-surface-high text-on-surface-variant hover:text-on-surface",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12 flex flex-col gap-2">
          <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Must-have items</label>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center overflow-hidden rounded-[24px] border border-white/10 bg-surface-low px-4 py-3 focus-within:border-primary-container focus-within:glow-amber">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustom();
                  }
                }}
                placeholder="Add specific item…"
                className="w-full bg-transparent text-lg text-on-surface outline-none placeholder:text-on-surface-variant/50"
              />
            </div>
            <button
              type="button"
              onClick={addCustom}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container text-on-surface transition-colors hover:border-primary-container hover:text-primary active:scale-95"
              aria-label="Add item"
            >
              <MaterialIcon name="add" />
            </button>
          </div>
          {customs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {customs.map((c) => (
                <div key={c} className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-high px-4 py-2">
                  <span className="text-xs text-on-surface">{c}</span>
                  <button
                    type="button"
                    onClick={() => setCustoms(customs.filter((x) => x !== c))}
                    className="text-on-surface-variant transition-colors hover:text-destructive"
                    aria-label={`Remove ${c}`}
                  >
                    <MaterialIcon name="close" className="text-[16px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-surface/90 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur-xl">
        <button
          onClick={start}
          disabled={!templateId}
          className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-[24px] bg-primary-container py-4 font-display text-lg font-semibold text-on-primary-container transition-all glow-amber hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
        >
          <MaterialIcon name="auto_awesome" />
          Start Packing
        </button>
      </div>
    </div>
  );
}
