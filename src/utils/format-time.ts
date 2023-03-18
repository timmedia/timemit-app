export function formatTimestamp(millis: number) {
  const fullHours = Math.floor(millis / 1000 / 60 / 60);
  const fullMinutes = Math.floor(millis / 1000 / 60 - fullHours * 60);
  const seconds = millis / 1000 - fullHours * 60 * 60 - fullMinutes * 60;
  const h = fullHours > 0 ? `${fullHours.toString()}:` : "";
  const m =
    fullHours > 0
      ? `${fullMinutes.toString().padStart(2, "0")}:`
      : fullMinutes > 0
      ? `${fullMinutes.toString()}:`
      : "";
  const s = seconds.toFixed(2).padStart(5, "0");
  return `${h}${m}${s}`;
}
