export type StreamStatus = "Active" | "Paused" | "Completed";

export interface Stream {
  name: string;
  id: string;
  recipient: string;
  rate: string;
  status: StreamStatus;
}