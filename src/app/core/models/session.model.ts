export interface Session {
  sessionId: number;
  menuId: number;
  sessionName: string;
  path: string;
  icon: string;
  createdAt: Date;
  updatedAt?: Date;
}
