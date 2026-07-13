import { useState } from "react";
import { Info } from "lucide-react";
import { PanelHeader, ToggleRow } from "./shared";
import { SectionTitle } from "../components/TodayTimeline";

/** 알림 설정 — 종류별 on/off + 방해금지 시간대(NFR-A-004 관련, FR-404 안내). */
export function NotificationsPanel({ onBack }: { onBack: () => void }) {
  const [departure, setDeparture] = useState(true);
  const [meds, setMeds] = useState(true);
  const [evening, setEvening] = useState(true);
  const [retry, setRetry] = useState(true);

  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  return (
    <>
      <PanelHeader title="알림 설정" onBack={onBack} />
      <div className="px-4 pb-4">
        <SectionTitle title="알림 종류" />
        <div className="mt-3 space-y-2">
          <ToggleRow label="출발 알림" desc="출발 시각 임박 시 카운트다운 넛지" checked={departure} onChange={setDeparture} />
          <ToggleRow label="복약 알림" desc="예정 시각에 원탭 확인 요청" checked={meds} onChange={setMeds} />
          <ToggleRow label="저녁 회고 알림" desc="와인드다운 시간에 오늘 회고 안내" checked={evening} onChange={setEvening} />
          <ToggleRow
            label="놓침 재알림"
            desc="자책 없는 문구로 한 번 더 알려줘"
            checked={retry}
            onChange={setRetry}
          />
        </div>

        <div className="mt-5">
          <SectionTitle title="방해금지 시간대" />
          <div className="mt-3 flex items-center gap-2 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3">
            <input
              type="time"
              value={quietStart}
              onChange={(e) => setQuietStart(e.target.value)}
              className="eddie-num rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface-2)] px-2 py-2 text-[13px] font-bold text-[var(--e-text)]"
            />
            <span className="text-[13px] font-bold text-[var(--e-text-subtle)]">부터</span>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
              className="eddie-num rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface-2)] px-2 py-2 text-[13px] font-bold text-[var(--e-text)]"
            />
            <span className="text-[13px] font-bold text-[var(--e-text-subtle)]">까지</span>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-1.5 rounded-[var(--e-r-md)] bg-[var(--e-surface-2)] px-3 py-2.5 text-[11px] leading-relaxed text-[var(--e-text-subtle)]">
          <Info size={13} strokeWidth={2.2} className="mt-px shrink-0" aria-hidden />
          같은 알림을 계속 무시하면 강도·횟수를 자동으로 줄여서 알림 피로를 막아요.
        </p>
      </div>
    </>
  );
}
