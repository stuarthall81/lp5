import { PlayerEntry } from "@/types/playerEntry";
import { truncate } from "node:fs";

export const playerEntries: PlayerEntry[] = [
  {
    competitionId: "2026-proude-cup",
    playerId: "John Smith",
    playing: false,
    paid: false,
    
  },

  {
    competitionId: "2026-proude-cup",
    playerId: "Dave Jones",
    playing: true,
    paid: false,
  },

  {
    competitionId: "2026-proude-cup",
    playerId: "Chris Taylor",
    playing: true,
    paid: false,
  },
];
