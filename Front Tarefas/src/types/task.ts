
export type PeriodicityType = "diária" | "semanal" | "mensal" | "personalizada";

export type StatusType = "andamento" | "concluída" | "atrasada";

export interface Task {
  id: string;
  nome: string;
  descricao: string;
  periodicidade: PeriodicityType;
  dataInicio: Date;
  dataPrevisao: Date;
  status: StatusType;
  comentarios: string;
}

export interface QuickNote {
  id: string;
  texto: string;
  data: Date;
}
