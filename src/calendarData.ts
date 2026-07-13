import type { BlockStatus } from "./data";

/** YYYY-MM-DD 키 생성(로컬 타임존 기준, UTC 변환 오차 방지). */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface CalendarEvent {
  id: string;
  dateKey: string; // dateKey()
  time: string; // "HH:MM"
  durationMin: number;
  title: string;
  status: BlockStatus;
  tag?: string;
  /** 준비+이동시간을 출발 카운트다운에 반영할지(FR-105 개념) */
  needsTravel?: boolean;
}

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function weekdayLabel(d: Date): string {
  return WEEKDAY_LABEL[d.getDay()];
}

/** d가 속한 주의 일요일(주 시작)을 반환. */
export function startOfWeek(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** 달력 그리드(6주×7일)에 필요한 시작일(해당 월 1일이 속한 주의 일요일). */
export function monthGridStart(d: Date): Date {
  return startOfWeek(startOfMonth(d));
}

/**
 * 데모용 이번 주 일정 생성 — 오늘을 기준으로 앞뒤 며칠에 그럴듯한 하루를 채운다.
 * 실제 앱에서는 로컬 캐시 + 외부 캘린더 동기화 데이터로 대체될 자리.
 */
export function buildDemoEvents(today: Date): CalendarEvent[] {
  const at = (dayOffset: number) => dateKey(addDays(today, dayOffset));

  return [
    // 어제 — 지나간 하루(완료 위주)
    { id: "e1", dateKey: at(-1), time: "09:00", durationMin: 30, title: "팀 스탠드업 회의", status: "done", tag: "업무" },
    { id: "e2", dateKey: at(-1), time: "19:00", durationMin: 40, title: "저녁 운동", status: "done", tag: "루틴" },

    // 오늘 — Today 탭과 결이 비슷한 하루
    { id: "e3", dateKey: at(0), time: "09:00", durationMin: 30, title: "팀 스탠드업 회의", status: "planned", tag: "업무", needsTravel: true },
    { id: "e4", dateKey: at(0), time: "11:00", durationMin: 45, title: "보고서 초안 쓰기", status: "planned", tag: "업무" },
    { id: "e5", dateKey: at(0), time: "14:00", durationMin: 60, title: "병원 예약", status: "planned", tag: "개인", needsTravel: true },

    // 내일
    { id: "e6", dateKey: at(1), time: "10:30", durationMin: 60, title: "치과 정기검진", status: "planned", tag: "개인", needsTravel: true },
    { id: "e7", dateKey: at(1), time: "20:00", durationMin: 30, title: "엄마와 통화", status: "planned", tag: "가족" },

    // 모레 — 겹치는 시간(충돌 감지용)
    { id: "e8", dateKey: at(2), time: "13:00", durationMin: 60, title: "프로젝트 리뷰", status: "planned", tag: "업무" },
    { id: "e9", dateKey: at(2), time: "13:30", durationMin: 30, title: "동료 1:1", status: "planned", tag: "업무" },

    // 글피 — 여유로운 날(빈 상태 데모용으로 비워둠)

    // 이번 주 초 — 놓친 일정도 하나
    { id: "e10", dateKey: at(-3), time: "08:00", durationMin: 20, title: "아침 스트레칭", status: "missed", tag: "루틴" },
    { id: "e11", dateKey: at(3), time: "18:30", durationMin: 45, title: "장보기", status: "planned", tag: "집안" },
  ];
}
