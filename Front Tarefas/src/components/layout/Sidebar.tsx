
import React from "react";
import { StatusType } from "../../types/task";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck, Clock, AlertCircle } from "lucide-react";

interface SidebarProps {
  filter: StatusType | "todas";
  onFilterChange: (filter: StatusType | "todas") => void;
  counts: {
    andamento: number;
    concluída: number;
    atrasada: number;
    todas: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ filter, onFilterChange, counts }) => {
  const filters: { value: StatusType | "todas"; label: string; icon: React.ReactNode }[] = [
    {
      value: "todas",
      label: "Todas as Tarefas",
      icon: <div className="w-4 h-4" />,
    },
    {
      value: "andamento",
      label: "Em andamento",
      icon: <div className="w-3 h-3 rounded-full bg-sky-blue" />,
    },
    {
      value: "concluída",
      label: "Concluídas",
      icon: <CircleCheck className="h-4 w-4 text-green-500" />,
    },
    {
      value: "atrasada",
      label: "Atrasadas",
      icon: <AlertCircle className="h-4 w-4 text-alert-red" />,
    },
  ];

  return (
    <aside className="w-full lg:w-64 p-4">
      <div className="space-y-1">
        {filters.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal h-11",
              filter === item.value && "bg-light-gray font-medium"
            )}
            onClick={() => onFilterChange(item.value)}
          >
            <span className="flex items-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </span>
            <span className="ml-auto bg-neutral-gray/10 px-2 py-0.5 rounded text-xs text-neutral-gray">
              {counts[item.value]}
            </span>
          </Button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
