import { Box, Typography, Avatar } from '@mui/material';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import type { StaffMember } from '../types';

interface StaffActivityProps {
  staff: StaffMember[];
}

const ROLE_ICON: Record<string, string> = {
  veterinarian: '👩‍⚕️',
  receptionist: '💁',
};

export function StaffActivityWidget({ staff }: StaffActivityProps) {
  if (staff.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#6b6375', py: 2, textAlign: 'center' }}>
        No staff data available.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {staff.map((member) => (
        <Box
          key={member.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: 16,
              background: member.isOnline
                ? 'linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)'
                : '#6b6375',
            }}
          >
            {ROLE_ICON[member.role] ?? '👤'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#08060d' }}>
                {member.name}
              </Typography>
              <FiberManualRecord
                sx={{
                  fontSize: 10,
                  color: member.isOnline ? '#2e7d32' : '#e5e4e7',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#6b6375' }}>
              {member.patientsAttended} patients attended today
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}