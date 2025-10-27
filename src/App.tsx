import { useState, useEffect } from "react";
import "./App.css";
import type { StopName } from "./lib/schedule";
import { isServiceDay } from "./lib/holidays";
import { getNextDepartures, getFirstDeparturesToday, formatDateJa } from "./lib/time";
import { Tabs } from "./components/Tabs";
import { StatusBar } from "./components/StatusBar";
import { DepartureCard } from "./components/DepartureCard";
import { FirstDeparture } from "./components/FirstDeparture";

function App() {
  const [activeTab, setActiveTab] = useState<StopName>("萩山駅");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isService, setIsService] = useState<boolean>(true);

  const tabs: StopName[] = ["萩山駅", "NCNP病院", "新小平駅"];

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if today is a service day
  useEffect(() => {
    const checkServiceDay = () => {
      const today = new Date();
      setIsService(isServiceDay(today));
    };

    checkServiceDay();
    // Re-check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      checkServiceDay();
      // Set up daily interval
      setInterval(checkServiceDay, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const dateStr = formatDateJa(currentTime);
  const currentHour = currentTime.getHours();

  // Determine what to display
  let content;

  if (!isService) {
    // Show inactive status for weekends/holidays
    content = null;
  } else if (currentHour <= 7) {
    // Before 8:00 AM, show first departure only
    const firstDepartures = getFirstDeparturesToday(activeTab, currentTime);
    content = <FirstDeparture departures={firstDepartures} currentTime={currentTime} />;
  } else {
    // After 8:00 AM, show next and after-next departures
    const nextDepartures = getNextDepartures(activeTab, currentTime, 2);

    if (nextDepartures.length === 0) {
      // Service ended for the day
      content = null;
    } else {
      content = (
        <div className="departures-container">
          {nextDepartures[0] && (
            <DepartureCard
              departure={nextDepartures[0]}
              size="large"
              currentTime={currentTime}
            />
          )}
          {nextDepartures[1] && (
            <DepartureCard
              departure={nextDepartures[1]}
              size="medium"
              currentTime={currentTime}
            />
          )}
        </div>
      );
    }
  }

  const isEnded =
    isService && currentHour > 7 && getNextDepartures(activeTab, currentTime, 1).length === 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">NCNPシャトルバス時刻表</h1>
      </header>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <StatusBar date={dateStr} isServiceDay={isService} isEnded={isEnded} />

      <main className="app-content">{content}</main>
    </div>
  );
}

export default App;
