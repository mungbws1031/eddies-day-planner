import { useState } from "react";
import { ChevronRight, Download, ShieldCheck, Trash2 } from "lucide-react";
import { PanelHeader, ToggleRow } from "./shared";
import { SectionTitle } from "../components/TodayTimeline";

/**
 * 데이터·프라이버시 — 민감정보 별도 동의, 내보내기·삭제 상시 접근
 * (NFR-PR-001~003). 삭제 같은 파괴적 동작도 위협적인 빨강 대신
 * 차분한 톤으로 안내한다(브랜드 무채색 규칙 유지).
 */
export function PrivacyPanel({ onBack }: { onBack: () => void }) {
  const [sensitiveConsent, setSensitiveConsent] = useState(true);
  const [exported, setExported] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <>
      <PanelHeader title="데이터·프라이버시" onBack={onBack} />
      <div className="px-4 pb-4">
        <SectionTitle title="동의" />
        <div className="mt-3">
          <ToggleRow
            label="민감정보(복약·수면) 별도 동의"
            desc="복약·수면 기록은 일반 데이터와 분리해 암호화 보관해요"
            checked={sensitiveConsent}
            onChange={setSensitiveConsent}
          />
        </div>

        <div className="mt-5">
          <SectionTitle title="내 데이터" />
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => setExported(true)}
              className="flex min-h-[var(--e-touch)] w-full items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-primary-weak)] text-[var(--e-primary-deep)]">
                <Download size={16} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-[var(--e-text)]">데이터 내보내기</span>
                <span className="block text-[11px] text-[var(--e-text-subtle)]">
                  {exported ? "내보냈어요 · 다운로드 폴더 확인" : "전체 기록을 파일로 받기"}
                </span>
              </span>
            </button>

            {!deleted ? (
              <div className="rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-active-bg)] text-[var(--e-active)]">
                    <Trash2 size={16} strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-[var(--e-text)]">전체 삭제</span>
                    <span className="block text-[11px] text-[var(--e-text-subtle)]">
                      모든 기록을 지워요 · 되돌릴 수 없어요
                    </span>
                  </span>
                </button>

                {confirmDelete && (
                  <div className="mt-3 flex items-center gap-2 border-t border-[var(--e-border)] pt-3">
                    <p className="flex-1 text-[12px] font-semibold text-[var(--e-text-muted)]">
                      정말 삭제할까요?
                    </p>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="min-h-[36px] rounded-[var(--e-r-sm)] bg-[var(--e-surface-2)] px-3 text-[12px] font-bold text-[var(--e-text)]"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleted(true);
                        setConfirmDelete(false);
                      }}
                      className="min-h-[36px] rounded-[var(--e-r-sm)] bg-[var(--e-active)] px-3 text-[12px] font-bold text-white"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[var(--e-r-md)] bg-[var(--e-surface-2)] px-3.5 py-3 text-center text-[13px] font-semibold text-[var(--e-text-muted)]">
                삭제됐어요. 30일 안에 백업에서도 지워져요.
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="mt-5 flex min-h-[var(--e-touch)] w-full items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-surface-2)] text-[var(--e-text-muted)]">
            <ShieldCheck size={16} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1 text-[14px] font-bold text-[var(--e-text)]">
            개인정보 처리방침 보기
          </span>
          <ChevronRight size={18} strokeWidth={2.4} className="text-[var(--e-text-subtle)]" />
        </button>

        <p className="mt-4 text-[11px] leading-relaxed text-[var(--e-text-subtle)]">
          제3자 공유 없음(광고 목적 판매 금지). 처리 위치는 처리방침에 명시돼 있어요.
        </p>
      </div>
    </>
  );
}
