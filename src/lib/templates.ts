import type { Template } from "./types";

export const TEMPLATES: Template[] = [
  {
    id: "template_beach",
    name: "Beach",
    icon: "beach_access",
    defaultItems: [
      { name: "SPF 50+ Face Sunscreen", description: "Essential protection • 100ml tube", category: "Beach Day", icon: "light_mode" },
      { name: "Two Swimsuits", description: "One to wear, one to dry", category: "Apparel", icon: "pool" },
      { name: "Microfiber Travel Beach Towel", description: "Fast-drying, sand-resistant", category: "Beach Day", icon: "dry" },
      { name: "Polarized Sunglasses", description: "Glare protection for the water", category: "Accessories", icon: "sunny" },
      { name: "Waterproof Phone Pouch", description: "Pool & beach safe", category: "Electronics", icon: "phone_iphone" },
      { name: "Sand-friendly Flip Flops", description: "Easy on, easy off", category: "Apparel", icon: "footprint" },
      { name: "Kindle or Paperback Book", description: "Beach reading", category: "Entertainment", icon: "menu_book" },
      { name: "Wide-brimmed Sun Hat", description: "Face & neck shade", category: "Accessories", icon: "hat" },
      { name: "Aloe Vera / After-sun Lotion", description: "For unexpected burns", category: "Toiletries", icon: "healing" },
      { name: "Reusable Water Bottle", description: "Stay hydrated", category: "Essentials", icon: "water_drop" },
    ],
  },
  {
    id: "template_business",
    name: "Business",
    icon: "work",
    defaultItems: [
      { name: "Wrinkle-resistant Blouse / Button-down", description: "Ready out of the suitcase", category: "Apparel", icon: "checkroom" },
      { name: "Laptop & Charger", description: "Dedicated travel charger", category: "Electronics", icon: "laptop_mac" },
      { name: "Noise-canceling Headphones", description: "Flights & focus", category: "Electronics", icon: "headphones" },
      { name: "Professional Day Shoes", description: "Meeting-ready", category: "Apparel", icon: "steps" },
      { name: "Casual Evening Shoes", description: "Dinner / hotel", category: "Apparel", icon: "ice_skating" },
      { name: "Travel Steamer or Wrinkle Spray", description: "Compact & quick", category: "Toiletries", icon: "iron" },
      { name: "Breath Mints or Gum", description: "Pre-meeting confidence", category: "Toiletries", icon: "spa" },
      { name: "Portable Power Bank", description: "Full-day battery insurance", category: "Electronics", icon: "battery_charging_full" },
      { name: "Business Cards", description: "For new connections", category: "Documents", icon: "badge" },
      { name: "Notepad and Pen", description: "Meeting notes", category: "Documents", icon: "edit_note" },
    ],
  },
  {
    id: "template_weekend",
    name: "Weekend",
    icon: "weekend",
    defaultItems: [
      { name: "Versatile Outerwear", description: "Denim or light jacket", category: "Apparel", icon: "checkroom" },
      { name: "Two Neutral T-shirts", description: "Layer-friendly basics", category: "Apparel", icon: "apparel" },
      { name: "Comfortable Walking Sneakers", description: "All-day pavement ready", category: "Apparel", icon: "directions_walk" },
      { name: "Underwear", description: "Days + 1 rule", category: "Apparel", icon: "laundry" },
      { name: "Clean Socks", description: "Days + 1 rule", category: "Apparel", icon: "ankle_socks" },
      { name: "Phone Charger (Extra-long Cord)", description: "6ft+ for awkward hotel outlets", category: "Electronics", icon: "cable" },
      { name: "Travel Toothpaste & Toothbrush", description: "TSA-friendly size", category: "Toiletries", icon: "dentistry" },
      { name: "Deodorant", description: "Travel size preferred", category: "Toiletries", icon: "spa" },
      { name: "Sleepwear / Pajamas", description: "Hotel-appropriate", category: "Apparel", icon: "bedtime" },
      { name: "Ibuprofen / Pain Reliever", description: "For unexpected aches", category: "Toiletries", icon: "medication" },
    ],
  },
];

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}
