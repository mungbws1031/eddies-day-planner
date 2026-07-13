import { useState } from "react";
import { MoreMenu, type MoreItemId } from "./more/MoreMenu";
import { RoutinePanel } from "./more/RoutinePanel";
import { MedsPanel } from "./more/MedsPanel";
import { PlaceMapPanel } from "./more/PlaceMapPanel";
import { PrivacyPanel } from "./more/PrivacyPanel";
import { NotificationsPanel } from "./more/NotificationsPanel";

/**
 * 더보기 탭 — 관리·설정(IA §1.1). 메뉴에서 항목을 고르면 같은 <main> 안에서
 * 화면을 교체하는 얕은 내비게이션(뒤로가기로 메뉴 복귀).
 */
export function MoreScreen() {
  const [open, setOpen] = useState<MoreItemId | null>(null);

  return (
    <main className="eddie-scroll flex-1 overflow-y-auto pb-[150px]">
      {open === null && <MoreMenu onOpen={setOpen} />}
      {open === "routine" && <RoutinePanel onBack={() => setOpen(null)} />}
      {open === "meds" && <MedsPanel onBack={() => setOpen(null)} />}
      {open === "placemap" && <PlaceMapPanel onBack={() => setOpen(null)} />}
      {open === "privacy" && <PrivacyPanel onBack={() => setOpen(null)} />}
      {open === "notifications" && <NotificationsPanel onBack={() => setOpen(null)} />}
    </main>
  );
}
