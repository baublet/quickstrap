import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getById(
  trx: ConnectionOrTransaction,
  commandId: string,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand | undefined> {
  const found = await trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("id", "=", commandId)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
