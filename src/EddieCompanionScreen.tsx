import { useMemo, useState } from "react";
import { Check, Moon, Sparkles } from "lucide-react";
import { EddieMascot } from "./components/EddieMascot";
import { SectionTitle } from "./components/TodayTimeline";
import type { EddieMood } from "./data";

interface StreakDay {
  label: string; // 요일
  kind: "done" | "recovered" | "empty" | "none";
}

const STREAK: StreakDay[] = [
  { label: "월", kind: "done" },
  { label: "화", kind: "recovered" },
  { label: "수", kind: "done" },
  { label: "목", kind: "empty" },
  { label: "금", kind: "done" },
  { label: "토", kind: "recovered" },
  { label: "일", kind: "none" }, // 오늘(아직 진행 중)
];

interface ReflectionItem {
  id: string;
  title: string;
  done: boolean;
}

const CORE_ITEMS: ReflectionItem[] = [
  { id: "r1", title: "출근 안 늦기", done: true },
  { id: "r2", title: "보고서 초안 쓰기", done: false },
  { id: "r3", title: "약 챙겨 먹기", done: true },
];

const ENCOURAGEMENTS = [
  "오늘도 여기까지 온 것만으로 잘하고 있어.",
  "완료 안 된 건 그냥 내일로 넘기면 돼.",
  "천천히 해도 괜찮아, 나는 계속 옆에 있을게.",
];

/**
 * 에디 탭 — 동행·동기부여(IA §1.1). 캐릭터 상태·격려·회복형 스트릭·저녁 회고.
 *
 * 금지 패턴: 스트릭은 절대 "리셋"으로 표현하지 않는다(FR-402, R-02).
 * 저녁 회고는 '완벽'이 아닌 '괜찮은 하루'(핵심 1개 이상) 기준(FR-403).
 * 복귀 환영도 담백하게 — 과도한 정서적 의존 유도 카피 금지.
 */
export function EddieCompanionScreen() {
  const doneCount = CORE_ITEMS.filter((i) => i.done).length;
  const recoveredThisWeek = STREAK.filter((d) => d.kind === "recovered").length;

  const mood: EddieMood = doneCount === CORE_ITEMS.length ? "happy" : doneCount > 0 ? "cheer" : "calm";
  const encouragement = useMemo(
    () => ENCOURAGEMENTS[new Date().getDate() % ENCOURAGEMENTS.length],
    [],
  );

  const [nightMode, setNightMode] = useState(false);

  return (
    <main className="eddie-scroll flex-1 overflow-y-auto pb-[150px]">
      {/* 캐릭터 상태 · 격려 */}
      <section className="eddie-rise px-5 pt-5 pb-4 text-center">
        <EddieMascot mood={nightMode ? "night" : mood} size={104} className="eddie-bob mx-auto" />
        <p className="mx-auto mt-3 max-w-[260px] rounded-[var(--e-r-md)] bg-[var(--e-primary-weak)] px-4 py-2.5 text-[14px] font-bold leading-snug text-[var(--e-text)]">
          {nightMode ? "오늘도 고생했어. 잘 자." : encouragement}
        </p>
      </section>

      {/* 회복형 스트릭 */}
      <section className="px-4">
        <SectionTitle title="이번 주" hint={`회복 ${recoveredThisWeek}번`} />
        <div className="mt-3 flex items-center justify-between rounded-[var(--e-r-lg)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3 py-4 shadow-[var(--e-shadow-card)]">
          {STREAK.map((d) => (
            <StreakDot key={d.label} day={d} />
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--e-text-subtle)]">
          <Sparkles size={13} strokeWidth={2.4} className="text-[var(--e-primary-deep)]" aria-hidden />
          스트릭은 리셋되지 않아 — 놓쳐도 회복하면 계속 이어져.
        </p>
      </section>

      {/* 저녁 회고 */}
      <section className="mt-5 px-4">
        <SectionTitle title="오늘 회고" hint="완벽 아닌 괜찮은 하루" />
        <div className="mt-3 rounded-[var(--e-r-lg)] border border-[var(--e-border)] bg-[var(--e-surface)] p-4 shadow-[var(--e-shadow-card)]">
          <ul className="space-y-2">
            {CORE_ITEMS.map((i) => (
              <li key={i.id} className="flex items-center gap-2.5">
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                  style={{
                    background: i.done ? "var(--e-done-bg)" : "var(--e-surface-2)",
                    color: i.done ? "var(--e-done)" : "var(--e-text-subtle)",
                  }}
                >
                  {i.done && <Check size={13} strokeWidth={3} />}
                </span>
                <span
                  className="text-[14px] font-bold"
                  style={{ color: i.done ? "var(--e-text)" : "var(--e-text-subtle)" }}
                >
                  {i.title}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-3.5 rounded-[var(--e-r-md)] px-3.5 py-2.5 text-center"
            style={{
              background: doneCount > 0 ? "var(--e-done-bg)" : "var(--e-surface-2)",
              color: doneCount > 0 ? "var(--e-done)" : "var(--e-text-muted)",
            }}
          >
            <p className="text-[14px] font-extrabold">
              {doneCount > 0 ? "괜찮은 하루였어" : "내일 다시 해보자"}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold opacity-80">
              {doneCount > 0 ? `핵심 ${doneCount}개 해냈어` : "오늘은 여기까지, 비난 없이"}
            </p>
          </div>

          <p className="mt-3 text-[12px] font-semibold text-[var(--e-text-subtle)]">
            내일 미리보기 — 팀 회의 09:00, 병원 예약 14:00
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNightMode(true)}
          className="mt-3 flex min-h-[var(--e-touch)] w-full items-center justify-center gap-2 rounded-[var(--e-r-md)] bg-[var(--e-surface-2)] px-4 font-bold text-[var(--e-text)]"
        >
          <Moon size={16} strokeWidth={2.4} aria-hidden />
          에디 굿나잇
        </button>
      </section>
    </main>
  );
}

function StreakDot({ day }: { day: StreakDay }) {
  const style =
    day.kind === "done"
      ? { background: "var(--e-done)", color: "var(--e-done)" }
      : day.kind === "recovered"
        ? { background: "var(--e-primary)", color: "var(--e-primary-deep)" }
        : { background: "var(--e-border)", color: "var(--e-text-subtle)" };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className="grid h-7 w-7 place-items-center rounded-full"
        style={{ background: day.kind === "none" ? "var(--e-surface-2)" : style.background }}
      >
        {day.kind === "recovered" && <Sparkles size={13} strokeWidth={2.6} className="text-white" />}
        {day.kind === "done" && <Check size={13} strokeWidth={3} className="text-white" />}
      </span>
      <span className="text-[10px] font-bold text-[var(--e-text-subtle)]">{day.label}</span>
    </div>
  );
}
