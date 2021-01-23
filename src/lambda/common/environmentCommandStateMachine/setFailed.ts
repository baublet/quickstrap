import { EnvironmentCommandStateMachineReturn } from ".";
import { log } from "../../../common/logger";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
  environment as envEntity,
} from "../entities";

interface SetFailedArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function setFailed({
  trx,
  environment,
  environmentCommand,
}: SetFailedArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "running") {
    return {
      errors: ["Cannot set a command status to failed if it's not yet running"],
      operationSuccess: false,
    };
  }

  const updatedCommand = await envCommandEntity.update(
    trx,
    environmentCommand.id,
    {
      status: "failed",
    }
  );

  // Here, we might only set subsequent jobs to cancelled conditionally when
  // we support that feature.
  const commands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );
  await Promise.all(
    commands.map((command) => {
      if (command.order <= updatedCommand.order) {
        // Don't update commands _prior_ to this one
        return;
      }
      if (command.status === "waiting") {
        return envCommandEntity.update(trx, command.id, {
          status: "cancelled",
        });
      }
    })
  );

  await enqueueJob(trx, "getEnvironmentCommandLogs", {
    environmentCommandId: environmentCommand.commandId,
  });

  log.debug("Updated environment command to failed", {
    environment: environment.name,
    status: environment.lifecycleStatus,
    updatedCommand,
  });

  await envEntity.resetProcessorByEnvironmentId(trx, environment.id);

  return {
    errors: [],
    operationSuccess: true,
  };
}
