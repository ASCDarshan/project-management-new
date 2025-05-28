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

const colorOptions = [
  "#8B7EC8",
  "#B5A9D6",
  "#A8E6CF",
  "#FFD3A5",
  "#FFAAA5",
  "#A5C9FF",
  "#E6E6FA",
  "#F0F0FF",
  "#D1C4E9",
  "#C8F2D8",
];

const CategoryManager = () => {
  const { categories } = useProject();
  const [dialogType, setDialogType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

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
    setFormData({ name: "", color: "#8B7EC8", description: "" });
    setTaskForm({ name: "", categoryId: "", subcategoryName: "" });
  };

  const handleSaveCategory = () => {
    // Here you would typically save to Firebase
    console.log("Saving category:", formData);
    handleCloseDialog();
    // Refresh categories after save
    // loadCategories();
  };

  const handleSaveSubcategory = () => {
    // Here you would typically save to Firebase
    console.log(
      "Saving subcategory:",
      formData,
      "to category:",
      selectedCategory
    );
    handleCloseDialog();
  };

  const handleSaveTask = () => {
    // Here you would typically save to Firebase
    console.log("Saving task:", taskForm);
    handleCloseDialog();
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

  const handleDeleteCategory = () => {
    if (
      selectedCategory &&
      window.confirm("Are you sure you want to delete this category?")
    ) {
      // Here you would delete from Firebase
      console.log("Deleting category:", selectedCategory);
    }
    handleMenuClose();
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
            border: "1px solid rgba(139, 126, 200, 0.1)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Categories Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h3" fontWeight={700} color="primary">
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
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
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#A8E6CF" }}
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
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#FFD3A5" }}
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
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#A5C9FF" }}
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
        {categories.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(139, 126, 200, 0.03), rgba(181, 169, 214, 0.05))",
              border: "1px solid rgba(139, 126, 200, 0.1)",
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
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid rgba(139, 126, 200, 0.1)",
                    overflow: "visible",
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
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
                            sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
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
                                border: `1px solid ${category.color}30`,
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
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {subcategory.name}
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                      size="small"
                                      startIcon={<Add />}
                                      onClick={() =>
                                        handleOpenDialog(
                                          "task",
                                          category,
                                          subcategory
                                        )
                                      }
                                      sx={{ textTransform: "none" }}
                                    >
                                      Add Task
                                    </Button>
                                    <Button
                                      size="small"
                                      startIcon={<Edit />}
                                      onClick={() =>
                                        handleOpenDialog(
                                          "subcategory",
                                          category,
                                          subcategory
                                        )
                                      }
                                      sx={{ textTransform: "none" }}
                                    >
                                      Edit
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
                                    {subcategory.tasks.map(
                                      (task, taskIndex) => (
                                        <Chip
                                          key={taskIndex}
                                          label={task}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            borderColor: `${category.color}50`,
                                            color: category.color,
                                            backgroundColor: `${category.color}10`,
                                          }}
                                        />
                                      )
                                    )}
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
                          >
                            Add Subcategory
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
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
          >
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Category
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleOpenDialog("subcategory", selectedCategory);
              handleMenuClose();
            }}
          >
            <Add fontSize="small" sx={{ mr: 1 }} />
            Add Subcategory
          </MenuItem>
          <MenuItem onClick={handleDeleteCategory} sx={{ color: "error.main" }}>
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
            {dialogType === "subcategory" && "Add Subcategory"}
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
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
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
                dialogType === "category" || dialogType === "subcategory"
                  ? !formData.name.trim()
                  : !taskForm.name.trim()
              }
            >
              {selectedCategory && dialogType === "category"
                ? "Update"
                : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CategoryManager;
