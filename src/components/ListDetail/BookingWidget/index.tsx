"use client";

import { useEffect, useState } from "react";
import Icon from "../../Icon";
import Button from "../../Button";
import "./BookingWidget.scss";

interface BookingWidgetProps {
  sessions: string[];
  bookingStatus: string;
  bookingFee: string;
  priceRange: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DayCell {
  day: number;
  weekday: number;
  isToday: boolean;
  selectable: boolean;
}

function buildCalendar(now: Date): { leading: number; cells: DayCell[] } {
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const leading = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(year, month, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    cells.push({
      day,
      weekday,
      isToday: day === todayDate,
      selectable: day >= todayDate && isWeekend,
    });
  }
  return { leading, cells };
}

export default function BookingWidget({
  sessions,
  bookingStatus,
  bookingFee,
  priceRange,
}: BookingWidgetProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(
    sessions[0] ?? null,
  );
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const calendar = now ? buildCalendar(now) : null;

  return (
    <aside className="booking-widget">
      <div className="booking-widget__header">
        <h3 className="booking-widget__title">Booking Info</h3>
        <span className="booking-widget__status">{bookingStatus}</span>
      </div>

      <div className="booking-widget__field">
        <span className="booking-widget__label">Select Date</span>
        <div className="booking-widget__calendar" role="grid">
          <div className="booking-widget__weekdays" role="row">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="booking-widget__weekday" role="columnheader">
                {weekday}
              </span>
            ))}
          </div>
          <div className="booking-widget__days">
            {calendar
              ? [
                  ...Array.from({ length: calendar.leading }, (_, index) => (
                    <span key={`pad-${index}`} className="booking-widget__day-pad" aria-hidden="true" />
                  )),
                  ...calendar.cells.map((cell) => {
                    const isSelected = cell.day === selectedDay;
                    const classNames = [
                      "booking-widget__day",
                      cell.isToday ? "booking-widget__day--today" : "",
                      cell.selectable ? "booking-widget__day--open" : "",
                      isSelected ? "booking-widget__day--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <button
                        key={cell.day}
                        type="button"
                        className={classNames}
                        disabled={!cell.selectable}
                        aria-pressed={isSelected}
                        aria-label={`${cell.day}일${cell.selectable ? " 예매 가능" : ""}`}
                        onClick={() => setSelectedDay(cell.day)}
                      >
                        {cell.day}
                      </button>
                    );
                  }),
                ]
              : null}
          </div>
        </div>
      </div>

      <div className="booking-widget__field">
        <span className="booking-widget__label">Session</span>
        <div className="booking-widget__sessions">
          {sessions.map((session) => {
            const isSelected = session === selectedSession;
            return (
              <button
                key={session}
                type="button"
                className={`booking-widget__session${isSelected ? " booking-widget__session--selected" : ""}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedSession(session)}
              >
                {session}
              </button>
            );
          })}
        </div>
      </div>

      <div className="booking-widget__summary">
        <div className="booking-widget__summary-row">
          <span className="booking-widget__summary-label">Selected Seat</span>
          <span className="booking-widget__summary-value">A Section, Row 12</span>
        </div>
        <div className="booking-widget__summary-row">
          <span className="booking-widget__summary-label">Price</span>
          <span className="booking-widget__summary-price">{priceRange}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        className="booking-widget__book"
        onClick={() => setShowNotice(true)}
      >
        Book Now
        <Icon name="arrow_forward_ios" className="booking-widget__book-icon" />
      </Button>

      {showNotice ? (
        <p className="booking-widget__notice" role="status">
          예매 기능은 준비 중입니다.
        </p>
      ) : null}

      <p className="booking-widget__fee">{bookingFee}</p>
    </aside>
  );
}
