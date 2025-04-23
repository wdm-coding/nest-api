import * as Joi from 'joi'
const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DB_TYPE: Joi.string().valid('mysql', 'postgres').required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  LOG_ON: Joi.boolean().default(true),
  LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info')
})
export default validationSchema
