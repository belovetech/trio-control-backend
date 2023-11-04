export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  databaseConfig: {
    common: {
      database: process.env.DEV_DATABASE_NAME,
    },
    development: {
      host: process.env.DEV_DATABASE_HOST,
      port: parseInt(process.env.DEV_DATABASE_PORT, 10) || 5432,
      username: process.env.DEV_DATABASE_USERNAME,
      password: process.env.DEV_DATABASE_PASSWORD,
    },
    production: {
      host: process.env.PROD_DATABASE_HOST,
      port: parseInt(process.env.PROD_DATABASE_PORT, 10) || 5432,
      username: process.env.PROD_DATABASE_USERNAME,
      password: process.env.PROD_DATABASE_PASSWORD,
      connectString: process.env.DATABASE_URL,
      database: process.env.PROD_DATABASE_NAME,
    },
  },
});
