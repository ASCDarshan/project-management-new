import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6B5B95",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D1C4E9",
      contrastText: "#4A4A4A",
    },
    background: {
      default: "#FEFEFE",
      paper: "#FFFFFF",
    },
    success: {
      main: "#7FBF7F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFB366",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#FF8A80",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#85B7FF",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#2D2D2D",
      secondary: "#6B6B6B",
      disabled: "#AAAAAA",
    },
    divider: "#E8E8E8",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 600, color: "#2D2D2D" },
    h2: { fontSize: "2rem", fontWeight: 600, color: "#2D2D2D" },
    h3: { fontSize: "1.75rem", fontWeight: 600, color: "#2D2D2D" },
    h4: { fontSize: "1.5rem", fontWeight: 500, color: "#2D2D2D" },
    h5: { fontSize: "1.25rem", fontWeight: 500, color: "#2D2D2D" },
    h6: { fontSize: "1rem", fontWeight: 500, color: "#2D2D2D" },
    body1: { fontSize: "1rem", color: "#2D2D2D" },
    body2: { fontSize: "0.875rem", color: "#6B6B6B" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(107, 91, 149, 0.1)",
          borderRadius: 16,
          border: "1px solid rgba(107, 91, 149, 0.08)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(107, 91, 149, 0.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(107, 91, 149, 0.2)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #6B5B95 0%, #8E80B1 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #534575 0%, #6B5B95 100%)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#2D2D2D",
          boxShadow: "0 2px 12px rgba(107, 91, 149, 0.08)",
          borderBottom: "1px solid rgba(107, 91, 149, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FAFAFA",
          borderRight: "1px solid rgba(107, 91, 149, 0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "& fieldset": {
              borderColor: "rgba(107, 91, 149, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(107, 91, 149, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6B5B95",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: "rgba(107, 91, 149, 0.15)",
          color: "#6B5B95",
        },
      },
    },
  },
});

export default theme;
