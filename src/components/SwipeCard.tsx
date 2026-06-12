import { useMemo } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { PackItem, ItemStatus } from "@/lib/types";
import { MaterialIcon } from "./MaterialIcon";

const SWIPE_THRESHOLD = 120;

interface Props {
  item: PackItem;
  onDecide: (status: ItemStatus) => void;
  stackIndex: number; // 0 = top
}

export function SwipeCard({ item, onDecide, stackIndex }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const packOpacity = useTransform(x, [40, 140], [0, 1]);
  const laterOpacity = useTransform(x, [-140, -40], [1, 0]);
  const skipOpacity = useTransform(y, [-140, -40], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > 600) {
      onDecide("packed");
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -600) {
      onDecide("decide_later");
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -600) {
      onDecide("skipped");
    }
  }

  const isTop = stackIndex === 0;

  const stackStyles = useMemo(() => {
    const scale = 1 - stackIndex * 0.04;
    const translateY = stackIndex * 12;
    const opacity = stackIndex > 2 ? 0 : 1 - stackIndex * 0.15;
    return { scale, translateY, opacity };
  }, [stackIndex]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - stackIndex,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        scale: stackStyles.scale,
        y: stackStyles.translateY,
        opacity: stackStyles.opacity,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-surface-container p-6 shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-[60px]" />

        <div className="relative mb-6 flex h-44 w-44 items-center justify-center rounded-full border border-white/5 bg-surface-high">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
          <MaterialIcon name={item.icon} filled className="relative text-[72px] text-primary" />
        </div>

        <div className="z-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-highest px-4 py-1.5">
            <MaterialIcon name="label" className="text-[14px] text-tertiary" />
            <span className="text-xs font-medium text-on-surface-variant">{item.category}</span>
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-on-surface">{item.name}</h2>
          <p className="text-on-surface-variant">{item.description}</p>
        </div>

        {isTop && (
          <>
            <motion.div
              style={{ opacity: packOpacity }}
              className="pointer-events-none absolute right-6 top-6 rounded-2xl border-4 border-tertiary px-4 py-2 font-display text-xl font-bold uppercase tracking-wider text-tertiary"
            >
              Pack
            </motion.div>
            <motion.div
              style={{ opacity: laterOpacity }}
              className="pointer-events-none absolute left-6 top-6 rounded-2xl border-4 border-on-surface-variant px-4 py-2 font-display text-xl font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Later
            </motion.div>
            <motion.div
              style={{ opacity: skipOpacity }}
              className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border-4 border-error px-4 py-2 font-display text-xl font-bold uppercase tracking-wider text-error"
            >
              Skip
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
