import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Route as RouteIcon } from "lucide-react";
import { SectionTitle, STATUS, StatusPill } from "./components/TodayTimeline";
import { BottomSheet } from "./components/BottomSheet";
import {
  addDays,
  buildDemoEvents,
  dateKey,
  isSameDay,
  monthGridStart,
  startOfMonth,
  startOfWeek,
  weekdayLabel,
  type CalendarEvent,
} from "./calendarData";

type Mode = "week" | "month";

const DURATIONS = [15, 30, 45, 60, 90];
const TAGS = ["업무", "개인", "가족", "루틴", "집안"];

/**
 * 캘린더 탭 — 계획 뷰(IA §1.1). '오늘'(실행 뷰)과 역할을 분리해
 * 이번 주·이번 달을 조망하고 일정을 등록/편집하는 화면.
 *
 * FR-002: 일정 등록은 3탭 이내(＋ 열기 → 필드 채우기 → 저장, 2탭 + 입력).
 * R-06 체크리스트 항목(블록 충돌 감지)을 간단한 비차단 경고로 반영.
 */
export function CalendarScreen() {
  const today = useMemo(() => new Date(), []);
  const [mode, setMode] = useState<Mode>("week");
  const [selected, setSelected] = useState<Date>(today);
  const [monthCursor, setMonthCursor] = useState<Date>(startOfMonth(today));
  const [events, setEvents] = useState<CalendarEvent[]>(() => buildDemoEvents(today));
  const [formOpen, setFormOpen] = useState(false);

  const dayEvents = useMemo(
    () =>
      events
        .filter((e) => e.dateKey === dateKey(selected))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [events, selected],
  );

  const addEvent = (draft: Omit<CalendarEvent, "id" | "dateKey" | "status">) => {
    setEvents((prev) => [
      ...prev,
      { ...draft, id: `ev-${Date.now()}`, dateKey: dateKey(selected), status: "planned" },
    ]);
    setFormOpen(false);
  };

  return (
    <>
      <main className="eddie-scroll flex-1 overflow-y-auto pb-[150px]">
        <header className="px-5 pt-4 pb-2">
          <h1 className="text-[20px] font-extrabold text-[var(--e-text)]">캘린더</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-[var(--e-text-subtle)]">
            이번 주·이번 달을 조망해봐
          </p>
          <ModeToggle mode={mode} onChange={setMode} />
        </header>

        {mode === "week" ? (
          <WeekView
            today={today}
            selected={selected}
            onSelect={setSelected}
            events={events}
            dayEvents={dayEvents}
            onAddEvent={() => setFormOpen(true)}
          />
        ) : (
          <MonthView
            today={today}
            monthCursor={monthCursor}
            onMonthChange={setMonthCursor}
            selected={selected}
            events={events}
            onPickDay={(d) => {
              setSelected(d);
              setMode("week");
            }}
          />
        )}
      </main>

      <EventFormSheet
        open={formOpen}
        selected={selected}
        existing={dayEvents}
        onClose={() => setFormOpen(false)}
        onSave={addEvent}
      />
    </>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="mt-3 inline-flex rounded-[var(--e-r-md)] bg-[var(--e-surface-2)] p-1">
      {(["week", "month"] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className="min-h-[36px] rounded-[var(--e-r-sm)] px-4 text-[13px] font-bold transition-colors"
          style={{
            background: mode === m ? "var(--e-surface)" : "transparent",
            color: mode === m ? "var(--e-primary-deep)" : "var(--e-text-subtle)",
            boxShadow: mode === m ? "var(--e-shadow-card)" : "none",
          }}
        >
          {m === "week" ? "주 뷰" : "월 뷰"}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 주 뷰                                                                */
/* ------------------------------------------------------------------ */

function WeekView({
  today,
  selected,
  onSelect,
  events,
  dayEvents,
  onAddEvent,
}: {
  today: Date;
  selected: Date;
  onSelect: (d: Date) => void;
  events: CalendarEvent[];
  dayEvents: CalendarEvent[];
  onAddEvent: () => void;
}) {
  const weekStart = useMemo(() => startOfWeek(selected), [selected]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const countsByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of events) m.set(e.dateKey, (m.get(e.dateKey) ?? 0) + 1);
    return m;
  }, [events]);

  return (
    <>
      {/* 요일 스트립 */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-1 pt-2">
        {days.map((d) => {
          const isSel = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          const count = countsByDay.get(dateKey(d)) ?? 0;
          return (
            <button
              key={dateKey(d)}
              type="button"
              onClick={() => onSelect(d)}
              className="relative flex min-h-[64px] w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--e-r-md)] border"
              style={{
                background: isSel ? "var(--e-primary)" : "var(--e-surface)",
                borderColor: isSel ? "var(--e-primary)" : "var(--e-border)",
              }}
            >
              <span
                className="text-[11px] font-bold"
                style={{ color: isSel ? "var(--e-on-primary)" : "var(--e-text-subtle)" }}
              >
                {weekdayLabel(d)}
              </span>
              <span
                className="eddie-num text-[15px] font-extrabold"
                style={{ color: isSel ? "var(--e-on-primary)" : "var(--e-text)" }}
              >
                {d.getDate()}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: isToday ? (isSel ? "#fff" : "var(--e-primary)") : "transparent",
                }}
              />
              {count > 0 && (
                <span
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: isSel ? "#fff" : "var(--e-accent)" }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날 아젠다 */}
      <section className="mt-3 px-4">
        <SectionTitle
          title={agendaTitle(selected, today)}
          hint={dayEvents.length ? `${dayEvents.length}개` : undefined}
        />

        {dayEvents.length === 0 ? (
          <div className="mt-3 rounded-[var(--e-r-lg)] border border-dashed border-[var(--e-border-strong)] px-4 py-8 text-center">
            <p className="text-[14px] font-bold text-[var(--e-text-muted)]">이 날은 여유롭네!</p>
            <p className="mt-1 text-[12px] text-[var(--e-text-subtle)]">
              아직 일정이 없어. 편하게 채워도, 비워둬도 좋아.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {dayEvents.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onAddEvent}
          className="mt-3 flex min-h-[var(--e-touch)] w-full items-center justify-center gap-1.5 rounded-[var(--e-r-md)] border border-dashed border-[var(--e-primary)] px-3 text-[13px] font-bold text-[var(--e-primary-deep)]"
        >
          <Plus size={16} strokeWidth={2.6} aria-hidden />
          일정 추가
        </button>
      </section>
    </>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  const meta = STATUS[event.status];
  return (
    <li
      className="rounded-[var(--e-r-md)] border px-3 py-2.5"
      style={{ borderColor: "var(--e-border)", background: "var(--e-surface)" }}
    >
      <div className="flex items-center gap-2">
        <span className="eddie-num text-[13px] font-extrabold text-[var(--e-text)]">
          {event.time}
        </span>
        <StatusPill meta={meta} />
        {event.tag && (
          <span className="text-[11px] font-semibold text-[var(--e-text-subtle)]">
            {event.tag}
          </span>
        )}
        {event.needsTravel && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-[var(--e-primary-deep)]">
            <RouteIcon size={12} strokeWidth={2.4} aria-hidden />
            이동 반영
          </span>
        )}
      </div>
      <p className="mt-1 text-[15px] font-bold text-[var(--e-text)]">{event.title}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-[var(--e-text-subtle)]">
        {event.durationMin}분
      </p>
    </li>
  );
}

function agendaTitle(d: Date, today: Date): string {
  const label = `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdayLabel(d)})`;
  return isSameDay(d, today) ? `오늘 · ${label}` : label;
}

/* ------------------------------------------------------------------ */
/* 월 뷰                                                                */
/* ------------------------------------------------------------------ */

const WEEKDAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

function MonthView({
  today,
  monthCursor,
  onMonthChange,
  selected,
  events,
  onPickDay,
}: {
  today: Date;
  monthCursor: Date;
  onMonthChange: (d: Date) => void;
  selected: Date;
  events: CalendarEvent[];
  onPickDay: (d: Date) => void;
}) {
  const gridStart = useMemo(() => monthGridStart(monthCursor), [monthCursor]);
  const cells = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)), [gridStart]);

  const eventsByDay = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = m.get(e.dateKey) ?? [];
      arr.push(e);
      m.set(e.dateKey, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.time.localeCompare(b.time));
    return m;
  }, [events]);

  return (
    <section className="px-4">
      {/* 월 네비게이션 */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => onMonthChange(addDays(startOfMonth(monthCursor), -1))}
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--e-text-muted)] active:bg-[var(--e-surface-2)]"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <h2 className="text-[16px] font-extrabold text-[var(--e-text)]">
          {monthCursor.getFullYear()}년 {monthCursor.getMonth() + 1}월
        </h2>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => onMonthChange(addDays(monthCursor, 32 - monthCursor.getDate() + 1))}
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--e-text-muted)] active:bg-[var(--e-surface-2)]"
        >
          <ChevronRight size={20} strokeWidth={2.4} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mt-2 grid grid-cols-7">
        {WEEKDAY_HEADERS.map((w) => (
          <div key={w} className="py-1 text-center text-[11px] font-bold text-[var(--e-text-subtle)]">
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 — 칸 안에 일정 칩 직접 표시(참고 스크린샷 레이아웃 반영). */}
      <div className="grid grid-cols-7 gap-x-px gap-y-px border-t border-l border-[var(--e-border)]">
        {cells.map((d) => {
          const inMonth = d.getMonth() === monthCursor.getMonth();
          const isToday = isSameDay(d, today);
          const isSel = isSameDay(d, selected);
          const dayEvts = eventsByDay.get(dateKey(d)) ?? [];
          const shown = dayEvts.slice(0, 2);
          const hiddenCount = dayEvts.length - shown.length;

          return (
            <button
              key={dateKey(d)}
              type="button"
              onClick={() => onPickDay(d)}
              className="flex min-h-[68px] flex-col items-stretch gap-0.5 border-b border-r border-[var(--e-border)] p-1 text-left"
              style={{ background: isSel ? "var(--e-primary-weak)" : "var(--e-surface)" }}
            >
              <span
                className="eddie-num flex h-5 w-5 items-center justify-center self-start rounded-full text-[11px] font-bold"
                style={{
                  background: isSel ? "var(--e-primary)" : "transparent",
                  color: isSel
                    ? "var(--e-on-primary)"
                    : !inMonth
                      ? "var(--e-text-subtle)"
                      : "var(--e-text)",
                  boxShadow: isToday && !isSel ? "inset 0 0 0 1.5px var(--e-primary)" : "none",
                  opacity: inMonth ? 1 : 0.4,
                }}
              >
                {d.getDate()}
              </span>

              <span className="flex flex-col gap-0.5" style={{ opacity: inMonth ? 1 : 0.5 }}>
                {shown.map((e) => (
                  <span
                    key={e.id}
                    className="truncate rounded-[3px] px-1 py-px text-[9px] font-bold leading-tight"
                    style={{ background: STATUS[e.status].bg, color: STATUS[e.status].color }}
                  >
                    {e.title}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="text-[9px] font-bold text-[var(--e-text-subtle)]">
                    +{hiddenCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 일정 등록 모달 (FR-002 — 3탭 이내)                                    */
/* ------------------------------------------------------------------ */

function EventFormSheet({
  open,
  selected,
  existing,
  onClose,
  onSave,
}: {
  open: boolean;
  selected: Date;
  existing: CalendarEvent[];
  onClose: () => void;
  onSave: (draft: Omit<CalendarEvent, "id" | "dateKey" | "status">) => void;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(30);
  const [tag, setTag] = useState<string | undefined>(TAGS[0]);
  const [needsTravel, setNeedsTravel] = useState(false);

  const overlap = useMemo(() => {
    const start = toMinutes(time);
    const end = start + duration;
    return existing.find((e) => {
      const s = toMinutes(e.time);
      const en = s + e.durationMin;
      return start < en && end > s;
    });
  }, [time, duration, existing]);

  const reset = () => {
    setTitle("");
    setTime("09:00");
    setDuration(30);
    setTag(TAGS[0]);
    setNeedsTravel(false);
  };

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title="일정 추가"
    >
      <p className="text-[13px] font-semibold text-[var(--e-text-muted)]">
        {selected.getMonth() + 1}월 {selected.getDate()}일 ({weekdayLabel(selected)})
      </p>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="일정 제목"
        className="mt-3 w-full rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3 text-[15px] font-bold text-[var(--e-text)] outline-none placeholder:text-[var(--e-text-subtle)] focus:border-[var(--e-primary)]"
      />

      <div className="mt-3 flex items-center gap-3">
        <label className="text-[13px] font-bold text-[var(--e-text-muted)]" htmlFor="ev-time">
          시작
        </label>
        <input
          id="ev-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="eddie-num rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface)] px-2.5 py-2 text-[14px] font-bold text-[var(--e-text)]"
        />
      </div>

      <p className="mt-3 text-[12px] font-bold text-[var(--e-text-muted)]">소요 시간</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {DURATIONS.map((d) => (
          <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>
            {d}분
          </Chip>
        ))}
      </div>

      <p className="mt-3 text-[12px] font-bold text-[var(--e-text-muted)]">카테고리</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {TAGS.map((t) => (
          <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
            {t}
          </Chip>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setNeedsTravel((v) => !v)}
        className="mt-3 flex w-full items-center gap-2.5 rounded-[var(--e-r-md)] border border-[var(--e-border)] px-3.5 py-2.5 text-left"
      >
        <span
          className="grid h-5 w-5 shrink-0 place-items-center rounded border-2"
          style={{
            borderColor: needsTravel ? "var(--e-primary)" : "var(--e-border-strong)",
            background: needsTravel ? "var(--e-primary)" : "transparent",
          }}
        >
          {needsTravel && <RouteIcon size={12} strokeWidth={3} className="text-white" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold text-[var(--e-text)]">
            준비+이동시간 반영
          </span>
          <span className="block text-[11px] text-[var(--e-text-subtle)]">
            출발 카운트다운에서 역산해줘
          </span>
        </span>
      </button>

      {overlap && (
        <p className="mt-3 rounded-[var(--e-r-sm)] bg-[var(--e-planned-bg)] px-3 py-2 text-[12px] font-semibold text-[var(--e-text)]">
          이 시간에 "{overlap.title}"이 이미 있어. 그래도 겹쳐서 넣을까?
        </p>
      )}

      <button
        type="button"
        disabled={!title.trim()}
        onClick={() => {
          onSave({ time, durationMin: duration, title: title.trim(), tag, needsTravel });
          reset();
        }}
        className="mt-4 flex min-h-[var(--e-touch)] w-full items-center justify-center gap-2 rounded-[var(--e-r-md)] bg-[var(--e-primary)] px-4 font-bold text-[var(--e-on-primary)] shadow-[var(--e-shadow-fab)] disabled:opacity-40"
      >
        저장
      </button>
    </BottomSheet>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[34px] rounded-full px-3 text-[12px] font-bold"
      style={{
        background: active ? "var(--e-primary)" : "var(--e-surface-2)",
        color: active ? "var(--e-on-primary)" : "var(--e-text-muted)",
      }}
    >
      {children}
    </button>
  );
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
