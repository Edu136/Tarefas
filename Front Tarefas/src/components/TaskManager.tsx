
import React, { useState } from "react";
import { Task, StatusType, QuickNote } from "../types/task";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "./TaskCard";
import QuickNotes from "./QuickNotes";
import FilterBar from "./FilterBar";

interface TaskManagerProps {
  tasks: Task[];
  quickNotes: QuickNote[];
  filter: StatusType | "todas";
  setFilter: (filter: StatusType | "todas") => void;
  dateRange: { start: Date | undefined; end: Date | undefined };
  setDateRange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  counts: {
    todas: number;
    andamento: number;
    concluída: number;
    atrasada: number;
  };
  onStatusChange: (id: string, status: StatusType) => void;
  onEditTask: (task: Task) => void;
  onAddNote: (note: QuickNote) => void;
  onDeleteNote: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  quickNotes,
  filter,
  setFilter,
  dateRange,
  setDateRange,
  counts,
  onStatusChange,
  onEditTask,
  onAddNote,
  onDeleteNote,
}) => {
  // Filter tasks based on status filter and date range
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply status filter
    if (filter !== "todas") {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      console.log("Filtering tasks between", dateRange.start, "and", dateRange.end);
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.dataPrevisao);
        return (
          (taskDate >= dateRange.start || 
           taskDate.toDateString() === dateRange.start.toDateString()) && 
          (taskDate <= dateRange.end || 
           taskDate.toDateString() === dateRange.end.toDateString())
        );
      });
    }
    
    return filtered;
  };
  
  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex-1">
      <FilterBar 
        statusFilter={filter}
        onStatusFilterChange={setFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        view="lista"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks list */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {filter === "todas" ? "Todas as tarefas" : `Tarefas ${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onEdit={onEditTask}
                  />
                ))
              ) : (
                <div className="md:col-span-2 p-8 bg-white rounded-lg border text-center">
                  <p className="text-neutral-gray">Nenhuma tarefa encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick notes section */}
        <div>
          <QuickNotes
            notes={quickNotes}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
