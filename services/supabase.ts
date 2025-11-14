
import { createClient } from '@supabase/supabase-js';
import type { Task } from '../types';

const supabaseUrl = 'https://wixbnumywchobxukgpkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGJudW15d2Nob2J4dWtncGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDYzMzUsImV4cCI6MjA3ODY4MjMzNX0.xqO0fGDy9UCl4Y597o6bJxmVfJ9lGugsEvDEJoMUFy8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
    return data as Task[];
};

export const addTask = async (text: string): Promise<Task> => {
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ text }])
        .select()
        .single();

    if (error) {
        console.error('Error adding task:', error);
        throw error;
    }
    return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating task:', error);
        throw error;
    }
    return data as Task;
};

export const deleteTask = async (id: string) => {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
