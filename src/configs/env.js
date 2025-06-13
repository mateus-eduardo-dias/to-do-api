import dotenv from "dotenv"

dotenv.config()

export default {
    JWT_AUTH_KEY: process.env.JWT_AUTH_KEY,
    JWT_ISS: process.env.JWT_ISS,
    DB_CONNSTR: process.env.DB_CONNSTR
}