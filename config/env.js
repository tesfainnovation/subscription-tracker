import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || "development"}.local`});

// export const PORT = process.env.PORT;
// export const NODE_ENV = process.env.NODE_ENV;
// export const DB_URL = process.env.DB_URL;

export const {
    PORT, NODE_ENV,
     DB_URL,
     JWT_SECRET,
     JWT_EXPIRES_IN,
     ARCJET_ENV, ARCJET_KEY,
     SERVER_URL,
     QSTASH_TOKEN, QSTASH_URL,
     EMAIL_PASSWORD,
} = process.env;

// export const JWT_SECRET = process.env.JWT_SECRET;
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;