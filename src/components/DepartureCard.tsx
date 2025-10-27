import type { DepartureItem } from "../lib/time";
import { formatHm, formatCountdown } from "../lib/time";

type DepartureCardProps = {
  departure: DepartureItem;
  size: "large" | "medium";
  currentTime: Date;
};

export function DepartureCard({ departure, size, currentTime }: DepartureCardProps) {
  const remainingMs = departure.departureTime.getTime() - currentTime.getTime();
  const countdown = formatCountdown(remainingMs);
  const timeStr = formatHm(departure.departureTime);

  return (
    <div className={`departure-card departure-card-${size}`}>
      <div className="departure-label">
        {size === "large" ? "次発" : "次々発"}
      </div>
      <div className="departure-time">
        {timeStr}
      </div>
      <div className="departure-destination">
        {departure.label}
      </div>
      <div className="departure-countdown" aria-live="polite">
        残り {countdown}
      </div>
    </div>
  );
}
