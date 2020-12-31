require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { getBySecret } from "./common/environment";
import { getProvisionScript } from "../provisionerV1/getProvisionScript";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const db = getDatabaseConnection();
  const secret = event.queryStringParameters.secret;
  const subdomain = event.queryStringParameters.subdomain;

  if (!secret) {
    log.error("getProvisioningScript did not receive a secret");
    return {
      statusCode: 403,
    };
  }

  // Check if the environment exists
  const environment = await getBySecret(db, secret);

  if (!environment || environment.subdomain !== subdomain) {
    log.error(
      `getProvisioningScript received invalid environment subdomain (not found)`,
      { secret }
    );
    return {
      statusCode: 404,
    };
  }

  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `getProvisioningServer request received for environment that's not in the proper status`,
      { environment }
    );
    return {
      statusCode: 400,
    };
  }

  return {
    statusCode: 200,
    body: await getProvisionScript(environment),
  };
};