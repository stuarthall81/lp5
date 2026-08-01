export function getCurrentPlayer() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("lowesParkPlayer");
}

export function setCurrentPlayer(player: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem("lowesParkPlayer", player);
}

export function getCurrentPlayerFirstName() {
  const player = getCurrentPlayer();

  if (!player) return "";

  return player.split(" ")[0];
}