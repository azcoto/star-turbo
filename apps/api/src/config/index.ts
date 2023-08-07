import 'dotenv/config';

export default {
  nodeEnv: process.env.NODE_ENV,
  starspaceConnStr: process.env.DB_STARSPACE_URL,
  starlinkConnStr: process.env.DB_STARLINK_URL,
  fulfillmentConnStr: process.env.DB_FULFILLMENT_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  appSecret: process.env.APP_SECRET as string,
};
