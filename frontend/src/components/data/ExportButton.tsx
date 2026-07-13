import { Tooltip, IconButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

/* ------------------------------------------------------------------ */
/*  ExportButton — Placeholder for future export functionality        */
/* ------------------------------------------------------------------ */

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ExportButton({ onClick, disabled = false, label = 'Export' }: ExportButtonProps) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{ color: '#6b6375' }}
          size="small"
        >
          <FileDownloadIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}