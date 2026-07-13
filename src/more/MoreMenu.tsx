import type { ComponentType } from "react";
import { Bell, ChevronRight, MapPinned, Pill, Repeat, ShieldCheck } from "lucide-react";
import { SectionTitle } from "../components/TodayTimeline";

export type MoreItemId = "routine" | "meds" | "placemap" | "privacy" | "notifications";

interface Item {
  id: MoreItemId;
  title: string;
  desc: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const ITEMS: Item[] = [
  { id: "routine", title: "루틴 빌더", desc: "아침·저녁 루틴 구성", Icon: Repeat },
  { id: "meds", title: "복약 설정", desc: "약 이름·용량·시간 관리", Icon: Pill },
  { id: "placemap", title: "제자리 맵", desc: "자주 잃는 물건 위치 지정", Icon: MapPinned },
  { id: "privacy", title: "데이터·프라이버시", desc: "동의·내보내기·삭제", Icon: ShieldCheck },
  { id: "notifications", title: "알림 설정", desc: "알림 종류·방해금지 시간", Icon: Bell },
];

/**
 * 더보기 탭 메뉴 — 관리·설정(IA §1.1). 자주 안 쓰는 설정은 여기로 접어서
 * '오늘' 탭의 인지 부하를 낮춘다(progressive disclosure, NFR-A-002).
 */
export function MoreMenu({ onOpen }: { onOpen: (id: MoreItemId) => void }) {
  return (
    <div className="px-4 pt-4">
      <h1 className="text-[20px] font-extrabold text-[var(--e-text)]">더보기</h1>
      <p className="mt-0.5 text-[13px] font-semibold text-[var(--e-text-subtle)]">
        자주 안 쓰는 건 여기 접어뒀어
      </p>

      <div className="mt-4">
        <SectionTitle title="관리·설정" />
        <ul className="mt-3 space-y-2">
          {ITEMS.map(({ id, title, desc, Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onOpen(id)}
                className="flex min-h-[var(--e-touch)] w-full items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3 text-left shadow-[var(--e-shadow-card)] active:bg-[var(--e-surface-2)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--e-primary-weak)] text-[var(--e-primary-deep)]">
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[var(--e-text)]">{title}</span>
                  <span className="block text-[12px] font-semibold text-[var(--e-text-subtle)]">
                    {desc}
                  </span>
                </span>
                <ChevronRight size={18} strokeWidth={2.4} className="shrink-0 text-[var(--e-text-subtle)]" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 pb-2 text-center text-[11px] text-[var(--e-text-subtle)]">
        에디의 하루 · 시안 v0.1
      </p>
    </div>
  );
}
