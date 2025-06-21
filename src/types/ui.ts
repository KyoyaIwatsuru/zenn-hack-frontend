import { MediaCreateData } from "./index";

// UI state management type for media creation with status tracking
export type MediaCreateResult = MediaCreateData & {
  status: "pending" | "success" | "error";
  error?: string;
};
