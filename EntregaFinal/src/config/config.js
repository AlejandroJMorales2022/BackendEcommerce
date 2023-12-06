
module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  PORT: process.env.PORT,
  URL: process.env.URL,
  PERSISTANCE: process.env.MANAGER_PERSISTANCE,
  ENVIRONMENT: process.env.ENVIRONMENT,
  email:{
      GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
      GMAIL_PASS: process.env.GMAIL_PASS
  },
  SG_MAIL_KEY: process.env.SG_MAIL_KEY,
  JWT_SECRET: process.env.JWT_SECRET
}