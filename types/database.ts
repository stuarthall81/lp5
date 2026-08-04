export type Player = {
  id: string;
  display_name: string;
  email: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Competition = {
  id: string;
  name: string;
  course: string;
  date: string;
  entry_fee: number;
  rollover: number;
};

export type Entry = {
  competition_id: string;
  player_uuid: string | null;
  player_id: string;
  playing: boolean;
  paid: boolean;
  score: number | null;
};
