
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { StatusType } from "../types/task";
import { format, endOfWeek, endOfMonth, addDays, startOfWeek, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  statusFilter: StatusType | "todas";
  onStatusFilterChange: (filter: StatusType | "todas") => void;
  dateRange: { start: Date | undefined; end: Date | undefined };
  onDateRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  view: "lista" | "calendario";
}

const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  view,
}) => {
  const [dateFilterType, setDateFilterType] = useState<string>("todas");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateFilterChange = (type: string) => {
    setDateFilterType(type);
    
    const today = new Date();
    
    switch (type) {
      case "hoje":
        onDateRangeChange({ start: today, end: today });
        break;
      case "semana":
        onDateRangeChange({
          start: startOfWeek(today, { locale: ptBR }),
          end: endOfWeek(today, { locale: ptBR }),
        });
        break;
      case "mes":
        onDateRangeChange({
          start: startOfMonth(today),
          end: endOfMonth(today),
        });
        break;
      case "proximos7":
        onDateRangeChange({
          start: today,
          end: addDays(today, 7),
        });
        break;
      case "personalizado":
        setIsCalendarOpen(true);
        break;
      case "todas":
      default:
        onDateRangeChange({ start: undefined, end: undefined });
        break;
    }
  };

  // Format the date range for display
  const formatDateRange = () => {
    if (!dateRange.start) {
      return "Todas as datas";
    }
    
    if (!dateRange.end || dateRange.start.getTime() === dateRange.end.getTime()) {
      return format(dateRange.start, "dd 'de' MMMM", { locale: ptBR });
    }
    
    return `${format(dateRange.start, "dd/MM", { locale: ptBR })} - ${format(dateRange.end, "dd/MM", { locale: ptBR })}`;
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {view === "lista" && (
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as StatusType | "todas")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as tarefas</SelectItem>
              <SelectItem value="andamento">andamentos</SelectItem>
              <SelectItem value="concluída">Concluídas</SelectItem>
              <SelectItem value="atrasada">Atrasadas</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <div className="flex flex-wrap gap-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <ToggleGroup type="single" value={dateFilterType} onValueChange={handleDateFilterChange}>
                  <ToggleGroupItem value="todas" size="sm">Todas</ToggleGroupItem>
                  <ToggleGroupItem value="hoje" size="sm">Hoje</ToggleGroupItem>
                  <ToggleGroupItem value="semana" size="sm">Esta semana</ToggleGroupItem>
                  <ToggleGroupItem value="mes" size="sm">Este mês</ToggleGroupItem>
                  <ToggleGroupItem value="proximos7" size="sm">Próximos 7 dias</ToggleGroupItem>
                  <ToggleGroupItem value="personalizado" size="sm">Personalizado</ToggleGroupItem>
                </ToggleGroup>
              </div>
              {dateFilterType === "personalizado" && (
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.start,
                    to: dateRange.end,
                  }}
                  onSelect={(range) => {
                    onDateRangeChange({
                      start: range?.from,
                      end: range?.to,
                    });
                  }}
                  locale={ptBR}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
