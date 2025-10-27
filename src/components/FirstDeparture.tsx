import type { DepartureItem } from "../lib/time";
import { formatHm, formatCountdown } from "../lib/time";

type FirstDepartureProps = {
  departures: DepartureItem[];
  currentTime: Date;
};

export function FirstDeparture({ departures, currentTime }: FirstDepartureProps) {
  if (departures.length === 0) {
    return (
      <div className="first-departure">
        <div className="first-departure-title">本日の始発</div>
        <div className="first-departure-empty">運行情報がありません</div>
      </div>
    );
  }

  return (
    <div className="first-departure">
      <div className="first-departure-title">本日の始発</div>
      <div className="first-departure-list">
        {departures.map((dep, index) => {
          const remainingMs = dep.departureTime.getTime() - currentTime.getTime();
          const countdown = formatCountdown(remainingMs);
          const timeStr = formatHm(dep.departureTime);

          return (
            <div key={index} className="first-departure-item">
              <div className="first-departure-destination">{dep.label}</div>
              <div className="first-departure-time">{timeStr}</div>
              <div className="first-departure-countdown">残り {countdown}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
