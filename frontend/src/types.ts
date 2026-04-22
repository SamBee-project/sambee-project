export interface Hive {
  id: string;
  name: string;
  location: string;
  temperature: number;
  humidity: number;
  weight: number;
  health: "excellent" | "good" | "warning" | "critical";
  queenStatus: "healthy" | "aging" | "missing";
  lastInspection: string;
  honeyProduction: number;
  population: number;
  frames: number;
  created_at: Date;
}

export interface Inspection {
  id: string;
  hiveId: string;
  hiveName: string;
  date: string;
  inspector: string;
  queenSeen: boolean;
  broodPattern: "excellent" | "good" | "poor";
  temperament: "calm" | "normal" | "aggressive";
  signs: string[];
  notes: string;
  images?: string[];
}

export interface Alert {
  id: string;
  hiveId: string;
  hiveName: string;
  type: "temperature" | "humidity" | "weight" | "health" | "queen";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: string;
}
