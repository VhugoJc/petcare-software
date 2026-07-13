import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  Typography,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/ui/EmptyState';
import type { Owner } from '../types';

/* ------------------------------------------------------------------ */
/*  OwnersTable                                                        */
/* ------------------------------------------------------------------ */

interface OwnersTableProps {
  owners: Owner[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (owner: Owner) => void;
  onViewDetails: (owner: Owner) => void;
  onToggleActive: (owner: Owner) => void;
}

export function OwnersTable({
  owners,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onViewDetails,
  onToggleActive,
}: OwnersTableProps) {
  if (owners.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No owners found"
        description="Try adjusting your search or filters, or create a new owner."
      />
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#08060d' }}>
                    {owner.firstName} {owner.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6b6375' }}>
                    {owner.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6b6375' }}>
                    {owner.phoneNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6b6375' }}>
                    {owner.city || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={owner.isActive ? 'Active' : 'Inactive'}
                    variant={owner.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onViewDetails(owner)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(owner)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={owner.isActive ? 'Deactivate' : 'Activate'}>
                      <Switch
                        size="small"
                        checked={owner.isActive}
                        onChange={() => onToggleActive(owner)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#2e7d32',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#2e7d32',
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page - 1} // MUI is 0-based
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Rows:"
        sx={{
          borderTop: '1px solid #e5e4e7',
          '& .MuiTablePagination-toolbar': { minHeight: 52 },
        }}
      />
    </Paper>
  );
}