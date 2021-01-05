import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getByCommandId(
  trx: ConnectionOrTransaction,
  commandId: string | number,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand | undefined> {
  const found = await trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("commandId", "=", commandId)
    .andWhere("environmentDeleted", "=", false)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
