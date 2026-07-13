import { useState } from "react";
import { Info, Pill, Plus, X } from "lucide-react";
import { PanelHeader, TextField } from "./shared";
import { SectionTitle } from "../components/TodayTimeline";

interface MedSetting {
  id: string;
  name: string;
  dose: string;
  time: string;
}

const INITIAL: MedSetting[] = [
  { id: "s1", name: "콘서타", dose: "18mg", time: "08:00" },
  { id: "s2", name: "오메가3", dose: "1정", time: "08:00" },
  { id: "s3", name: "비타민 D", dose: "1정", time: "12:30" },
];

/** 복약 설정 — 리마인더용 목록 관리(FR-302). 진단·치료 기능 없음. */
export function MedsPanel({ onBack }: { onBack: () => void }) {
  const [meds, setMeds] = useState(INITIAL);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("08:00");

  const add = () => {
    if (!name.trim()) return;
    setMeds((m) => [...m, { id: `${Date.now()}`, name: name.trim(), dose: dose.trim() || "1정", time }]);
    setName("");
    setDose("");
  };

  const remove = (id: string) => setMeds((m) => m.filter((x) => x.id !== id));

  return (
    <>
      <PanelHeader title="복약 설정" onBack={onBack} />
      <div className="px-4 pb-4">
        <SectionTitle title="등록된 약" hint={`${meds.length}개`} />

        <ul className="mt-3 space-y-2">
          {meds.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-2.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-primary-weak)] text-[var(--e-primary-deep)]">
                <Pill size={16} strokeWidth={2.4} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-[var(--e-text)]">
                  {m.name} <span className="text-[12px] font-semibold text-[var(--e-text-subtle)]">{m.dose}</span>
                </span>
                <span className="eddie-num block text-[11px] font-semibold text-[var(--e-text-subtle)]">
                  매일 {m.time}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove(m.id)}
                aria-label={`${m.name} 삭제`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--e-text-subtle)]"
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-2 rounded-[var(--e-r-md)] border border-dashed border-[var(--e-border-strong)] p-3">
          <p className="text-[12px] font-bold text-[var(--e-text-muted)]">새 약 추가</p>
          <div className="flex gap-2">
            <TextField value={name} onChange={setName} placeholder="약 이름" className="flex-1" />
            <TextField value={dose} onChange={setDose} placeholder="용량" className="w-20" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="eddie-num rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface)] px-2 py-2 text-[13px] font-bold text-[var(--e-text)]"
            />
            <button
              type="button"
              onClick={add}
              className="ml-auto flex min-h-[36px] items-center gap-1 rounded-[var(--e-r-sm)] bg-[var(--e-primary)] px-3 text-[12px] font-bold text-[var(--e-on-primary)]"
            >
              <Plus size={14} strokeWidth={2.6} aria-hidden />
              추가
            </button>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-1.5 rounded-[var(--e-r-md)] bg-[var(--e-surface-2)] px-3 py-2.5 text-[11px] leading-relaxed text-[var(--e-text-subtle)]">
          <Info size={13} strokeWidth={2.2} className="mt-px shrink-0" aria-hidden />
          복약 리마인더예요. 진단·치료 기능은 없어요. 복약 결정은 전문가와 상의하세요.
        </p>
      </div>
    </>
  );
}
