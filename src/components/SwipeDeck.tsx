import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useTripStore } from "@/lib/store";
import { SwipeCard } from "./SwipeCard";
import { MaterialIcon } from "./MaterialIcon";
import type { ItemStatus } from "@/lib/types";

export function SwipeDeck() {
  const navigate = useNavigate();
  const trip = useTripStore((s) => s.trip);
  const setStatus = useTripStore((s) => s.setStatus);
  const undo = useTripStore((s) => s.undo);
  const history = useTripStore((s) => s.history);

  const pending = useMemo(
    () => trip?.items.filter((i) => i.status === "pending") ?? [],
    [trip],
  );

  const total = trip?.items.length ?? 0;
  const remaining = pending.length;
  const decided = total - remaining;
  const progress = total === 0 ? 0 : decided / total;

  if (!trip) return null;

  function decide(status: ItemStatus) {
    if (!pending[0]) return;
    setStatus(pending[0].id, status);
  }

  if (pending.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-container/15 glow-amber">
          <MaterialIcon name="celebration" filled className="text-[48px] text-primary" />
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-on-surface">All decided!</h1>
        <p className="mb-8 max-w-sm text-on-surface-variant">
          Every item in <span className="text-primary">{trip.name}</span> has a verdict. Review your summary to finalize.
        </p>
        <button
          onClick={() => navigate({ to: "/summary" })}
          className="flex items-center gap-2 rounded-[24px] bg-primary-container px-8 py-4 font-display text-lg font-semibold text-on-primary-container glow-amber transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <MaterialIcon name="analytics" />
          See Summary
        </button>
      </div>
    );
  }

  const visible = pending.slice(0, 3);

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden select-none">
      <header className="flex w-full items-center justify-between px-5 pb-4 pt-10">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-surface-high/60 text-on-surface backdrop-blur-md transition-colors hover:bg-surface-high"
          aria-label="Close"
        >
          <MaterialIcon name="close" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-primary">
            Item {decided + 1} of {total}
          </span>
          <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-surface-variant">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-300"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
        </div>
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-surface-high/60 text-on-surface backdrop-blur-md transition-colors hover:bg-surface-high disabled:opacity-30"
          aria-label="Undo"
        >
          <MaterialIcon name="undo" />
        </button>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-5 pb-40">
        <div className="relative h-[500px] w-full max-w-md">
          <AnimatePresence initial={false}>
            {visible.map((item, idx) => (
              <SwipeCard
                key={item.id}
                item={item}
                stackIndex={idx}
                onDecide={(status) => idx === 0 && decide(status)}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/90 to-transparent px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-8">
        <div className="mx-auto flex max-w-md items-end justify-center gap-6">
          <button
            onClick={() => decide("decide_later")}
            className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface-high text-on-surface-variant shadow-lg transition-all hover:bg-surface-highest hover:text-on-surface active:scale-90"
            aria-label="Decide later"
          >
            <MaterialIcon name="schedule" className="text-[26px]" />
          </button>
          <button
            onClick={() => decide("packed")}
            className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/20 bg-primary-container text-on-primary-container glow-amber-lg transition-all active:scale-95"
            aria-label="Pack"
          >
            <MaterialIcon name="check" className="text-[40px]" style={{ fontVariationSettings: "'wght' 600" }} />
          </button>
          <button
            onClick={() => decide("skipped")}
            className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface-high text-on-surface-variant shadow-lg transition-all hover:border-error/30 hover:bg-surface-highest hover:text-error active:scale-90"
            aria-label="Skip"
          >
            <MaterialIcon name="close" className="text-[26px]" />
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-on-surface-variant/70">
          Swipe right to pack · left for later · up to skip
        </p>
      </footer>
    </div>
  );
}
