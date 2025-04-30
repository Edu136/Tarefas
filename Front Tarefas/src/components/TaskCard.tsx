
import React from "react";
import { Task } from "../types/task";
import { formatShortDate, getStatusColor } from "../utils/taskUtils";
import { CheckCircle, RefreshCcw, AlarmClock , FileText, Edit } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: "andamento" | "concluída" | "atrasada") => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit }) => {
  const statusClass = getStatusColor(task.status);

  return (
    <Card className="w-full mb-4 overflow-hidden transition-all duration-200 hover:shadow-md animate-fade-in">
      <div className={`h-1 ${statusClass}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{task.nome}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
        </div>
        <CardDescription className="text-sm text-neutral-gray">
          {task.periodicidade.charAt(0).toUpperCase() + task.periodicidade.slice(1)} • Previsão: {formatShortDate(task.dataPrevisao)}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm line-clamp-2">{task.descricao}</p>
        {task.comentarios && (
          <div className="mt-2 p-2 bg-light-gray rounded-md">
            <div className="flex items-center gap-1 text-xs text-neutral-gray">
              <FileText className="h-3 w-3" />
              <span>Nota:</span>
            </div>
            <p className="text-xs mt-1 line-clamp-2">{task.comentarios}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <TooltipProvider>
          <div className="flex space-x-2">
            {/* Concluída */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    task.status === "concluída" ? "bg-green-100 text-green-700" : ""
                  }`}
                  onClick={() => onStatusChange(task.id, "concluída")}
                >
                  <CheckCircle className="h-4 w-4" />
                  {task.status !== "concluída" && <span className="ml-1">Concluída</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Marcar como concluída</p>
              </TooltipContent>
            </Tooltip>

            {/* Andamento */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    task.status === "andamento" ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  onClick={() => onStatusChange(task.id, "andamento")}
                >
                  <RefreshCcw className="h-4 w-4" />
                  {task.status !== "andamento" && <span className="ml-1">Andamento</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Marcar como em andamento</p>
              </TooltipContent>
            </Tooltip>

            {/* Atrasada */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    task.status === "atrasada" ? "bg-red-100 text-red-700" : ""
                  }`}
                  onClick={() => onStatusChange(task.id, "atrasada")}
                >
                  <AlarmClock className="h-4 w-4" />
                  {task.status !== "atrasada" && <span className="ml-1">Atrasada</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Marcar como atrasada</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardFooter>

    </Card>
  );
};

export default TaskCard;
