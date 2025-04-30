
import { StatusType, Task, PeriodicityType, QuickNote } from "../types/task";
import { format, addDays, addWeeks, addMonths, isBefore ,subDays} from "date-fns";
import { ptBR } from "date-fns/locale";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Format date to Portuguese format
export const formatDate = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Format short date
export const formatShortDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

// Get the color based on task status
export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case "andamento":
      return "bg-sky-blue";
    case "concluída":
      return "bg-emerald-500";
    case "atrasada":
      return "bg-alert-red";
    default:
      return "bg-gray-200";
  }
};

// Get status text
export const getStatusText = (status: StatusType): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Check if the task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  const ontem = subDays(new Date(), 1);
  return isBefore(task.dataPrevisao, ontem) && task.status === "andamento";
};

// Calculate the next date based on periodicity
export const calculateNextDate = (date: Date, periodicidade: PeriodicityType): Date => {
  switch (periodicidade) {
    case "diária":
      return addDays(date, 1);
    case "semanal":
      return addWeeks(date, 1);
    case "mensal":
      return addMonths(date, 1);
    default:
      return date;
  }
};

// Mock data for initial tasks
export const getTasks = async (): Promise<Task[]> => {
  
  const response = await fetch(`http://localhost:3000/tarefas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }, 
  });

  return response.json();

};

export const getNotas =  async (): Promise<QuickNote[]> => {
  const response = await fetch(`http://localhost:3000/notas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }, 
  });

  return response.json();
}
