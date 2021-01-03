export interface EnvironmentCommand {
  id: number;
  adminOnly: boolean;
  environmentId: number;
  commandId: string;
  command: string;
  title: string;
  status: "waiting" | "running" | "failure" | "success";
  logs?: string;
}

export { create } from "./create";
export { getByEnvironmentId } from "./getByEnvironmentId";
export { getByCommandId } from "./getByCommandId";
export { update } from "./update";
export { createMany } from "./createMany";
