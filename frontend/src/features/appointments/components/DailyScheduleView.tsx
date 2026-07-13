import { useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import type { Appointment } from '../types';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  formatTimeDisplay,
  getTodayISO,
} from '../utils/appointmentHelpers';
import { getSpeciesIcon } from '../../pets/utils/petHelpers';

/* ================================================================== */
/*  DailyScheduleView — Redesigned timeline with overlap resolution    */
/* ================================================================== */

interface DailyScheduleViewProps {
  appointments: Appointment[];
  date: string;
  onAppointmentClick?: (appointment: Appointment) => void;
  onDateChange?: (date: string) => void;
}

/* ── Constants ── */

const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 72;
const TIME_COLUMN_WIDTH = 72;

/* ── Pure helpers ── */

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToOffset(minutes: number): number {
  return (minutes - START_HOUR * 60) * (HOUR_HEIGHT / 60);
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function isPastAppointment(appt: Appointment, viewingDate: string): boolean {
  const today = getTodayISO();
  if (viewingDate < today) return true;
  if (viewingDate > today) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return timeToMinutes(appt.endTime) < currentMinutes;
}

function isActiveAppointment(appt: Appointment, viewingDate: string): boolean {
  if (viewingDate !== getTodayISO()) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(appt.startTime);
  const end = timeToMinutes(appt.endTime);
  return currentMinutes >= start && currentMinutes < end;
}

/* ── Overlap resolution ── */

interface PlacedApp {
  appt: Appointment;
  column: number;
  totalColumns: number;
}

function resolveOverlaps(items: Appointment[]): PlacedApp[] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const result: PlacedApp[] = [];
  const active: { end: number; col: number }[] = [];

  for (const appt of sorted) {
    const start = timeToMinutes(appt.startTime);
    const end = timeToMinutes(appt.endTime);

    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= start) active.splice(i, 1);
    }

    const used = new Set(active.map((a) => a.col));
    let col = 0;
    while (used.has(col)) col++;
    active.push({ end, col });

    const total = Math.max(...active.map((a) => a.col), col) + 1;
    result.push({ appt, column: col, totalColumns: total });
  }

  return result;
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function DailyScheduleView({
  appointments,
  date,
  onAppointmentClick,
  onDateChange,
}: DailyScheduleViewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = getTodayISO();
  const isToday = date === today;

  /* ── Day navigation ── */

  const shiftDay = useCallback(
    (delta: number) => {
      if (!onDateChange) return;
      const d = new Date(date + 'T12:00:00');
      d.setDate(d.getDate() + delta);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      onDateChange(`${y}-${m}-${day}`);
    },
    [date, onDateChange],
  );

  /* ── Auto-scroll to current time ── */

  useEffect(() => {
    if (isToday && scrollRef.current) {
      const now = new Date();
      const offset = minutesToOffset(now.getHours() * 60 + now.getMinutes()) - HOUR_HEIGHT * 1.5;
      if (offset > 0) scrollRef.current.scrollTop = offset;
    }
  }, [isToday]);

  /* ── Resolve overlaps ── */

  const placed = useMemo(() => resolveOverlaps(appointments), [appointments]);

  const headerDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  /* ════════════════════════════════════════════════════════════════ */
  /*  Empty state                                                     */
  /* ════════════════════════════════════════════════════════════════ */

  if (appointments.length === 0) {
    return (
      <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <DayHeader
          headerDate={headerDate}
          date={date}
          today={today}
          count={0}
          onPrev={() => shiftDay(-1)}
          onNext={() => shiftDay(1)}
          onToday={() => onDateChange?.(today)}
          isToday={isToday}
          onDateChange={onDateChange}
        />
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#08060d', fontWeight: 600, mb: 0.5 }}>
            No appointments scheduled
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b6375' }}>
            {isToday
              ? 'Nothing on today\'s schedule. Enjoy a quiet day!'
              : `No appointments for ${headerDate}.`}
          </Typography>
        </Box>
      </Paper>
    );
  }

  /* ════════════════════════════════════════════════════════════════ */
  /*  Render                                                          */
  /* ════════════════════════════════════════════════════════════════ */

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <DayHeader
        headerDate={headerDate}
        date={date}
        today={today}
        count={appointments.length}
        onPrev={() => shiftDay(-1)}
        onNext={() => shiftDay(1)}
        onToday={() => onDateChange?.(today)}
        isToday={isToday}
        onDateChange={onDateChange}
      />

      {/* ── Mobile: card list ── */}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
          {appointments.map((appt) => (
            <MobileCard key={appt.id} appt={appt} date={date} onClick={onAppointmentClick} />
          ))}
        </Box>
      ) : (
        /* ── Desktop: scrollable timeline ── */
        <Box
          ref={scrollRef}
          sx={{
            position: 'relative',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 280px)',
            minHeight: 400,
          }}
        >
          <Box sx={{ position: 'relative', height: (END_HOUR - START_HOUR) * HOUR_HEIGHT, ml: `${TIME_COLUMN_WIDTH}px` }}>
            {/* Grid lines */}
            {Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }).map((_, i) => {
              const isHour = i % 2 === 0;
              const hourIdx = Math.floor(i / 2);
              return (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: hourIdx * HOUR_HEIGHT + (isHour ? 0 : HOUR_HEIGHT / 2),
                    left: 0,
                    right: 0,
                    borderTop: isHour ? '1px solid #e5e4e7' : '1px dashed #eef0f2',
                    pointerEvents: 'none',
                  }}
                />
              );
            })}

            {/* Time labels */}
            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
              const hour = START_HOUR + i;
              return (
                <Typography
                  key={hour}
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: i * HOUR_HEIGHT - 7,
                    left: -TIME_COLUMN_WIDTH + 4,
                    width: TIME_COLUMN_WIDTH - 8,
                    textAlign: 'right',
                    color: '#6b6375',
                    fontSize: '11px',
                    fontWeight: 500,
                    pointerEvents: 'none',
                  }}
                >
                  {formatHourLabel(hour)}
                </Typography>
              );
            })}

            {/* Current-time indicator */}
            {isToday && <NowIndicator />}

            {/* Appointment cards */}
            {placed.map(({ appt, column, totalColumns }) => {
              const top = minutesToOffset(timeToMinutes(appt.startTime));
              const height = Math.max(minutesToOffset(timeToMinutes(appt.endTime)) - top, 28);
              const gap = 8;
              const cardGaps = (totalColumns - 1) * gap;
              const sideGaps = 8;
              const widthPct = `calc((100% - ${cardGaps + sideGaps}px) / ${totalColumns})`;
              const leftPct = `calc(${(column / totalColumns) * 100}% + ${column * gap + sideGaps}px)`;
              const past = isPastAppointment(appt, date);
              const active = isActiveAppointment(appt, date);

              return (
                <Box
                  key={appt.id}
                  onClick={() => onAppointmentClick?.(appt)}
                  sx={{
                    position: 'absolute',
                    top,
                    left: leftPct,
                    width: widthPct,
                    height,
                    backgroundColor: `${STATUS_COLORS[appt.status]}14`,
                    borderLeft: `4px solid ${STATUS_COLORS[appt.status]}`,
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.75,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 0.25,
                    opacity: past && !active ? 0.55 : 1,
                    transition: 'opacity 0.2s, box-shadow 0.2s, transform 0.15s',
                    overflow: 'hidden',
                    zIndex: active ? 5 : 1,
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)',
                      opacity: 1,
                    },
                  }}
                >
                  {/* Row 1: icon + name + time */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontSize: height > 40 ? '16px' : '13px', flexShrink: 0 }}>
                      {getSpeciesIcon(appt.petSpecies)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#08060d',
                        fontSize: height > 40 ? '14px' : '12px',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textDecoration: appt.status === 'cancelled' || appt.status === 'no-show' ? 'line-through' : 'none',
                      }}
                    >
                      {appt.petName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#6b6375', fontSize: '10px', ml: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {formatTimeDisplay(appt.startTime)}
                    </Typography>
                  </Box>

                  {/* Row 2: owner + status dot (if tall enough) */}
                  {height > 40 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6b6375',
                          fontSize: '11px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {appt.ownerName} · {appt.reason}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: STATUS_COLORS[appt.status], flexShrink: 0 }} />
                        <Typography
                          variant="caption"
                          sx={{ color: STATUS_COLORS[appt.status], fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          {STATUS_LABELS[appt.status]}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Paper>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Sub-components                                                     */
/* ═══════════════════════════════════════════════════════════════════ */

/* ── DayHeader ── */

function DayHeader({
  headerDate,
  date,
  today,
  count,
  onPrev,
  onNext,
  onToday,
  isToday,
  onDateChange,
}: {
  headerDate: string;
  date: string;
  today: string;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isToday: boolean;
  onDateChange?: (date: string) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.5,
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e5e4e7',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" onClick={onPrev} sx={{ color: '#6b6375' }}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: '#08060d', fontSize: '16px', minWidth: 180, textAlign: 'center' }}
        >
          {headerDate}
        </Typography>

        <IconButton size="small" onClick={onNext} sx={{ color: '#6b6375' }}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {!isToday && onDateChange && (
          <Box
            onClick={onToday}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              border: '1px solid #e5e4e7',
              cursor: 'pointer',
              typography: 'body2',
              fontSize: '12px',
              fontWeight: 500,
              color: '#6b6375',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <TodayIcon sx={{ fontSize: 14 }} />
            Today
          </Box>
        )}

        <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500 }}>
          {count} appointment{count !== 1 ? 's' : ''}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Current-time indicator ── */

function NowIndicator() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const top = minutesToOffset(currentMinutes);

  if (top < 0 || top > (END_HOUR - START_HOUR) * HOUR_HEIGHT) return null;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: top - 5,
          left: -TIME_COLUMN_WIDTH - 4,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#d32f2f',
          border: '2px solid #ffffff',
          boxShadow: '0 0 0 2px #d32f2f',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: top - 8,
          left: -TIME_COLUMN_WIDTH + 4,
          width: TIME_COLUMN_WIDTH - 14,
          textAlign: 'right',
          color: '#d32f2f',
          fontSize: '11px',
          fontWeight: 700,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {formatTimeDisplay(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          top,
          left: 0,
          right: 0,
          borderTop: '2px solid #d32f2f',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

/* ── Mobile card ── */

function MobileCard({
  appt,
  date,
  onClick,
}: {
  appt: Appointment;
  date: string;
  onClick?: (appt: Appointment) => void;
}) {
  const past = isPastAppointment(appt, date);
  const active = isActiveAppointment(appt, date);

  return (
    <Box
      onClick={() => onClick?.(appt)}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: `1px solid ${active ? STATUS_COLORS[appt.status] : '#e5e4e7'}`,
        borderLeft: `4px solid ${STATUS_COLORS[appt.status]}`,
        cursor: 'pointer',
        opacity: past && !active ? 0.6 : 1,
        transition: 'opacity 0.2s, box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Typography variant="body1" sx={{ fontSize: 24, flexShrink: 0, mt: 0.25 }}>
          {getSpeciesIcon(appt.petSpecies)}
        </Typography>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#08060d',
                fontSize: '15px',
                textDecoration: appt.status === 'cancelled' || appt.status === 'no-show' ? 'line-through' : 'none',
              }}
            >
              {appt.petName}
            </Typography>
            <Box
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: `${STATUS_COLORS[appt.status]}18`,
                fontSize: '10px',
                fontWeight: 600,
                color: STATUS_COLORS[appt.status],
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {STATUS_LABELS[appt.status]}
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: '#6b6375', fontSize: '12px', display: 'block', mb: 0.25 }}>
            {appt.ownerName} · {formatTimeDisplay(appt.startTime)} – {formatTimeDisplay(appt.endTime)}
          </Typography>

          <Typography variant="caption" sx={{ color: '#6b6375', fontSize: '11px', display: 'block' }}>
            {appt.reason}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}