import db from "../configs/db.js";
import argon from "argon2";

export default {
    async findUserById(id){
        const client = await db.connect();
        const rVal = await client.query(`SELECT * FROM users WHERE id = ${id}`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows};
    },
    async findUserByName(username){
        const client = await db.connect();
        const rVal = await client.query(`SELECT * FROM users WHERE username = '${username}'`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows};
    },
    async createUser(username, password, method){
        const client = await db.connect();
        const passhash = await argon.hash(password);
        if (method == undefined){
            const rVal = await client.query(`INSERT INTO users (username, password) VALUES ('${username}', '${passhash}') RETURNING *`);
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        } else{
            const rVal = await client.query(`INSERT INTO users (username, method, password) VALUES ('${username}', ${method}, '${passhash}') RETURNING *`);
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        }
    }
}