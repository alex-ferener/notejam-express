const dbHost = process.env.DB_HOST
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.NODE_ENV === 'test' ? 'test' : process.env.DB_NAME;

module.exports = {
  partial_dsn: `mysql://${dbUsername}:${dbPassword}@${dbHost}`,
  dsn: `mysql://${dbUsername}:${dbPassword}@${dbHost}/${dbName}`
}
