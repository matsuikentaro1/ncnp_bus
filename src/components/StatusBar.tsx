type StatusBarProps = {
  date: string;
  isServiceDay: boolean;
  isEnded: boolean;
};

export function StatusBar({ date, isServiceDay, isEnded }: StatusBarProps) {
  if (!isServiceDay) {
    return (
      <div className="status-bar status-bar-inactive">
        本日は土日祝のためシャトルバスは運休です。
      </div>
    );
  }

  if (isEnded) {
    return (
      <div className="status-bar status-bar-inactive">
        本日のシャトルバスの運行は終了しました。
      </div>
    );
  }

  return (
    <div className="status-bar status-bar-active">
      {date}
    </div>
  );
}
