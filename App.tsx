
import React, { useState, useEffect, useCallback } from 'react';
import type { Task } from './types';
import { getTasks, addTask, updateTask, deleteTask } from './services/supabase';
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import { Spinner } from './components/icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('No se pudieron cargar las tareas. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModalForAdd = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSubmitTask = async (text: string) => {
    try {
      if (taskToEdit) {
        // Edit existing task
        const updatedTask = await updateTask(taskToEdit.id, { text });
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      } else {
        // Add new task
        const newTask = await addTask(text);
        setTasks([newTask, ...tasks]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar la tarea.');
    }
  };
  
  const handleToggleComplete = async (id: string, is_completed: boolean) => {
    try {
        const updatedTask = await updateTask(id, { is_completed });
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (err) {
        setError('Error al actualizar el estado de la tarea.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic UI update
    const originalTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id !== id));
    try {
        await deleteTask(id);
    } catch (err) {
        setError('Error al eliminar la tarea. Revirtiendo cambios.');
        setTasks(originalTasks); // Revert on failure
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-20"><Spinner /></div>;
    }

    if (error) {
      return <p className="text-center text-retro-accent-delete bg-red-100 p-4 rounded-md border-2 border-retro-accent-delete">{error}</p>;
    }

    if (tasks.length === 0) {
      return <p className="text-center text-retro-text-muted py-10">¡Felicidades! No tienes tareas pendientes.</p>;
    }

    return (
      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenModalForEdit}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="font-sans text-retro-text min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 p-4 bg-retro-header text-white rounded-lg border-2 border-retro-border shadow-retro">
          <h1 className="text-5xl font-mono mb-4 sm:mb-0">Gestión de Tareas</h1>
          <button 
            onClick={handleOpenModalForAdd}
            className="w-full sm:w-auto bg-retro-accent-add text-white font-bold py-2 px-6 rounded-md border-2 border-retro-border shadow-retro-sm transition-all hover:shadow-none hover:-translate-y-0.5 hover:-translate-x-0.5"
          >
            Agregar Tarea
          </button>
        </header>

        <main className="bg-retro-container p-4 sm:p-6 rounded-lg border-2 border-retro-border shadow-retro">
          {renderContent()}
        </main>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default App;
