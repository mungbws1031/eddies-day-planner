import { useEffect, useState } from "react";
import { Check, Mic } from "lucide-react";
import { BottomSheet } from "./BottomSheet";

/**
 * 빠른 캡처 시트 — FAB(모든 화면 상시 노출)의 목적지(FR-201·NFR-P-002).
 * 입력→저장 마찰을 최소화: 텍스트 한 줄 + 원탭 저장, 1초 내 완료 느낌.
 * 실제 저장소 연동 없이 "저장했어" 확인만 보여주는 시안용 목업.
 */
export function QuickCaptureSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setText("");
      setSaved(false);
    }
  }, [open]);

  const save = () => {
    if (!text.trim()) return;
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="빠른 캡처">
      {saved ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--e-done-bg)] text-[var(--e-done)]">
            <Check size={22} strokeWidth={2.8} aria-hidden />
          </span>
          <p className="mt-3 text-[15px] font-bold text-[var(--e-text)]">저장했어</p>
          <p className="mt-1 text-[12px] text-[var(--e-text-subtle)]">
            나중에 오늘 할 일에서 시간 정할 수 있어
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[13px] font-semibold text-[var(--e-text-muted)]">
            뭐든 던져도 돼 — 나중에 정리는 에디가 도와줄게
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3 py-2.5">
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="예: 약국 처방전 받기"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[var(--e-text)] outline-none placeholder:text-[var(--e-text-subtle)]"
            />
            <button
              type="button"
              aria-label="음성으로 캡처(목업)"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-surface-2)] text-[var(--e-text-muted)]"
            >
              <Mic size={16} strokeWidth={2.4} aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={!text.trim()}
            className="mt-3 flex min-h-[var(--e-touch)] w-full items-center justify-center gap-2 rounded-[var(--e-r-md)] bg-[var(--e-primary)] px-4 font-bold text-[var(--e-on-primary)] shadow-[var(--e-shadow-fab)] disabled:opacity-40"
          >
            저장
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
