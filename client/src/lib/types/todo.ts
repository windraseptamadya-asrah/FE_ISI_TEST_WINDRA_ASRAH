export type Todo = {
  id: number;
  title: string;
  status: string;
  assignedTo?: number;
  createdAt: string | Date;
  createdBy: number;
  updatedAt: string | Date;
  assignedToId?: number;
  createdById: number;
  description?: string;
  deadline: string | Date;
  assigned_to_name?: string;
  created_by_name: string;
};