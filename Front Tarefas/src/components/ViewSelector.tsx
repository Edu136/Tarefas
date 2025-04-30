
import React from "react";

interface ViewSelectorProps {
  view: "lista" | "calendario";
  setView: (view: "lista" | "calendario") => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ view, setView }) => {
  return (
    <div className="flex bg-light-gray rounded-lg p-1">
      <button
        className={`px-4 py-2 text-sm rounded-md transition-colors ${
          view === "lista" ? "bg-white shadow-sm" : ""
        }`}
        onClick={() => setView("lista")}
      >
        Lista
      </button>
      <button
        className={`px-4 py-2 text-sm rounded-md transition-colors ${
          view === "calendario" ? "bg-white shadow-sm" : ""
        }`}
        onClick={() => setView("calendario")}
      >
        Calendário
      </button>
    </div>
  );
};

export default ViewSelector;
