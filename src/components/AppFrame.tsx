import { useState, type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import { BottomTabBar } from "./BottomTabBar";
import { QuickCaptureFab } from "./QuickCaptureFab";
import { QuickCaptureSheet } from "./QuickCaptureSheet";
import { formatHHMM, useNow } from "../useNow";

/**
 * 공용 디바이스 프레임(390×844) — 상태바 + 하단 4탭 + 빠른 캡처 FAB.
 * 각 탭 화면은 이 프레임의 children으로 자기 <main>과 모달을 직접 반환한다
 * (모달은 .eddie-app을 containing block으로 삼아야 화면 전체를 덮으므로,
 *  <main>의 overflow에 잘리지 않도록 항상 <main>과 형제로 렌더링한다).
 */
export function AppFrame({
  active,
  onTabChange,
  children,
}: {
  active: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}) {
  const [captureOpen, setCaptureOpen] = useState(false);

  return (
    <div className="grid min-h-[100dvh] w-full place-items-center bg-[#EFE7DD] p-0 sm:p-6">
      <div className="eddie-app relative flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-[var(--e-bg)] sm:h-[844px] sm:rounded-[44px] sm:shadow-[0_30px_70px_rgba(80,50,20,.28)] sm:ring-1 sm:ring-black/5">
        <StatusBar />

        {children}

        <QuickCaptureFab onClick={() => setCaptureOpen(true)} />
        <BottomTabBar active={active} onSelect={onTabChange} />

        <QuickCaptureSheet open={captureOpen} onClose={() => setCaptureOpen(false)} />
      </div>
    </div>
  );
}

/** iOS 풍 상태바(목업) — 모바일 프레임 현실감. */
function StatusBar() {
  const now = useNow(15_000);
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-bold text-[var(--e-text)]">
      <span className="eddie-num">{formatHHMM(now)}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.6} aria-hidden />
        <Wifi size={15} strokeWidth={2.6} aria-hidden />
        <BatteryFull size={18} strokeWidth={2} aria-hidden />
      </div>
    </div>
  );
}
