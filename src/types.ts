export interface Attachment {
  name: string;
  type: "text" | "audio" | "video" | "programming" | "image" | "file";
  mimeType: string;
  base64?: string;
  content?: string;
  size?: number;
  url?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
}

export type CategoryColor = "blue" | "purple" | "rose" | "emerald" | "amber" | "teal" | "indigo" | "slate";

export interface ProjectRepo {
  id: string;
  name: string;
  desc: string;
  tag: string;
  colorTag?: CategoryColor;
  status: "active" | "idling" | "running";
  logs: string[];
  pinned?: boolean;
  priority?: "normal" | "high" | "urgent";
}

export interface ResourceItem {
  title: string;
  category: "AI Tool" | "Book" | "Course" | "Workflow";
  tags: string[];
  rating: number;
  description: string;
  recommendedReason: string;
}

export interface SOPStep {
  stepNumber: string;
  title: string;
  desc: string;
  promptTemplate: string;
  details: string[];
}
