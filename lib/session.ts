const SESSION_KEY = "lp5-player-id";

export function savePlayerSession(playerId: string) {
  localStorage.setItem(SESSION_KEY, playerId);
}

export function getPlayerSession() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearPlayerSession() {
  localStorage.removeItem(SESSION_KEY);
}
