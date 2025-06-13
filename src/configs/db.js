import dotenv from "dotenv"
import { Pool } from "pg"

dotenv.config()

const pool = new Pool({connectionString: process.env.DB_CONNSTR, max:100})
console.log("db on")

export default pool