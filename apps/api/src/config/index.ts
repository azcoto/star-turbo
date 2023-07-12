export default {
  starspaceConnStr: import.meta.env.VITE_DB_STARSPACE_URL,
  starlinkConnStr: import.meta.env.VITE_DB_STARLINK_URL,
  fulfillmentConnStr: import.meta.env.VITE_DB_FULFILLMENT_URL,
  accessTokenSecret: import.meta.env.VITE_ACCESS_TOKEN_SECRET as string,
};
