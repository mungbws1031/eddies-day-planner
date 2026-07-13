import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PanelHeader, Switch, TextField } from "./shared";
import { SectionTitle } from "../components/TodayTimeline";

interface RoutineStep {
  id: string;
  time: string;
  title: string;
  active: boolean;
}

const MORNING: RoutineStep[] = [
  { id: "m1", time: "07:20", title: "약 먹기", active: true },
  { id: "m2", time: "07:30", title: "세수·양치", active: true },
  { id: "m3", time: "07:40", title: "스트레칭 5분", active: true },
];

const EVENING: RoutineStep[] = [
  { id: "e1", time: "21:30", title: "화면 줄이기", active: true },
  { id: "e2", time: "22:00", title: "내일 옷 꺼내두기", active: false },
  { id: "e3", time: "22:20", title: "취침", active: true },
];

/** 루틴 빌더 — 아침/저녁 루틴을 캘린더에 통합 표시하는 원천(FR-301). */
export function RoutinePanel({ onBack }: { onBack: () => void }) {
  const [morning, setMorning] = useState(MORNING);
  const [evening, setEvening] = useState(EVENING);

  return (
    <>
      <PanelHeader title="루틴 빌더" onBack={onBack} />
      <div className="px-4 pb-4">
        <RoutineGroup title="아침 루틴" steps={morning} onChange={setMorning} />
        <div className="mt-5">
          <RoutineGroup title="저녁 루틴" steps={evening} onChange={setEvening} />
        </div>
      </div>
    </>
  );
}

function RoutineGroup({
  title,
  steps,
  onChange,
}: {
  title: string;
  steps: RoutineStep[];
  onChange: (s: RoutineStep[]) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");

  const addStep = () => {
    if (!newTitle.trim()) return;
    onChange([...steps, { id: `${Date.now()}`, time: newTime, title: newTitle.trim(), active: true }]);
    setNewTitle("");
  };

  const removeStep = (id: string) => onChange(steps.filter((s) => s.id !== id));
  const toggleStep = (id: string) =>
    onChange(steps.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <section>
      <SectionTitle title={title} hint={`${steps.length}단계`} />
      <ul className="mt-3 space-y-2">
        {steps.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3 py-2.5"
          >
            <span className="eddie-num w-12 shrink-0 text-[12px] font-bold text-[var(--e-text-muted)]">
              {s.time}
            </span>
            <span
              className="min-w-0 flex-1 text-[14px] font-bold"
              style={{ color: s.active ? "var(--e-text)" : "var(--e-text-subtle)" }}
            >
              {s.title}
            </span>
            <Switch checked={s.active} onChange={() => toggleStep(s.id)} />
            <button
              type="button"
              onClick={() => removeStep(s.id)}
              aria-label={`${s.title} 삭제`}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--e-text-subtle)]"
            >
              <X size={14} strokeWidth={2.4} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="eddie-num shrink-0 rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface)] px-2 py-2 text-[13px] font-bold text-[var(--e-text)]"
        />
        <TextField value={newTitle} onChange={setNewTitle} placeholder="단계 추가" className="flex-1" />
        <button
          type="button"
          onClick={addStep}
          aria-label="단계 추가"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-primary-weak)] text-[var(--e-primary-deep)]"
        >
          <Plus size={16} strokeWidth={2.6} />
        </button>
      </div>
    </section>
  );
}
