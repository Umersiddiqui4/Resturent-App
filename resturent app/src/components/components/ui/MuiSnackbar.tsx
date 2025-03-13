import { Snackbar, Alert } from "@mui/material"

interface SnackbarProps {
  open: boolean
  message: string
  severity?: "success" | "error" | "warning" | "info"
  onClose: () => void
}

export default function MuiSnackbar({ open, message, severity = "info", onClose }: SnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // 3 sec baad khud hide ho jayega
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}
