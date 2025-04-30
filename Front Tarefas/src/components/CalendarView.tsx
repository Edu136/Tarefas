
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, StatusType } from "../types/task";
import { ptBR } from "date-fns/locale";
import { format, isSameDay, isBefore, isAfter, isEqual } from "date-fns";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
import FilterBar from "./FilterBar";

interface CalendarViewProps {
  tasks: Task[];
  onStatusChange: (id: string, status: StatusType) => void;
  onEdit: (task: Task) => void;
  statusFilter: StatusType | "todas";
  onStatusFilterChange: (filter: StatusType | "todas") => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onStatusChange,
  onEdit,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  // Filter tasks based on status and date range
  const filteredTasks = tasks.filter((task) => {
    // First filter by status if a specific status is selected
    if (statusFilter !== "todas" && task.status !== statusFilter) {
      return false;
    }

    // Then filter by date range if set
    if (dateRange.start && dateRange.end) {
      // Check if the task's expected date is within the range
      return (
        (isAfter(task.dataPrevisao, dateRange.start) || isEqual(task.dataPrevisao, dateRange.start)) &&
        (isBefore(task.dataPrevisao, dateRange.end) || isEqual(task.dataPrevisao, dateRange.end))
      );
    }

    return true;
  });

  // Tasks for the selected date (filtered)
  const tasksForSelectedDate = selectedDate
    ? filteredTasks.filter((task) => isSameDay(task.dataPrevisao, selectedDate))
    : [];

  // Function to render task dots on calendar days
  const getTasksForDay = (day: Date) => {
    const tasksOnDay = filteredTasks.filter((task) => isSameDay(task.dataPrevisao, day));
    
    if (tasksOnDay.length === 0) return null;

    const hasOverdue = tasksOnDay.some((task) => task.status === "atrasada");
    const hasPending = tasksOnDay.some((task) => task.status === "andamento");
    const hasCompleted = tasksOnDay.some((task) => task.status === "concluída");

    return (
      <div className="flex gap-1 justify-center mt-1">
        {hasOverdue && <div className="h-1.5 w-1.5 rounded-full bg-alert-red" />}
        {hasPending && <div className="h-1.5 w-1.5 rounded-full bg-sky-blue" />}
        {hasCompleted && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Calendário</CardTitle>
        <FilterBar 
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          view="calendario"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto border rounded-md")}
              components={{
                DayContent: (props) => (
                  <div>
                    <div>{format(props.date, "d")}</div>
                    {getTasksForDay(props.date)}
                  </div>
                ),
              }}
            />
            <div className="flex items-center justify-center mt-4 gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-alert-red" />
                <span className="text-xs">Atrasadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-sky-blue" />
                <span className="text-xs">andamentos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs">Concluídas</span>
              </div>
            </div>
          </div>

          <div>
            {selectedDate && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium">
                    Tarefas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <Badge variant="outline">
                    {tasksForSelectedDate.length} tarefa(s)
                  </Badge>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2">
                  {tasksForSelectedDate.length > 0 ? (
                    tasksForSelectedDate.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onEdit={onEdit}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-gray">
                      <p>Nenhuma tarefa para esta data</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper from utils.ts
const cn = (...inputs: (string | undefined)[]) => {
  return inputs.filter(Boolean).join(" ");
};

export default CalendarView;
