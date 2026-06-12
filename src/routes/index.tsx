import { createFileRoute } from "@tanstack/react-router";
import { TripSetupForm } from "@/components/TripSetupForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PackSwipe — Swipe Your Way Packed" },
      { name: "description", content: "Replace tedious packing checklists with a fast, satisfying swipe-based flow. Pick a trip vibe and PackSwipe builds your list." },
      { property: "og:title", content: "PackSwipe — Swipe Your Way Packed" },
      { property: "og:description", content: "A swipe-first trip packing assistant. Never forget the essentials again." },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  return <TripSetupForm />;
}
