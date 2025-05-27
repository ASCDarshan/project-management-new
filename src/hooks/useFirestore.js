// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';

export const useFirestore = (collection, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (collection) {
          case 'projects':
            unsubscribe = firebaseService.subscribeToProjects((projects) => {
              setData(projects);
              setLoading(false);
            });
            break;
          
          case 'tasks':
            unsubscribe = firebaseService.subscribeToTasks((tasks) => {
              setData(tasks);
              setLoading(false);
            });
            break;
          
          default:
            // For static collections like categories and employees
            const result = await firebaseService[`get${collection.charAt(0).toUpperCase() + collection.slice(1)}`]();
            setData(result);
            setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, dependencies);

  const refresh = () => {
    setLoading(true);
    // Re-trigger the effect by updating a dependency
  };

  return {
    data,
    loading,
    error,
    refresh
  };
};

// Specialized hooks for different collections
export const useProjects = (userId = null) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToProjects((projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    }, userId);

    return unsubscribe;
  }, [userId]);

  return { projects, loading, error };
};

export const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToTasks((tasksData) => {
      setTasks(tasksData);
      setLoading(false);
    }, projectId);

    return unsubscribe;
  }, [projectId]);

  return { tasks, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await firebaseService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await firebaseService.getEmployees();
        setEmployees(employeesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
};