import dotenv from "dotenv";
dotenv.config();

export const Port: number = Number(process.env.PORT) || 3000;

export const NodeEnv: string = process.env.NODE_ENV || "development";

export const DBHost: string = process.env.DB_HOST || "localhost";
export const DBPort: number = Number(process.env.DB_PORT) || 3306;
export const DBUser: string = process.env.DB_USER || "root";
export const DBPassword: string = process.env.DB_PASSWORD || "";
export const DBName: string = process.env.DB_NAME || "ecommerce_db";

export const JwtSecret: string = process.env.JWT_SECRET || "dev_secret_change_me";
export const JwtExpiresIn: string = process.env.JWT_EXPIRES_IN || "1h";

export const SwaggerTitle: string = process.env.SWAGGER_TITLE || "eCommerce API";
export const SwaggerVersion: string = process.env.SWAGGER_VERSION || "1.0.0";