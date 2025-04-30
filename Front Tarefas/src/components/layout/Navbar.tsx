
import React from "react";
import { CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onAddTask: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddTask }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <CheckCheck className="h-6 w-6 text-bright-blue" />
          <span className="ml-2 font-semibold text-xl">Gerenciador de Atividades</span>
        </div>

        <Button onClick={onAddTask} className="flex items-center gap-1">
          <Plus className="h-5 w-5" />
          <span>Nova Tarefa</span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
