import { Environment } from "../environment";
import { ContextUser } from "../context";
import { log } from "../../../common/logger";

export function throwIfUserDoesNotOwnEnvironment(
  user: ContextUser,
  environment: Environment
) {
  if (
    user.source === environment.userSource &&
    user.email === environment.user
  ) {
    return;
  }

  log.error("User tried to access invalid resource", { user, environment });
  throw new Error(`Environment not found`);
}
