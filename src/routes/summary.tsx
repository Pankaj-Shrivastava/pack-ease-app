import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SummaryList } from "@/components/SummaryList";
import { useTripStore } from "@/lib/store";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Trip Summary — PackSwipe" },
      { name: "description", content: "Review what's packed, what needs a decision, and what you left behind." },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const navigate = useNavigate();
  const trip = useTripStore((s) => s.trip);

  useEffect(() => {
    if (!trip) navigate({ to: "/" });
  }, [trip, navigate]);

  if (!trip) return null;
  return <SummaryList />;
}
