import type { StopName } from "../lib/schedule";

type TabsProps = {
  tabs: StopName[];
  activeTab: StopName;
  onTabChange: (tab: StopName) => void;
};

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          className={`tab ${activeTab === tab ? "tab-active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
