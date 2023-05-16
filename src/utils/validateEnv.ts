import Joi from 'joi';

const validateEnv = () => {
  const env = {
    SERVICE_PORT: Number(process.env.SERVICE_PORT),
    MONGODB_USERNAME: process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    MONGODB_DBNAME: process.env.MONGODB_DBNAME,
    MONGODB_HOST: process.env.MONGODB_HOST,
    APP_SECRET: process.env.APP_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD
  };

  const validationSchema = Joi.object({
    SERVICE_PORT: Joi.number().required(),
    MONGODB_USERNAME: Joi.string().required(),
    MONGODB_PASSWORD: Joi.string().required(),
    MONGODB_DBNAME: Joi.string().required(),
    MONGODB_HOST: Joi.string().required(),
    APP_SECRET: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required()
  });

  const { error } = validationSchema.validate(env);

  if (error) {
    throw new Error(`Env validation error: ${error.message}`);
  }
};

export default validateEnv;
