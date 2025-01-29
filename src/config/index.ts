import { config } from "dotenv";
import Joi from "joi";

config();

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(4835),
    ALLOWED_ORIGINS: Joi.string().default("*"),
    DATABASE_URL: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    V1_URL: Joi.string().required(),
    DECRYPT_KEY: Joi.string().required(),
    ENCRYPT_KEY: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

class ServerConfig {

  public V1_URL = envVars.V1_URL;
  public PORT = envVars.PORT;
  public ALLOWED_ORIGINS = envVars.ALLOWED_ORIGINS;
  public DB = {
    URI: envVars.DATABASE_URL,
    PORT: envVars.DB_PORT,
    USER: envVars.DB_USERNAME,
    PASSWORD: envVars.DB_PASSWORD,
    HOST: envVars.DB_HOST,
    NAME: envVars.DB_NAME,
  };

  public JWTKeys = {
    encryptKey: envVars.ENCRYPT_KEY,
    decryptKey: envVars.DECRYPT_KEY,
  };
}

export default new ServerConfig();