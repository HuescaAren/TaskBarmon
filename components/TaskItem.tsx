
import React from 'react';
import type { Task } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <li className="flex items-center bg-retro-container p-4 rounded-lg border-2 border-retro-border shadow-retro-sm transition-shadow duration-200">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={(e) => onToggleComplete(task.id, e.target.checked)}
        className="h-6 w-6 rounded border-2 border-retro-border text-retro-header focus:ring-retro-header cursor-pointer flex-shrink-0"
      />
      <p className={`mx-4 flex-grow text-lg ${task.is_completed ? 'line-through text-retro-text-muted' : 'text-retro-text'}`}>
        {task.text}
      </p>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button 
          onClick={() => onEdit(task)}
          className="p-2 text-retro-accent-edit hover:text-opacity-80 transition-colors"
          aria-label="Editar tarea"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-retro-accent-delete hover:text-opacity-80 transition-colors"
          aria-label="Eliminar tarea"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
