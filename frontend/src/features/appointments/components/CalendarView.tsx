import { useState, useMemo } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Appointment } from '../types';

/* ------------------------------------------------------------------ */
/*  CalendarView — Basic month grid calendar                          */
/* ------------------------------------------------------------------ */

interface CalendarViewProps {
  appointments: Appointment[];
  currentMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  onDateSelect: (date: string) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  // Fill leading nulls
  for (let i = 0; i < firstDay; i++) days.push(null);

  // Fill days
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  // Pad to complete the last week
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function CalendarView({ appointments, currentMonth, onMonthChange, onDateSelect }: CalendarViewProps) {
  const [year, month] = currentMonth.split('-').map(Number);

  const days = useMemo(() => getMonthDays(year, month - 1), [year, month]);

  // Build a map of date → appointment count
  const appointmentCountMap = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach((a) => {
      map.set(a.date, (map.get(a.date) ?? 0) + 1);
    });
    return map;
  }, [appointments]);

  const handlePrevMonth = () => {
    const d = new Date(year, month - 2, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const d = new Date(year, month, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e5e4e7' }}>
        <IconButton size="small" onClick={handlePrevMonth} sx={{ color: '#6b6375' }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#08060d' }}>
          {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth} sx={{ color: '#6b6375' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Day names */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e5e4e7' }}>
        {DAY_NAMES.map((name) => (
          <Box key={name} sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 600, fontSize: '11px' }}>
              {name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Day cells */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days.map((day, i) => {
          if (day === null) {
            return <Box key={`empty-${i}`} sx={{ minHeight: 80 }} />;
          }

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = appointmentCountMap.get(dateStr) ?? 0;
          const isToday = dateStr === todayStr;

          return (
            <Box
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              sx={{
                minHeight: 80,
                p: 0.75,
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid #e5e4e7',
                borderBottom: '1px solid #e5e4e7',
                cursor: 'pointer',
                backgroundColor: isToday ? '#f0e6ff' : 'transparent',
                '&:hover': { backgroundColor: isToday ? '#e8d9ff' : '#f9f9f9' },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#aa3bff' : '#08060d',
                  fontSize: '13px',
                  mb: 0.5,
                }}
              >
                {day}
              </Typography>
              {count > 0 && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '8px',
                    backgroundColor: '#aa3bff',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {count}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}