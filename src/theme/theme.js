import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8B7EC8", // Medium lavender
      light: "#B5A9D6", // Light lavender
      dark: "#6B5B95", // Dark lavender
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E6E6FA", // Very light lavender
      light: "#F0F0FF", // Almost white lavender
      dark: "#D1C4E9", // Slightly darker lavender
      contrastText: "#4A4A4A",
    },
    background: {
      default: "#FEFEFE",
      paper: "#FFFFFF",
    },
    success: {
      main: "#A8E6CF", // Soft green
      light: "#C8F2D8",
      dark: "#7FBF7F",
    },
    warning: {
      main: "#FFD3A5", // Soft orange
      light: "#FFE0B5",
      dark: "#FFB366",
    },
    error: {
      main: "#FFAAA5", // Soft red
      light: "#FFB8B5",
      dark: "#FF8A80",
    },
    info: {
      main: "#A5C9FF", // Soft blue
      light: "#B5D3FF",
      dark: "#85B7FF",
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
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#2D2D2D",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#2D2D2D",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#2D2D2D",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#2D2D2D",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#2D2D2D",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#2D2D2D",
    },
    body1: {
      fontSize: "1rem",
      color: "#2D2D2D",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#6B6B6B",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(139, 126, 200, 0.1)",
          borderRadius: 16,
          border: "1px solid rgba(139, 126, 200, 0.08)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(139, 126, 200, 0.15)",
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
            boxShadow: "0 4px 12px rgba(139, 126, 200, 0.2)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #8B7EC8 0%, #B5A9D6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #6B5B95 0%, #8B7EC8 100%)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#2D2D2D",
          boxShadow: "0 2px 12px rgba(139, 126, 200, 0.08)",
          borderBottom: "1px solid rgba(139, 126, 200, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FAFAFA",
          borderRight: "1px solid rgba(139, 126, 200, 0.12)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "& fieldset": {
              borderColor: "rgba(139, 126, 200, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(139, 126, 200, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B7EC8",
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
          backgroundColor: "rgba(139, 126, 200, 0.15)",
          color: "#6B5B95",
        },
      },
    },
  },
});

export default theme;
