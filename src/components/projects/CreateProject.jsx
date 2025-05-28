import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Divider,
  Alert,
  Fade,
  Collapse,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  ArrowBack,
  Save,
  CheckCircle,
  FolderOpen,
  Assignment,
  Group,
  AccessTime,
} from "@mui/icons-material";
import useProject from "../../hooks/useProject";

const steps = [
  {
    label: "Project Details",
    description: "Basic information about your project",
    icon: <FolderOpen />,
  },
  {
    label: "Task Categories",
    description: "Select relevant categories and tasks",
    icon: <Assignment />,
  },
  {
    label: "Team Assignment",
    description: "Assign team members to the project",
    icon: <Group />,
  },
  {
    label: "Timeline & Review",
    description: "Set deadlines and review your project",
    icon: <AccessTime />,
  },
];

const statusOptions = [
  { value: "planning", label: "Planning", color: "#A5C9FF" },
  { value: "in-progress", label: "In Progress", color: "#FFD3A5" },
  { value: "completed", label: "Completed", color: "#A8E6CF" },
  { value: "on-hold", label: "On Hold", color: "#FFAAA5" },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "#A8E6CF" },
  { value: "medium", label: "Medium", color: "#FFD3A5" },
  { value: "high", label: "High", color: "#FFAAA5" },
];

const CreateProject = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject, categories, employees } = useProject();
  const [selectedTasksPreview, setSelectedTasksPreview] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    dueDate: null,
    assignedTo: [],
    selectedCategories: [],
    selectedTasks: {},
  });

  useEffect(() => {
    const tasks = [];
    Object.entries(formData.selectedTasks).forEach(
      ([categoryId, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategoryName, taskList]) => {
          taskList.forEach((task) => {
            if (task.selected) {
              tasks.push({
                categoryName:
                  categories.find((c) => c.id === categoryId)?.name ||
                  "Unknown Category",
                subcategoryName,
                taskName: task.name,
              });
            }
          });
        });
      }
    );
    setSelectedTasksPreview(tasks);
  }, [formData.selectedTasks, categories]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    setFormData((prev) => {
      const isSelected = prev.selectedCategories.includes(categoryId);

      if (isSelected) {
        // Remove category and its tasks
        const newSelectedCategories = prev.selectedCategories.filter(
          (id) => id !== categoryId
        );
        const newSelectedTasks = { ...prev.selectedTasks };
        delete newSelectedTasks[categoryId];

        return {
          ...prev,
          selectedCategories: newSelectedCategories,
          selectedTasks: newSelectedTasks,
        };
      } else {
        // Add category with default tasks structure
        const newSelectedTasks = { ...prev.selectedTasks };
        newSelectedTasks[categoryId] = {};

        category.subcategories?.forEach((subcategory) => {
          newSelectedTasks[categoryId][subcategory.name] =
            subcategory.tasks.map((task) => ({
              name: task,
              selected: true, // Default to selected
            }));
        });

        return {
          ...prev,
          selectedCategories: [...prev.selectedCategories, categoryId],
          selectedTasks: newSelectedTasks,
        };
      }
    });
  };

  const handleTaskToggle = (categoryId, subcategoryName, taskIndex) => {
    setFormData((prev) => {
      const newSelectedTasks = { ...prev.selectedTasks };
      if (
        newSelectedTasks[categoryId] &&
        newSelectedTasks[categoryId][subcategoryName]
      ) {
        newSelectedTasks[categoryId][subcategoryName][taskIndex].selected =
          !newSelectedTasks[categoryId][subcategoryName][taskIndex].selected;
      }

      return {
        ...prev,
        selectedTasks: newSelectedTasks,
      };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.name.trim()) newErrors.name = "Project name is required";
        if (!formData.description.trim())
          newErrors.description = "Project description is required";
        break;
      case 1:
        if (formData.selectedCategories.length === 0) {
          newErrors.categories = "Please select at least one category";
        }
        break;
      case 2:
        // Team assignment is optional
        break;
      case 3:
        // Timeline is optional but can validate date logic
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);
    try {
      const projectData = {
        ...formData,
        tasks: selectedTasksPreview.map((task) => ({
          name: task.taskName,
          category: task.categoryName,
          subcategory: task.subcategoryName,
          status: "pending",
          priority: "medium",
        })),
      };

      const projectId = await createProject(projectData);
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ space: 3 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Project Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 3 }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: option.color,
                            }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: option.color,
                            }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            {errors.categories && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.categories}
              </Alert>
            )}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Select the categories that apply to your project. Default tasks
              will be included for each category.
            </Typography>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} key={category.id}>
                  <Card
                    sx={{
                      border: formData.selectedCategories.includes(category.id)
                        ? `2px solid ${category.color}`
                        : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(139, 126, 200, 0.15)",
                      },
                    }}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Checkbox
                          checked={formData.selectedCategories.includes(
                            category.id
                          )}
                          sx={{ color: category.color }}
                        />
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: category.color,
                          }}
                        />
                        <Typography variant="h6" fontWeight={600}>
                          {category.name}
                        </Typography>
                      </Box>
                      <Collapse
                        in={formData.selectedCategories.includes(category.id)}
                      >
                        <Box sx={{ ml: 4 }}>
                          {category.subcategories?.map((subcategory) => (
                            <Box key={subcategory.name} sx={{ mb: 2 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                gutterBottom
                              >
                                {subcategory.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {subcategory.tasks.map((task, taskIndex) => {
                                  const isSelected =
                                    formData.selectedTasks[category.id]?.[
                                      subcategory.name
                                    ]?.[taskIndex]?.selected;
                                  return (
                                    <Chip
                                      key={taskIndex}
                                      label={task}
                                      size="small"
                                      variant={
                                        isSelected ? "filled" : "outlined"
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskToggle(
                                          category.id,
                                          subcategory.name,
                                          taskIndex
                                        );
                                      }}
                                      sx={{
                                        backgroundColor: isSelected
                                          ? `${category.color}20`
                                          : "transparent",
                                        borderColor: category.color,
                                        color: isSelected
                                          ? category.color
                                          : "text.secondary",
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Select team members to assign to this project (optional).
            </Typography>

            <Autocomplete
              multiple
              options={employees}
              getOptionLabel={(option) => option.name || option.email}
              value={formData.assignedTo}
              onChange={(event, newValue) =>
                handleInputChange("assignedTo", newValue)
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name || option.email}
                    {...getTagProps({ index })}
                    key={option.id}
                    sx={{ borderColor: "#8B7EC8", color: "#8B7EC8" }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Team Members"
                  placeholder="Search and select team members"
                />
              )}
              sx={{ mb: 3 }}
            />
            {employees.length === 0 && (
              <Alert severity="info">
                No team members found. You can add team members later from the
                employees section.
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <DatePicker
              label="Due Date (Optional)"
              value={formData.dueDate}
              onChange={(newValue) => handleInputChange("dueDate", newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 3 }} />
              )}
            />
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Project Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, backgroundColor: "rgba(139, 126, 200, 0.05)" }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Project Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {formData.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{" "}
                    {
                      statusOptions.find((s) => s.value === formData.status)
                        ?.label
                    }
                  </Typography>
                  <Typography variant="body2">
                    <strong>Priority:</strong>{" "}
                    {
                      priorityOptions.find((p) => p.value === formData.priority)
                        ?.label
                    }
                  </Typography>
                  {formData.dueDate && (
                    <Typography variant="body2">
                      <strong>Due Date:</strong>{" "}
                      {formData.dueDate.toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, backgroundColor: "rgba(139, 126, 200, 0.05)" }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Team & Tasks
                  </Typography>
                  <Typography variant="body2">
                    <strong>Team Members:</strong> {formData.assignedTo.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Categories:</strong>{" "}
                    {formData.selectedCategories.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Tasks:</strong> {selectedTasksPreview.length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            {selectedTasksPreview.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Selected Tasks ({selectedTasksPreview.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  {selectedTasksPreview.map((task, index) => (
                    <Chip
                      key={index}
                      label={`${task.categoryName}: ${task.taskName}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: "#8B7EC8", color: "#8B7EC8" }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/projects")}
            sx={{ color: "text.secondary" }}
          >
            Back to Projects
          </Button>
          <Box sx={{ borderLeft: "2px solid #E0E0E0", height: 24, mx: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #8B7EC8, #6B5B95)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create New Project
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{ p: 3, height: "fit-content", position: "sticky", top: 20 }}
            >
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              index <= activeStep
                                ? "#8B7EC8"
                                : "rgba(139, 126, 200, 0.2)",
                            color:
                              index <= activeStep ? "white" : "text.secondary",
                            transition: "all 0.3s ease-in-out",
                          }}
                        >
                          {index < activeStep ? <CheckCircle /> : step.icon}
                        </Box>
                      )}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {step.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {steps[activeStep].label}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {steps[activeStep].description}
                </Typography>
              </Box>
              {renderStepContent(activeStep)}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #E0E0E0",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                >
                  Back
                </Button>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      startIcon={<Save />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {isSubmitting ? "Creating Project..." : "Create Project"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default CreateProject;
