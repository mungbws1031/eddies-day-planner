import { useState } from "react";
import { AppFrame } from "./components/AppFrame";
import { EddieTodayScreen } from "./EddieTodayScreen";
import { CalendarScreen } from "./CalendarScreen";
import { EddieCompanionScreen } from "./EddieCompanionScreen";
import { MoreScreen } from "./MoreScreen";

export default function App() {
  const [tab, setTab] = useState("today");

  return (
    <AppFrame active={tab} onTabChange={setTab}>
      {tab === "today" && <EddieTodayScreen />}
      {tab === "calendar" && <CalendarScreen />}
      {tab === "eddie" && <EddieCompanionScreen />}
      {tab === "more" && <MoreScreen />}
    </AppFrame>
  );
}
