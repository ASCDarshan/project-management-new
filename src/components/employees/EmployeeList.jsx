// src/components/employees/EmployeeList.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Tooltip,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Email,
  Phone,
  Work,
  Group,
  Person,
  Badge as BadgeIcon,
  Assignment
} from '@mui/icons-material';
import { useProject } from '../../contexts/ProjectContext';

const EmployeeList = () => {
  const { employees, projects, tasks, createEmployee, loading } = useProject();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create' or 'edit'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    skills: []
  });

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'analyst', label: 'Business Analyst' },
    { value: 'tester', label: 'QA Tester' },
    { value: 'devops', label: 'DevOps Engineer' }
  ];

  const departmentOptions = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Operations',
    'HR'
  ];

  const skillOptions = [
    'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
    'UI/UX Design', 'Figma', 'Adobe Creative Suite',
    'Project Management', 'Agile', 'Scrum',
    'Testing', 'Automation', 'Quality Assurance',
    'AWS', 'Docker', 'Kubernetes', 'CI/CD'
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleMenuOpen = (event, employee) => {
    event.stopPropagation();
    setSelectedEmployee(employee);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleOpenDialog = (type, employee = null) => {
    setDialogType(type);
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        department: employee.department || '',
        skills: employee.skills || []
      });
      setSelectedEmployee(employee);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        skills: []
      });
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      skills: []
    });
  };

  const handleSaveEmployee = async () => {
    try {
      if (dialogType === 'create') {
        await createEmployee(formData);
      } else {
        // Update employee logic would go here
        console.log('Update employee:', selectedEmployee.id, formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee && window.confirm('Are you sure you want to delete this employee?')) {
      // Delete logic would go here
      console.log('Delete employee:', selectedEmployee.id);
    }
    handleMenuClose();
  };

  const getEmployeeProjects = (employeeId) => {
    return projects.filter(project => 
      project.assignedTo?.some(member => member.id === employeeId)
    );
  };

  const getEmployeeTasks = (employeeId) => {
    return tasks.filter(task => task.assignedTo === employeeId);
  };

  const getRoleColor = (role) => {
    const roleColors = {
      developer: '#8B7EC8',
      designer: '#B5A9D6',
      manager: '#A8E6CF',
      analyst: '#FFD3A5',
      tester: '#FFAAA5',
      devops: '#A5C9FF'
    };
    return roleColors[role] || '#E6E6FA';
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || '??';
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8B7EC8, #6B5B95)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Team Members
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your team and track their project assignments
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('create')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Add Team Member
          </Button>
        </Box>

        {/* Search and Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(139, 126, 200, 0.03), rgba(181, 169, 214, 0.05))',
            border: '1px solid rgba(139, 126, 200, 0.1)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={filterRole}
                  label="Filter by Role"
                  onChange={(e) => setFilterRole(e.target.value)}
                  sx={{ backgroundColor: 'white', borderRadius: 2 }}
                >
                  {roleOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {employees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Members
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#A8E6CF' }}>
                  {employees.filter(emp => emp.role === 'developer').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Developers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#FFD3A5' }}>
                  {employees.filter(emp => emp.role === 'designer').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Designers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#A5C9FF' }}>
                  {employees.filter(emp => emp.role === 'manager').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Managers
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Employee List */}
        {filteredEmployees.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(139, 126, 200, 0.03), rgba(181, 169, 214, 0.05))',
              border: '1px solid rgba(139, 126, 200, 0.1)'
            }}
          >
            <Group sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {searchTerm || filterRole !== 'all' ? 'No team members found' : 'No team members yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              {searchTerm || filterRole !== 'all' ?
                'Try adjusting your search or filter criteria.' :
                'Add your first team member to start building your project team.'
              }
            </Typography>
            {!searchTerm && filterRole === 'all' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog('create')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
              >
                Add Your First Team Member
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredEmployees.map((employee, index) => (
              <Grid item xs={12} sm={6} md={4} key={employee.id}>
                <Fade in={true} timeout={600 + (index * 100)}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(139, 126, 200, 0.15)',
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: '#A8E6CF',
                                border: '2px solid white'
                              }}
                            />
                          }
                        >
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: getRoleColor(employee.role),
                              fontSize: '1.5rem',
                              fontWeight: 600
                            }}
                            src={employee.avatar}
                          >
                            {getInitials(employee.name)}
                          </Avatar>
                        </Badge>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, employee)}
                          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      {/* Info */}
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {employee.name}
                      </Typography>
                      
                      <Chip
                        label={employee.role}
                        size="small"
                        sx={{
                          backgroundColor: `${getRoleColor(employee.role)}20`,
                          color: getRoleColor(employee.role),
                          fontWeight: 500,
                          mb: 2
                        }}
                      />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        {employee.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {employee.email}
                            </Typography>
                          </Box>
                        )}
                        
                        {employee.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {employee.phone}
                            </Typography>
                          </Box>
                        )}

                        {employee.department && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {employee.department}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Skills */}
                      {employee.skills && employee.skills.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Skills
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {employee.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Chip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: 20,
                                  borderColor: 'rgba(139, 126, 200, 0.3)',
                                  color: 'text.secondary'
                                }}
                              />
                            ))}
                            {employee.skills.length > 3 && (
                              <Chip
                                label={`+${employee.skills.length - 3}`}
                                size="small"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: 20,
                                  backgroundColor: 'rgba(139, 126, 200, 0.1)',
                                  color: '#8B7EC8'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Stats */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, backgroundColor: 'rgba(139, 126, 200, 0.1)' }}>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {getEmployeeProjects(employee.id).length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Projects
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, backgroundColor: 'rgba(168, 230, 207, 0.1)' }}>
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#A8E6CF' }}>
                              {getEmployeeTasks(employee.id).length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tasks
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog('edit', employee)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          borderColor: 'rgba(139, 126, 200, 0.3)',
                          color: '#8B7EC8',
                          '&:hover': {
                            borderColor: '#8B7EC8',
                            backgroundColor: 'rgba(139, 126, 200, 0.1)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 150 }
          }}
        >
          <MenuItem onClick={() => handleOpenDialog('edit', selectedEmployee)}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteEmployee} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Add/Edit Employee Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogType === 'create' ? 'Add New Team Member' : 'Edit Team Member'}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roleOptions.slice(1).map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    label="Department"
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  >
                    {departmentOptions.map(dept => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Skills</InputLabel>
                  <Select
                    multiple
                    value={formData.skills}
                    label="Skills"
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {skillOptions.map(skill => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveEmployee}
              disabled={!formData.name.trim() || !formData.email.trim()}
            >
              {dialogType === 'create' ? 'Add Member' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default EmployeeList;