
import React, { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setText(taskToEdit.text);
    } else {
      setText('');
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-retro-bg p-6 md:p-8 rounded-lg border-2 border-retro-border shadow-retro w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-mono text-retro-header mb-6">
          {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 bg-retro-container border-2 border-retro-border rounded-md focus:outline-none focus:ring-2 focus:ring-retro-header text-retro-text placeholder-retro-text-muted"
            placeholder="¿Qué necesitas hacer?"
            rows={4}
            autoFocus
          />
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-retro-text-muted text-white font-bold rounded-md border-2 border-retro-border shadow-retro-sm hover:shadow-none hover:-translate-y-px hover:-translate-x-px transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-retro-accent-add text-white font-bold rounded-md border-2 border-retro-border shadow-retro-sm hover:shadow-none hover:-translate-y-px hover:-translate-x-px transition-all"
            >
              {taskToEdit ? 'Guardar Cambios' : 'Agregar Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
