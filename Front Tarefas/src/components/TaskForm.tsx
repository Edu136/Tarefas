
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Task, PeriodicityType } from "../types/task";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { generateId } from "../utils/taskUtils";
import { on } from "events";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  initialData?: Task;
  onCancel: () => void;
  onDelete: (id:string) => void;
}

const periodicityOptions: { value: PeriodicityType; label: string }[] = [
  { value: "diária", label: "Diária" },
  { value: "semanal", label: "Semanal" },
  { value: "mensal", label: "Mensal" },
  { value: "personalizada", label: "Personalizada" },
];

const taskSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  periodicidade: z.enum(["diária", "semanal", "mensal", "personalizada"]),
  dataInicio: z.date({
    required_error: "Uma data de início é necessária",
  }),
  dataPrevisao: z.date({
    required_error: "Uma data de previsão é necessária",
  }),
  comentarios: z.string().optional(),
});

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
  onDelete,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          nome: initialData.nome,
          descricao: initialData.descricao,
          periodicidade: initialData.periodicidade,
          dataInicio: initialData.dataInicio,
          dataPrevisao: initialData.dataPrevisao,
          comentarios: initialData.comentarios,
        }
      : {
          nome: "",
          descricao: "",
          periodicidade: "semanal",
          dataInicio: new Date(),
          dataPrevisao: new Date(),
          comentarios: "",
        },
  });

  const handleSubmit = (values: z.infer<typeof taskSchema>) => {
    const task: Task = {
      id: initialData?.id || generateId(),
      nome: values.nome,
      descricao: values.descricao,
      periodicidade: values.periodicidade,
      dataInicio: values.dataInicio,
      dataPrevisao: values.dataPrevisao,
      status: initialData?.status || "andamento",
      comentarios: values.comentarios || "",
    };
    
    onSubmit(task);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Insira o nome da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Insira uma descrição detalhada"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="periodicidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodicidade</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {periodicityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataPrevisao"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Prevista</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comentarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentários/Anotações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione comentários ou instruções específicas"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          {initialData && (
            <Button type="button" onClick={() => onDelete(initialData.id)}>
              Deletar
            </Button> 
          )}
          <Button type="submit">
            {initialData ? "Atualizar Tarefa" : "Criar Tarefa"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
