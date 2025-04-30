
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { QuickNote } from "../types/task";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "../utils/taskUtils";

interface QuickNotesProps {
  notes: QuickNote[];
  onAddNote: (note: QuickNote) => void;
  onDeleteNote: (id: string) => void;
}

const QuickNotes: React.FC<QuickNotesProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: QuickNote = {
        id: generateId(),
        texto: newNote.trim(),
        data: new Date(),
      };
      onAddNote(note);
      setNewNote("");
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Notas Rápidas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancelar" : <Plus className="h-4 w-4 mr-1" />}
            {isAdding ? "" : "Nova Nota"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 space-y-2 animate-fade-in">
            <Textarea
              placeholder="Escreva sua nota aqui..."
              className="resize-none"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddNote}>
                Adicionar
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notes.length === 0 && !isAdding && (
            <p className="text-sm text-neutral-gray text-center py-8">
              Nenhuma nota adicionada ainda. Clique em "Nova Nota" para adicionar.
            </p>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-light-gray rounded-md flex justify-between items-start group"
            >
              <p className="text-sm break-words w-full">{note.texto}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteNote(note.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remover nota</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNotes;
