import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SwipeDeck } from "@/components/SwipeDeck";
import { useTripStore } from "@/lib/store";

export const Route = createFileRoute("/pack")({
  head: () => ({
    meta: [
      { title: "Packing — PackSwipe" },
      { name: "description", content: "Swipe through your packing list. Right to pack, left for later, up to skip." },
    ],
  }),
  component: PackPage,
});

function PackPage() {
  const navigate = useNavigate();
  const trip = useTripStore((s) => s.trip);

  useEffect(() => {
    if (!trip) navigate({ to: "/" });
  }, [trip, navigate]);

  if (!trip) return null;
  return <SwipeDeck />;
}
