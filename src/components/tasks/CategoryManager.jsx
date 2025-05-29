import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Menu,
  MenuItem,
  Fade,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Category,
  MoreVert,
} from "@mui/icons-material";
import useProject from "../../hooks/useProject";
import ConfirmationDialog from "../ui/ConfirmationDialog";

const colorOptions = [
  "#2196F3",
  "#4CAF50",
  "#FFC107",
  "#F44336",
  "#9C27B0",
  "#00BCD4",
  "#FFEB3B",
  "#795548",
  "#9E9E9E",
  "#E0E0E0",
];

const CategoryManager = () => {
  const theme = useTheme();
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    createTaskTemplate,
    deleteTaskTemplate,
    loading: projectLoading,
  } = useProject();

  const [dialogType, setDialogType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    color: "#8B7EC8",
    description: "",
  });

  const [taskForm, setTaskForm] = useState({
    name: "",
    categoryId: "",
    subcategoryName: "",
  });

  const handleOpenDialog = (type, category = null, subcategory = null) => {
    setDialogType(type);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);

    if (type === "category") {
      setFormData({
        name: category?.name || "",
        color: category?.color || "#8B7EC8",
        description: category?.description || "",
      });
    } else if (type === "subcategory") {
      setFormData({
        name: subcategory?.name || "",
        color: category?.color || "#8B7EC8",
        description: "",
      });
    } else if (type === "task") {
      setTaskForm({
        name: "",
        categoryId: category?.id || "",
        subcategoryName: subcategory?.name || "",
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setFormData({ name: "", color: "#8B7EC8", description: "" });
    setTaskForm({ name: "", categoryId: "", subcategoryName: "" });
  };

  const handleSaveCategory = async () => {
    try {
      setActionLoading(true);
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSubcategory = async () => {
    try {
      setActionLoading(true);
      if (selectedSubcategory) {
        await updateSubcategory(
          selectedCategory.id,
          selectedSubcategory.name,
          formData.name
        );
      } else {
        await createSubcategory(selectedCategory.id, formData.name);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveTask = async () => {
    try {
      setActionLoading(true);
      await createTaskTemplate(
        taskForm.categoryId,
        taskForm.subcategoryName,
        taskForm.name
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMenuOpen = (event, category) => {
    event.stopPropagation();
    setSelectedCategory(category);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async () => {
    try {
      setActionLoading(true);
      await deleteCategory(selectedCategory.id);
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleDeleteSubcategory = async (category, subcategory) => {
    try {
      setActionLoading(true);
      await deleteSubcategory(category.id, subcategory.name);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleDeleteTask = async (category, subcategory, taskIndex) => {
    try {
      setActionLoading(true);
      await deleteTaskTemplate(category.id, subcategory.name, taskIndex);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  const showConfirmation = (action) => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const executeConfirmedAction = () => {
    if (confirmAction) {
      confirmAction.action(...confirmAction.params);
    }
  };

  const getTotalTasks = (category) => {
    if (!category.subcategories) return 0;
    return category.subcategories.reduce(
      (total, sub) => total + (sub.tasks?.length || 0),
      0
    );
  };

  return (
    <Fade in={true} timeout={600}>
      <Box>
        <ConfirmationDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={executeConfirmedAction}
          title={confirmAction?.title || "Confirm Action"}
          message={
            confirmAction?.message ||
            "Are you sure you want to perform this action?"
          }
          loading={actionLoading}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #8B7EC8, #6B5B95)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Task Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your project tasks with custom categories and templates
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog("category")}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
            disabled={projectLoading}
          >
            New Category
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(139, 126, 200, 0.03), rgba(181, 169, 214, 0.05))",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Categories Overview
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h3" fontWeight={700} color="primary">
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Categories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#4CAF50" }}
                >
                  {categories.reduce(
                    (total, cat) => total + (cat.subcategories?.length || 0),
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Subcategories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#FF9800" }}
                >
                  {categories.reduce(
                    (total, cat) => total + getTotalTasks(cat),
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Task Templates
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#2196F3" }}
                >
                  {Math.round(
                    categories.reduce(
                      (total, cat) => total + getTotalTasks(cat),
                      0
                    ) / Math.max(categories.length, 1)
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Tasks/Category
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {projectLoading && categories.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(139, 126, 200, 0.03), rgba(181, 169, 214, 0.05))",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Category
              sx={{
                fontSize: 60,
                color: "text.secondary",
                mb: 2,
                opacity: 0.7,
              }}
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              No categories yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
            >
              Create your first category to start organizing tasks with custom
              templates and workflows.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog("category")}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Create Your First Category
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} key={category.id || category.name}>
                <Accordion
                  expanded={expandedCategory === category.id}
                  onChange={() =>
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )
                  }
                  elevation={0}
                  sx={{
                    "&:before": { display: "none" },
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      p: 3,
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          color: category.color,
                          backgroundColor: category.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Category sx={{ color: "white", fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                          <Chip
                            label={`${
                              category.subcategories?.length || 0
                            } subcategories`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: category.color,
                              color: category.color,
                            }}
                          />
                          <Chip
                            label={`${getTotalTasks(category)} tasks`}
                            size="small"
                            sx={{
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                            }}
                          />
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, category)}
                        disabled={projectLoading || actionLoading}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, pt: 0 }}>
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      {category.subcategories?.map((subcategory) => (
                        <Card
                          key={subcategory.name}
                          elevation={0}
                          sx={{
                            mb: 2,
                            border: `1px solid ${category.color}`,
                            borderRadius: 2,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
                                {subcategory.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={<Add />}
                                  variant="contained"
                                  onClick={() =>
                                    handleOpenDialog(
                                      "task",
                                      category,
                                      subcategory
                                    )
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                  }}
                                  disabled={projectLoading || actionLoading}
                                >
                                  Add Task
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<Edit />}
                                  variant="contained"
                                  onClick={() =>
                                    handleOpenDialog(
                                      "subcategory",
                                      category,
                                      subcategory
                                    )
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                  }}
                                  disabled={projectLoading || actionLoading}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<Delete />}
                                  variant="outlined"
                                  color="error"
                                  onClick={() =>
                                    showConfirmation({
                                      action: handleDeleteSubcategory,
                                      params: [category, subcategory],
                                      title: "Delete Subcategory",
                                      message: `Are you sure you want to delete the subcategory "${subcategory.name}" and all its tasks?`,
                                    })
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                  }}
                                  disabled={projectLoading || actionLoading}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </Box>
                            {subcategory.tasks &&
                            subcategory.tasks.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {subcategory.tasks.map((task, taskIndex) => (
                                  <Chip
                                    key={taskIndex}
                                    label={task}
                                    size="small"
                                    variant="outlined"
                                    onDelete={() =>
                                      showConfirmation({
                                        action: handleDeleteTask,
                                        params: [
                                          category,
                                          subcategory,
                                          taskIndex,
                                        ],
                                        title: "Delete Task Template",
                                        message: `Are you sure you want to delete the task template "${task}"?`,
                                      })
                                    }
                                    sx={{
                                      borderColor: `${category.color}`,
                                      color: category.color,
                                      backgroundColor: `${category.color}10`,
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontStyle: "italic" }}
                              >
                                No tasks in this subcategory
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() =>
                          handleOpenDialog("subcategory", category)
                        }
                        sx={{
                          mt: 2,
                          borderColor: category.color,
                          color: category.color,
                          "&:hover": {
                            borderColor: category.color,
                            backgroundColor: `${category.color}10`,
                          },
                        }}
                        disabled={projectLoading || actionLoading}
                      >
                        Add Subcategory
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        )}

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 150 },
          }}
        >
          <MenuItem
            onClick={() => {
              handleOpenDialog("category", selectedCategory);
              handleMenuClose();
            }}
            disabled={actionLoading}
          >
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Category
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleOpenDialog("subcategory", selectedCategory);
              handleMenuClose();
            }}
            disabled={actionLoading}
          >
            <Add fontSize="small" sx={{ mr: 1 }} />
            Add Subcategory
          </MenuItem>
          <MenuItem
            onClick={() => {
              showConfirmation({
                action: handleDeleteCategory,
                title: "Delete Category",
                message: `Are you sure you want to delete the category "${selectedCategory?.name}" and all its contents?`,
              });
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
            disabled={actionLoading}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Category
          </MenuItem>
        </Menu>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {dialogType === "category" &&
              (selectedCategory ? "Edit Category" : "New Category")}
            {dialogType === "subcategory" &&
              (selectedSubcategory ? "Edit Subcategory" : "New Subcategory")}
            {dialogType === "task" && "Add Task Template"}
          </DialogTitle>

          <DialogContent>
            {(dialogType === "category" || dialogType === "subcategory") && (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  sx={{ mb: 3, mt: 1 }}
                  disabled={actionLoading}
                />
                {dialogType === "category" && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Color
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                    >
                      {colorOptions.map((color) => (
                        <Box
                          key={color}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, color }))
                          }
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: color,
                            cursor: "pointer",
                            border:
                              formData.color === color
                                ? "3px solid #333"
                                : "2px solid transparent",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                    <TextField
                      fullWidth
                      label="Description (Optional)"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      multiline
                      rows={3}
                      disabled={actionLoading}
                    />
                  </>
                )}
              </>
            )}
            {dialogType === "task" && (
              <TextField
                fullWidth
                label="Task Name"
                value={taskForm.name}
                onChange={(e) =>
                  setTaskForm((prev) => ({ ...prev, name: e.target.value }))
                }
                sx={{ mt: 1 }}
                placeholder="Enter task template name..."
                disabled={actionLoading}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={
                dialogType === "category"
                  ? handleSaveCategory
                  : dialogType === "subcategory"
                  ? handleSaveSubcategory
                  : handleSaveTask
              }
              disabled={
                actionLoading ||
                (dialogType === "category" || dialogType === "subcategory"
                  ? !formData.name.trim()
                  : !taskForm.name.trim())
              }
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
            >
              {actionLoading
                ? dialogType === "category" && selectedCategory
                  ? "Updating..."
                  : dialogType === "category"
                  ? "Creating..."
                  : dialogType === "subcategory" && selectedSubcategory
                  ? "Updating..."
                  : dialogType === "subcategory"
                  ? "Creating..."
                  : "Saving..."
                : dialogType === "category" && selectedCategory
                ? "Update"
                : dialogType === "category"
                ? "Create"
                : dialogType === "subcategory" && selectedSubcategory
                ? "Update"
                : dialogType === "subcategory"
                ? "Create"
                : "Add Task"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CategoryManager;
