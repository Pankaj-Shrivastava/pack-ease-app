export type ItemStatus = "pending" | "packed" | "decide_later" | "skipped";

export interface PackItem {
  id: string;
  tripId: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: ItemStatus;
  isCustom: boolean;
}

export interface Trip {
  id: string;
  name: string;
  templateId: string;
  startDate?: string;
  endDate?: string;
  luggageType?: string;
  items: PackItem[];
}

export interface TemplateItem {
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  defaultItems: TemplateItem[];
}
