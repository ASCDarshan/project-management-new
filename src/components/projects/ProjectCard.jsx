import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Tooltip,
  Button,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AccessTime,
  Assignment,
  Group,
} from "@mui/icons-material";
import useProject from "../../hooks/useProject";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { deleteProject } = useProject();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(project.id);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
    handleMenuClose();
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/projects/${project.id}/edit`);
    handleMenuClose();
  };

  const handleView = () => {
    navigate(`/projects/${project.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "#A5C9FF";
      case "in-progress":
        return "#FFD3A5";
      case "completed":
        return "#A8E6CF";
      case "on-hold":
        return "#FFAAA5";
      default:
        return "#E6E6FA";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "planning":
        return "Planning";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "on-hold":
        return "On Hold";
      default:
        return "Unknown";
    }
  };

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed"
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const progress = calculateProgress();
  const isOverdue =
    project.dueDate &&
    new Date(
      project.dueDate.toDate ? project.dueDate.toDate() : project.dueDate
    ) < new Date();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 32px rgba(139, 126, 200, 0.2)",
        },
      }}
      onClick={handleView}
    >
      <Box
        sx={{
          position: "absolute",
          top: -8,
          right: 16,
          zIndex: 1,
        }}
      >
        <Chip
          label={getStatusLabel(project.status)}
          size="small"
          sx={{
            backgroundColor: getStatusColor(project.status),
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              opacity: 0.7,
              "&:hover": { opacity: 1 },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {project.description || "No description provided"}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Assignment fontSize="small" />
              Progress
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(139, 126, 200, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #A8E6CF, #7FBF7F)"
                    : "linear-gradient(90deg, #8B7EC8, #B5A9D6)",
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Assignment fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {project.tasks?.length || 0} tasks
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Group fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {project.assignedTo?.length || 0} members
            </Typography>
          </Box>
        </Box>
        {project.dueDate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: isOverdue
                ? "rgba(255, 170, 165, 0.1)"
                : "rgba(139, 126, 200, 0.1)",
              border: `1px solid ${
                isOverdue
                  ? "rgba(255, 170, 165, 0.3)"
                  : "rgba(139, 126, 200, 0.2)"
              }`,
              mb: 2,
            }}
          >
            <AccessTime
              fontSize="small"
              sx={{ color: isOverdue ? "#FFAAA5" : "#8B7EC8" }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isOverdue ? "#FFAAA5" : "#8B7EC8",
                fontWeight: 500,
              }}
            >
              Due {formatDate(project.dueDate)}
              {isOverdue && " (Overdue)"}
            </Typography>
          </Box>
        )}
        {project.assignedTo && project.assignedTo.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Team
            </Typography>
            <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
              {project.assignedTo.map((member, index) => (
                <Tooltip
                  key={index}
                  title={member.name || member.email || "Team Member"}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      fontSize: "0.875rem",
                      border: "2px solid white",
                    }}
                    src={member.photoURL}
                  >
                    {(member.name || member.email || "TM")
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Visibility />}
          onClick={handleView}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "rgba(139, 126, 200, 0.3)",
            color: "#8B7EC8",
            "&:hover": {
              borderColor: "#8B7EC8",
              backgroundColor: "rgba(139, 126, 200, 0.1)",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 150 },
        }}
      >
        <MenuItem onClick={handleView}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
