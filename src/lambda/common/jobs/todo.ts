import { Job } from "./index";
import { Transaction } from "../db";

export async function todo(
  trx: Transaction,
  processor: string
): Promise<Job | undefined> {
  const found = await trx<Job>("jobs")
    .select()
    .where({
      status: "ready",
    })
    .limit(1);

  if (found.length === 0) {
    return undefined;
  }

  const jobToDo = found[0];
  await trx<Job>("jobs")
    .update({ status: "working", processor })
    .where({ id: jobToDo.id })
    .limit(1);

  trx.commit();

  return jobToDo;
}
