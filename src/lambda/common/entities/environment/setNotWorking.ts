import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function setNotWorking(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  const results = await trx<Environment>("environments")
    .update({ updated_at: trx.fn.now(), working: false })
    .where({ id })
    .limit(1)
    .returning("*");

  return results[0];
}
