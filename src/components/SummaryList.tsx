import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTripStore } from "@/lib/store";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";
import type { ItemStatus, PackItem } from "@/lib/types";

function groupByCategory(items: PackItem[]) {
  const m = new Map<string, PackItem[]>();
  for (const it of items) {
    if (!m.has(it.category)) m.set(it.category, []);
    m.get(it.category)!.push(it);
  }
  return Array.from(m.entries());
}

export function SummaryList() {
  const navigate = useNavigate();
  const trip = useTripStore((s) => s.trip);
  const setStatus = useTripStore((s) => s.setStatus);
  const reset = useTripStore((s) => s.reset);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    packed: true,
    decide_later: true,
    skipped: false,
  });

  const buckets = useMemo(() => {
    const items = trip?.items ?? [];
    return {
      packed: items.filter((i) => i.status === "packed"),
      decide_later: items.filter((i) => i.status === "decide_later" || i.status === "pending"),
      skipped: items.filter((i) => i.status === "skipped"),
    };
  }, [trip]);

  if (!trip) return null;

  const total = trip.items.length;
  const packedCount = buckets.packed.length;
  const progress = total === 0 ? 0 : packedCount / total;
  const pct = Math.round(progress * 100);

  function toggle(k: string) {
    setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  }

  return (
    <div className="min-h-dvh pb-12">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-surface/80 px-5 backdrop-blur-xl">
        <button
          onClick={() => navigate({ to: "/pack" })}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label="Back to packing"
        >
          <MaterialIcon name="arrow_back" />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight text-primary">PackSwipe</h1>
        <div className="h-10 w-10" />
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 pt-6">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold text-on-surface">
            {trip.name} summary
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {trip.luggageType && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-surface-high px-3 py-1 text-xs text-on-surface-variant">
                <MaterialIcon name="luggage" className="text-[14px]" />
                {trip.luggageType}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-surface-high px-3 py-1 text-xs text-on-surface-variant">
              <MaterialIcon name="inventory_2" className="text-[14px]" />
              {total} items
            </span>
          </div>
        </section>

        <section className="glass-panel flex flex-col gap-2 rounded-2xl p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">Packing progress</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary">
                {pct}% <span className="text-base font-normal text-on-surface-variant">ready</span>
              </p>
            </div>
            <p className="text-on-surface">{packedCount}/{total} items</p>
          </div>
          <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-surface-lowest">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-container glow-amber transition-all duration-700"
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </div>
        </section>

        <Section
          title="Packed"
          subtitle={`${buckets.packed.length} items secured`}
          icon="check_circle"
          iconColor="text-tertiary"
          iconBg="bg-tertiary-container/20"
          open={openSections.packed}
          onToggle={() => toggle("packed")}
        >
          {buckets.packed.length === 0 ? (
            <EmptyRow label="Nothing packed yet" />
          ) : (
            groupByCategory(buckets.packed).map(([cat, list]) => (
              <CategoryGroup key={cat} category={cat}>
                {list.map((i) => (
                  <ItemRow key={i.id} item={i} onStatus={(s) => setStatus(i.id, s)} variant="packed" />
                ))}
              </CategoryGroup>
            ))
          )}
        </Section>

        <Section
          title="Decide later"
          subtitle={`${buckets.decide_later.length} items pending`}
          icon="help"
          iconColor="text-primary"
          iconBg="bg-primary-container/20"
          highlight
          open={openSections.decide_later}
          onToggle={() => toggle("decide_later")}
        >
          {buckets.decide_later.length === 0 ? (
            <EmptyRow label="No decisions left" />
          ) : (
            buckets.decide_later.map((i) => (
              <div key={i.id} className="glass-panel flex flex-col gap-3 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-medium text-on-surface">{i.name}</h4>
                    <p className="mt-1 text-xs text-on-surface-variant">{i.description}</p>
                  </div>
                  <MaterialIcon name={i.icon} className="shrink-0 text-on-surface-variant" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatus(i.id, "skipped")}
                    className="flex-1 rounded-full border border-white/20 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/5"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => setStatus(i.id, "packed")}
                    className="flex-1 rounded-full bg-primary-container py-2 text-sm font-semibold text-on-primary-container glow-amber transition-opacity hover:opacity-90"
                  >
                    Pack
                  </button>
                </div>
              </div>
            ))
          )}
        </Section>

        <Section
          title="Skipped"
          subtitle={`${buckets.skipped.length} items left behind`}
          icon="block"
          iconColor="text-on-surface-variant"
          iconBg="bg-surface-highest"
          dim
          open={openSections.skipped}
          onToggle={() => toggle("skipped")}
        >
          {buckets.skipped.length === 0 ? (
            <EmptyRow label="Nothing skipped" />
          ) : (
            buckets.skipped.map((i) => (
              <button
                key={i.id}
                onClick={() => setStatus(i.id, "packed")}
                className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-surface-container"
              >
                <span className="text-on-surface-variant">{i.name}</span>
                <MaterialIcon name="undo" className="text-[16px] text-on-surface-variant" />
              </button>
            ))
          )}
        </Section>

        <section className="mt-4 flex flex-col gap-3 pb-12">
          <button
            onClick={() => {
              reset();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-white/5 active:scale-95"
          >
            <MaterialIcon name="restart_alt" className="text-[18px]" />
            Start a new trip
          </button>
        </section>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  iconColor,
  iconBg,
  open,
  onToggle,
  highlight,
  dim,
  children,
}: {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  open: boolean;
  onToggle: () => void;
  highlight?: boolean;
  dim?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-surface-low",
        highlight ? "border-primary/20" : "border-white/5",
      )}
    >
      {highlight && <div className="pointer-events-none absolute inset-0 bg-primary/5" />}
      <button
        onClick={onToggle}
        className={cn(
          "relative z-10 flex w-full items-center justify-between p-4 text-left",
          dim && "opacity-80",
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg, iconColor)}>
            <MaterialIcon name={icon} filled />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-on-surface">{title}</h3>
            <p className={cn("truncate text-xs", highlight ? "text-primary" : "text-on-surface-variant")}>
              {subtitle}
            </p>
          </div>
        </div>
        <MaterialIcon
          name="expand_more"
          className={cn("text-on-surface-variant transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className={cn("relative z-10 flex flex-col gap-2 border-t border-white/5 p-4", dim && "opacity-80")}>
          {children}
        </div>
      )}
    </div>
  );
}

function CategoryGroup({ category, children }: { category: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{category}</p>
      {children}
    </div>
  );
}

function ItemRow({
  item,
  onStatus,
  variant,
}: {
  item: PackItem;
  onStatus: (s: ItemStatus) => void;
  variant: "packed";
}) {
  return (
    <div className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-surface-container">
      <label className="flex min-w-0 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={variant === "packed"}
          onChange={() => onStatus("pending")}
          className="h-5 w-5 cursor-pointer accent-tertiary"
        />
        <span className="truncate text-on-surface-variant line-through decoration-on-surface-variant/50">
          {item.name}
        </span>
      </label>
      <MaterialIcon name={item.icon} className="shrink-0 text-on-surface-variant" />
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <p className="px-2 py-4 text-center text-sm text-on-surface-variant/60">{label}</p>;
}
