// src/components/projects/ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Fade,
  Skeleton
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Add,
  MoreVert,
  Assignment,
  Group,
  AccessTime,
  CheckCircle,
  Schedule,
  Flag,
  Timeline} from '@mui/icons-material';
import { useProject } from '../../contexts/ProjectContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject, createTask, updateTask } = useProject();
  
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    dueDate: null
  });

  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: null
  });

  useEffect(() => {
    // Find project by ID
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      setEditForm({
        name: foundProject.name || '',
        description: foundProject.description || '',
        status: foundProject.status || 'planning',
        priority: foundProject.priority || 'medium',
        dueDate: foundProject.dueDate || null
      });
    }

    // Filter tasks for this project
    const filteredTasks = tasks.filter(task => task.projectId === id);
    setProjectTasks(filteredTasks);
    
    setLoading(false);
  }, [id, projects, tasks]);

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: '#A5C9FF' },
    { value: 'in-progress', label: 'In Progress', color: '#FFD3A5' },
    { value: 'completed', label: 'Completed', color: '#A8E6CF' },
    { value: 'on-hold', label: 'On Hold', color: '#FFAAA5' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#A8E6CF' },
    { value: 'medium', label: 'Medium', color: '#FFD3A5' },
    { value: 'high', label: 'High', color: '#FFAAA5' }
  ];

  const getStatusColor = (status) => {
    return statusOptions.find(s => s.value === status)?.color || '#E6E6FA';
  };

  const getPriorityColor = (priority) => {
    return priorityOptions.find(p => p.value === priority)?.color || '#E6E6FA';
  };

  const calculateProgress = () => {
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditProject = async () => {
    try {
      await updateProject(id, editForm);
      setEditDialogOpen(false);
      setMenuAnchorEl(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(id);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
    setMenuAnchorEl(null);
  };

  const handleCreateTask = async () => {
    try {
      await createTask({
        ...taskForm,
        projectId: id,
        projectName: project.name
      });
      setTaskDialogOpen(false);
      setTaskForm({
        name: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: null
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTasksByStatus = (status) => {
    return projectTasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Project not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  const progress = calculateProgress();
  const isOverdue = project.dueDate && new Date(project.dueDate.toDate ? project.dueDate.toDate() : project.dueDate) < new Date();

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/projects')}
              sx={{ color: 'text.secondary' }}
            >
              Back to Projects
            </Button>
            <Box sx={{ borderLeft: '2px solid #E0E0E0', height: 24, mx: 1 }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8B7EC8, #6B5B95)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {project.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Chip
                  label={statusOptions.find(s => s.value === project.status)?.label}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(project.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Chip
                  label={priorityOptions.find(p => p.value === project.priority)?.label}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getPriorityColor(project.priority),
                    color: getPriorityColor(project.priority)
                  }}
                />
              </Box>
            </Box>
          </Box>

          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              {/* Progress Header */}
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, rgba(139, 126, 200, 0.1), rgba(181, 169, 214, 0.05))' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Project Progress
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(139, 126, 200, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: progress === 100 ? 
                        'linear-gradient(90deg, #A8E6CF, #7FBF7F)' :
                        'linear-gradient(90deg, #8B7EC8, #B5A9D6)'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {projectTasks.filter(t => t.status === 'completed').length} of {projectTasks.length} tasks completed
                  </Typography>
                  {project.dueDate && (
                    <Typography
                      variant="body2"
                      sx={{ color: isOverdue ? '#FFAAA5' : 'text.secondary' }}
                    >
                      Due {formatDate(project.dueDate)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                  <Tab label="Overview" />
                  <Tab label={`Tasks (${projectTasks.length})`} />
                  <Tab label="Activity" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                      {project.description || 'No description provided'}
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                      Task Categories
                    </Typography>
                    <Grid container spacing={2}>
                      {['Planning', 'Design', 'Development', 'Testing', 'Deployment'].map((category) => {
                        const categoryTasks = projectTasks.filter(task => 
                          task.category?.toLowerCase().includes(category.toLowerCase())
                        );
                        const completedCount = categoryTasks.filter(task => task.status === 'completed').length;
                        const percentage = categoryTasks.length > 0 ? (completedCount / categoryTasks.length) * 100 : 0;

                        return (
                          <Grid item xs={12} sm={6} md={4} key={category}>
                            <Card
                              elevation={0}
                              sx={{
                                p: 2,
                                border: '1px solid rgba(139, 126, 200, 0.1)',
                                borderRadius: 2
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                {category}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {completedCount}/{categoryTasks.length} tasks
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(139, 126, 200, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    backgroundColor: '#8B7EC8'
                                  }
                                }}
                              />
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Tasks ({projectTasks.length})
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setTaskDialogOpen(true)}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        Add Task
                      </Button>
                    </Box>

                    {projectTasks.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No tasks yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Add your first task to get started
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setTaskDialogOpen(true)}
                        >
                          Add Task
                        </Button>
                      </Box>
                    ) : (
                      <List>
                        {projectTasks.map((task, index) => (
                          <React.Fragment key={task.id}>
                            <ListItem
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                  backgroundColor: 'rgba(139, 126, 200, 0.05)'
                                }
                              }}
                            >
                              <ListItemIcon>
                                <IconButton
                                  size="small"
                                  onClick={() => handleTaskStatusChange(
                                    task.id,
                                    task.status === 'completed' ? 'pending' : 'completed'
                                  )}
                                >
                                  <CheckCircle
                                    sx={{
                                      color: task.status === 'completed' ? '#A8E6CF' : 'text.secondary'
                                    }}
                                  />
                                </IconButton>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                      color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                    }}
                                  >
                                    {task.name}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Chip
                                      label={task.status}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        backgroundColor: getStatusColor(task.status),
                                        color: 'white'
                                      }}
                                    />
                                    <Chip
                                      label={task.priority}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        borderColor: getPriorityColor(task.priority),
                                        color: getPriorityColor(task.priority)
                                      }}
                                    />
                                    {task.category && (
                                      <Typography variant="caption" color="text.secondary">
                                        {task.category}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < projectTasks.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Timeline sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Activity tracking coming soon
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Project Info */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Project Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(project.createdAt)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created by
                    </Typography>
                    <Typography variant="body1">
                      {project.createdByName || 'Unknown'}
                    </Typography>
                  </Box>

                  {project.dueDate && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: isOverdue ? '#FFAAA5' : 'text.primary' }}
                      >
                        {formatDate(project.dueDate)}
                        {isOverdue && ' (Overdue)'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Team */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Team Members
                </Typography>
                
                {project.assignedTo && project.assignedTo.length > 0 ? (
                  <Box>
                    <AvatarGroup max={6} sx={{ justifyContent: 'flex-start', mb: 2 }}>
                      {project.assignedTo.map((member, index) => (
                        <Tooltip key={index} title={member.name || member.email}>
                          <Avatar
                            sx={{ bgcolor: 'primary.main' }}
                            src={member.photoURL}
                          >
                            {(member.name || member.email || 'TM').charAt(0).toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    
                    <Typography variant="body2" color="text.secondary">
                      {project.assignedTo.length} team member{project.assignedTo.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No team members assigned
                  </Typography>
                )}
              </Paper>

              {/* Quick Stats */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(139, 126, 200, 0.1)' }}>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {projectTasks.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Tasks
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(168, 230, 207, 0.1)' }}>
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#A8E6CF' }}>
                        {getTasksByStatus('completed').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 211, 165, 0.1)' }}>
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#FFD3A5' }}>
                        {getTasksByStatus('in-progress').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(165, 201, 255, 0.1)' }}>
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#A5C9FF' }}>
                        {getTasksByStatus('pending').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 150 } }}
        >
          <MenuItem onClick={() => { setEditDialogOpen(true); handleMenuClose(); }}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Project
          </MenuItem>
          <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Project
          </MenuItem>
        </Menu>

        {/* Edit Project Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Project Name"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.status}
                    label="Status"
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editForm.priority}
                    label="Priority"
                    onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    {priorityOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditProject}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task Name"
              value={taskForm.name}
              onChange={(e) => setTaskForm(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={taskForm.description}
              onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={taskForm.status}
                    label="Status"
                    onChange={(e) => setTaskForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={taskForm.priority}
                    label="Priority"
                    onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateTask} disabled={!taskForm.name.trim()}>
              Add Task
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ProjectDetails;