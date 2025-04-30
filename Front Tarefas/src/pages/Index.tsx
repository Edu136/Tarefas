
import React, { useState, useEffect } from "react";
import { Task, StatusType, QuickNote } from "../types/task";
import { getTasks, isTaskOverdue ,getNotas} from "../utils/taskUtils";
import { useToast } from "@/hooks/use-toast";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import TaskModal from "../components/modals/TaskModal";
import CalendarView from "../components/CalendarView";
import TaskManager from "../components/TaskManager";
import ViewSelector from "../components/ViewSelector";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [filter, setFilter] = useState<StatusType | "todas">("todas");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [view, setView] = useState<"lista" | "calendario">("lista");
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  // Initialize with mock data
  useEffect(() => {
    (async () => {
      const initialTasks = await getTasks();
      // Check for overdue tasks
      const updatedTasks = initialTasks.map((task) => {
        if (isTaskOverdue(task)) {
          return { ...task, status: "atrasada" as StatusType };
        }
        return task;
      });
      setTasks(updatedTasks);
    })();

    // Initialize with some mock quick notes
    (async () => {
      const notes = await getNotas();
      notes.forEach(note => {
        note.id = note.id.toString();
      })
      setQuickNotes(notes);
    })();
  }, []);

  // Calculate counts for sidebar
  const counts = {
    todas: tasks.length,
    andamento: tasks.filter(task => task.status === "andamento").length,
    concluída: tasks.filter(task => task.status === "concluída").length,
    atrasada: tasks.filter(task => task.status === "atrasada").length,
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: StatusType) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    
    const taskName = tasks.find(task => task.id === id)?.nome;
    const response =  await fetch(`http://localhost:3000/tarefas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      toast({
        title: "Erro ao atualizar status",
        description: "Houve um erro ao tentar atualizar o status da tarefa",
      });
      console.error("Error updating task status:", response);
      return;
    }
    setTasks(updatedTasks);
    toast({
      title: `Tarefa ${status}`,
      description: `"${taskName}" foi marcada como ${status}`,
    });
  };

  // Handle task creation and update
  const  handleSaveTask = async (task: Task) => {
    const isNewTask = !tasks.find(t => t.id === task.id);
    
    if (isNewTask) {
      setTasks([...tasks, task]);
      const response = await fetch(`http://localhost:3000/tarefas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) {
        toast({
          title: "Erro ao criar tarefa",
          description: "Houve um erro ao tentar criar a tarefa",
        });
        console.error("Error creating task:", response.statusText);
        return;
      }

      toast({
        title: "Tarefa criada",
        description: `"${task.nome}" foi criada com sucesso`,
      });
    } else {
      const response = await fetch(`http://localhost:3000/tarefas/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      if (response.ok){
        toast({
          title: "Tarefa atualizada",
          description: `"${task.nome}" foi atualizada com sucesso`,
        });
        return;
      }
      if(response.status === 304){
        toast({
          title: "Nenhuma alteração foi realizada",
          description: "Devido não ter nenhuma alteração na tarefa",
        });
        setIsTaskModalOpen(false);
        return;
      }
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Houve um erro ao tentar atualizar a tarefa",
      });
      
      console.error("Error updating task:", response);
      setIsTaskModalOpen(false);
    }
  };

  const handleDeleteTask = async (id: string) => {

    setTasks(tasks.filter(task => task.id !== id));
    const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if(response.ok) {
      toast({
        title: "Tarefa removida",
        description: `"${currentTask?.nome}" foi removida com sucesso`,
      });
      setIsTaskModalOpen(false);
      console.log("Task deleted:", id);
      return;
    }

    toast({
      title: "Erro ao remover tarefa",
      description: "Houve um erro ao tentar remover a tarefa",
    });
    console.error("Error deleting task:", response.statusText);
    setIsTaskModalOpen(false);
  };
  
  
  // Open task modal for editing
  const handleEditTask = (task: Task) => {
    
    setCurrentTask({
      ...task,
      dataInicio: new Date(task.dataInicio),
      dataPrevisao: new Date(task.dataPrevisao),
    });
    
    setIsTaskModalOpen(true);
    
  };

  // Open task modal for creating
  const handleOpenCreateModal = () => {
    setCurrentTask(undefined);
    setIsTaskModalOpen(true);
  };

  // Handle adding a new quick note
  const handleAddNote = async (note: QuickNote) => {
    setQuickNotes([...quickNotes, note]);
    const response = await fetch(`http://localhost:3000/notas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "texto": note.texto,
      }),
      })
    if (!response.ok) {
      toast({
        title: "Erro ao adicionar nota",
        description: "Houve um erro ao tentar adicionar a nota",
      });
      return;
    }
    toast({
      title: "Nota adicionada",
      description: "Sua nota rápida foi adicionada com sucesso",
    });
  };

  // Handle deleting a quick note
  const handleDeleteNote = async (id: string) => {
    setQuickNotes(quickNotes.filter(note => note.id !== id));
    const response = await fetch(`http://localhost:3000/notas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      toast({
        title: "Erro ao remover nota",
        description: "Houve um erro ao tentar remover a nota",
      });
      return;
    }
    toast({
      title: "Nota removida",
      description: "Sua nota rápida foi removida com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddTask={handleOpenCreateModal} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with filters */}
          <Sidebar 
            filter={filter} 
            onFilterChange={setFilter} 
            counts={counts} 
          />
          
          {/* Main content area */}
          <div className="flex-1">
            {/* View toggle and title */}
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Gerenciador de Tarefas</h1>
              <ViewSelector view={view} setView={setView} />
            </div>

            {view === "lista" ? (
              <TaskManager 
                tasks={tasks}
                quickNotes={quickNotes}
                filter={filter}
                setFilter={setFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                counts={counts}
                onStatusChange={handleStatusChange}
                onEditTask={handleEditTask}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            ) : (
              <CalendarView
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                statusFilter={filter}
                onStatusFilterChange={setFilter}
              />
            )}
          </div>
        </div>
      </div>

      {/* Task modal for creating/editing tasks */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={currentTask}
        title={currentTask ? "Editar Tarefa" : "Criar Nova Tarefa"}
      />
    </div>
  );
};

export default Index;
