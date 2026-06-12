import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ItemStatus, PackItem, Trip } from "./types";
import { getTemplate } from "./templates";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

interface TripStore {
  trip: Trip | null;
  history: Array<{ itemId: string; previousStatus: ItemStatus }>;
  createTrip: (input: {
    name: string;
    templateId: string;
    customItems: string[];
    luggageType?: string;
  }) => void;
  setStatus: (itemId: string, status: ItemStatus) => void;
  undo: () => void;
  addCustomItem: (name: string) => void;
  reset: () => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      trip: null,
      history: [],
      createTrip: ({ name, templateId, customItems, luggageType }) => {
        const template = getTemplate(templateId);
        const tripId = uid("trip");
        const baseItems: PackItem[] = (template?.defaultItems ?? []).map((t) => ({
          id: uid("item"),
          tripId,
          name: t.name,
          description: t.description,
          category: t.category,
          icon: t.icon,
          status: "pending",
          isCustom: false,
        }));
        const customs: PackItem[] = customItems
          .filter((n) => n.trim())
          .map((n) => ({
            id: uid("item"),
            tripId,
            name: n.trim(),
            description: "Added by you",
            category: "Must-Haves",
            icon: "star",
            status: "pending",
            isCustom: true,
          }));
        set({
          trip: {
            id: tripId,
            name: name.trim() || "Untitled Trip",
            templateId,
            luggageType,
            items: [...customs, ...baseItems],
          },
          history: [],
        });
      },
      setStatus: (itemId, status) => {
        const trip = get().trip;
        if (!trip) return;
        const item = trip.items.find((i) => i.id === itemId);
        if (!item) return;
        const prev = item.status;
        set({
          trip: {
            ...trip,
            items: trip.items.map((i) => (i.id === itemId ? { ...i, status } : i)),
          },
          history: [...get().history, { itemId, previousStatus: prev }],
        });
      },
      undo: () => {
        const { trip, history } = get();
        if (!trip || history.length === 0) return;
        const last = history[history.length - 1];
        set({
          trip: {
            ...trip,
            items: trip.items.map((i) =>
              i.id === last.itemId ? { ...i, status: last.previousStatus } : i,
            ),
          },
          history: history.slice(0, -1),
        });
      },
      addCustomItem: (name) => {
        const trip = get().trip;
        if (!trip || !name.trim()) return;
        const newItem: PackItem = {
          id: uid("item"),
          tripId: trip.id,
          name: name.trim(),
          description: "Added by you",
          category: "Must-Haves",
          icon: "star",
          status: "pending",
          isCustom: true,
        };
        set({ trip: { ...trip, items: [newItem, ...trip.items] } });
      },
      reset: () => set({ trip: null, history: [] }),
    }),
    {
      name: "packswipe-trip",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
      skipHydration: false,
    },
  ),
);
