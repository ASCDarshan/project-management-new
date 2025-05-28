import React, { createContext, useState, useEffect } from "react";
import { firebaseService } from "../services/firebase";
import useAuth from "../hooks/useAuth";

  const defaultCategories = [
    {
      id: "planning-analysis",
      name: "Planning & Analysis",
      color: "#8B7EC8",
      description: "Project planning and requirements analysis",
      subcategories: [
        {
          name: "Requirements Gathering",
          tasks: [
            "Stakeholder interviews",
            "Business requirements documentation",
            "Functional requirements specification",
            "Non-functional requirements",
            "User story creation",
            "Acceptance criteria definition",
          ],
        },
        {
          name: "Project Planning",
          tasks: [
            "Project scope definition",
            "Work breakdown structure",
            "Timeline creation and milestones",
            "Resource allocation planning",
            "Risk assessment and mitigation",
            "Budget estimation and approval",
          ],
        },
      ],
    },
    {
      id: "design-architecture",
      name: "Design & Architecture",
      color: "#B5A9D6",
      description: "System design and user experience planning",
      subcategories: [
        {
          name: "System Design",
          tasks: [
            "System architecture design",
            "Database schema design",
            "API design and documentation",
            "Security architecture planning",
            "Performance optimization strategy",
            "Integration points mapping",
          ],
        },
        {
          name: "UI/UX Design",
          tasks: [
            "User experience research",
            "Wireframe and mockup creation",
            "Interactive prototype development",
            "Design system creation",
            "Usability testing and feedback",
            "Responsive design planning",
          ],
        },
      ],
    },
    {
      id: "development",
      name: "Development",
      color: "#A8E6CF",
      description: "Software development and implementation",
      subcategories: [
        {
          name: "Frontend Development",
          tasks: [
            "Component development and testing",
            "State management implementation",
            "Responsive design implementation",
            "Cross-browser compatibility testing",
            "Performance optimization",
            "Accessibility implementation",
          ],
        },
        {
          name: "Backend Development",
          tasks: [
            "API development and testing",
            "Database implementation",
            "Authentication and authorization",
            "Data validation and sanitization",
            "Error handling and logging",
            "Third-party integrations",
          ],
        },
      ],
    },
    {
      id: "testing-qa",
      name: "Testing & Quality Assurance",
      color: "#FFD3A5",
      description: "Quality assurance and testing processes",
      subcategories: [
        {
          name: "Testing",
          tasks: [
            "Unit testing implementation",
            "Integration testing",
            "System and end-to-end testing",
            "User acceptance testing",
            "Performance and load testing",
            "Security testing and validation",
          ],
        },
        {
          name: "Quality Assurance",
          tasks: [
            "Code review and standards",
            "Documentation review",
            "Automated testing setup",
            "Bug tracking and resolution",
            "Quality metrics monitoring",
            "Release readiness assessment",
          ],
        },
      ],
    },
    {
      id: "deployment-maintenance",
      name: "Deployment & Maintenance",
      color: "#FFAAA5",
      description: "Deployment, monitoring, and ongoing maintenance",
      subcategories: [
        {
          name: "Deployment",
          tasks: [
            "Environment setup and configuration",
            "CI/CD pipeline configuration",
            "Production deployment and rollback",
            "Monitoring and alerting setup",
            "Backup and disaster recovery",
            "Performance monitoring setup",
          ],
        },
        {
          name: "Maintenance",
          tasks: [
            "Regular system updates",
            "Security patches and updates",
            "Performance monitoring and optimization",
            "User support and issue resolution",
            "Documentation updates and maintenance",
            "System health monitoring",
          ],
        },
      ],
    },
  ];

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const existingCategories = await firebaseService.getCategories();
        if (existingCategories.length === 0) {
          for (const category of defaultCategories) {
            await firebaseService.createCategory(category);
          }
          setCategories(defaultCategories);
        } else {
          setCategories(existingCategories);
        }
      } catch (error) {
        console.error("Error initializing categories:", error);
        setCategories(defaultCategories);
      }
    };

    initializeCategories();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadProjects();
      loadTasks();
      loadEmployees();
      loadCategories();
    }
  }, [currentUser]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await firebaseService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      setError("Failed to load projects");
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const tasksData = await firebaseService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const employeesData = await firebaseService.getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await firebaseService.getCategories();
      if (categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const createProject = async (projectData) => {
    try {
      setLoading(true);
      const projectId = await firebaseService.createProject({
        ...projectData,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName,
        createdByEmail: currentUser.email,
        status: projectData.status || "planning",
        priority: projectData.priority || "medium",
      });
      await loadProjects();
      return projectId;
    } catch (error) {
      setError("Failed to create project");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, updateData) => {
    try {
      await firebaseService.updateProject(projectId, updateData);
      await loadProjects();
    } catch (error) {
      setError("Failed to update project");
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await firebaseService.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      setError("Failed to delete project");
      throw error;
    }
  };

  const createTask = async (taskData) => {
    try {
      const taskId = await firebaseService.createTask({
        ...taskData,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName,
        status: taskData.status || "pending",
        priority: taskData.priority || "medium",
      });
      await loadTasks();
      return taskId;
    } catch (error) {
      setError("Failed to create task");
      throw error;
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      await firebaseService.updateTask(taskId, updateData);
      await loadTasks();
    } catch (error) {
      setError("Failed to update task");
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await firebaseService.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      setError("Failed to delete task");
      throw error;
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const employeeId = await firebaseService.createEmployee({
        ...employeeData,
        createdBy: currentUser.uid,
        createdAt: new Date(),
      });
      await loadEmployees();
      return employeeId;
    } catch (error) {
      setError("Failed to create employee");
      throw error;
    }
  };

  const updateEmployee = async (employeeId, updateData) => {
    try {
      await firebaseService.updateEmployee(employeeId, updateData);
      await loadEmployees();
    } catch (error) {
      setError("Failed to update employee");
      throw error;
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await firebaseService.deleteEmployee(employeeId);
      await loadEmployees();
    } catch (error) {
      setError("Failed to delete employee");
      throw error;
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const categoryId = await firebaseService.createCategory({
        ...categoryData,
        createdBy: currentUser.uid,
      });
      await loadCategories();
      return categoryId;
    } catch (error) {
      setError("Failed to create category");
      throw error;
    }
  };

  const getProjectById = (projectId) => {
    return projects.find((project) => project.id === projectId);
  };

  const getTasksByProject = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByEmployee = (employeeId) => {
    return tasks.filter((task) => task.assignedTo === employeeId);
  };

  const getProjectsByEmployee = (employeeId) => {
    return projects.filter((project) =>
      project.assignedTo?.some((member) => member.id === employeeId)
    );
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = getTasksByProject(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(
      (task) => task.status === "completed"
    );
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };

  const value = {
    projects,
    tasks,
    categories,
    employees,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectProgress,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getTasksByEmployee,
    getTasksByStatus,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getProjectsByEmployee,
    createCategory,
    loadProjects,
    loadTasks,
    loadEmployees,
    loadCategories,
    defaultCategories,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectContext;