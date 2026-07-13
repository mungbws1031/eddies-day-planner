import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PanelHeader, TextField } from "./shared";
import { SectionTitle } from "../components/TodayTimeline";

interface PlaceItem {
  id: string;
  emoji: string;
  item: string;
  place: string;
}

const INITIAL: PlaceItem[] = [
  { id: "p1", emoji: "🔑", item: "열쇠", place: "신발장 위 트레이" },
  { id: "p2", emoji: "👛", item: "지갑", place: "현관 선반" },
  { id: "p3", emoji: "🕶️", item: "안경", place: "침대 협탁" },
  { id: "p4", emoji: "🎧", item: "이어폰", place: "가방 앞주머니" },
];

/** 제자리 맵 — 자주 잃는 물건의 지정 위치 + 외출/귀가 체크(FR-305). */
export function PlaceMapPanel({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState(INITIAL);
  const [item, setItem] = useState("");
  const [place, setPlace] = useState("");

  const add = () => {
    if (!item.trim() || !place.trim()) return;
    setItems((prev) => [...prev, { id: `${Date.now()}`, emoji: "📌", item: item.trim(), place: place.trim() }]);
    setItem("");
    setPlace("");
  };

  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <>
      <PanelHeader title="제자리 맵" onBack={onBack} />
      <div className="px-4 pb-4">
        <SectionTitle title="지정 위치" hint={`${items.length}개`} />
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-2.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-surface-2)] text-[18px]">
                {i.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-[var(--e-text)]">{i.item}</span>
                <span className="block text-[12px] font-semibold text-[var(--e-text-subtle)]">
                  → {i.place}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove(i.id)}
                aria-label={`${i.item} 삭제`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--e-text-subtle)]"
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex gap-2">
          <TextField value={item} onChange={setItem} placeholder="물건" className="w-24" />
          <TextField value={place} onChange={setPlace} placeholder="지정 위치" className="flex-1" />
          <button
            type="button"
            onClick={add}
            aria-label="추가"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--e-primary-weak)] text-[var(--e-primary-deep)]"
          >
            <Plus size={16} strokeWidth={2.6} />
          </button>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-[var(--e-text-subtle)]">
          나갈 때 · 들어올 때 이 목록으로 원탭 체크할 수 있게 될 자리예요.
        </p>
      </div>
    </>
  );
}
