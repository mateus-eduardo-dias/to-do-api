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
            client.release();
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        } else{
            const rVal = await client.query(`INSERT INTO users (username, method, password) VALUES ('${username}', ${method}, '${passhash}') RETURNING *`);
            client.release();
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        }
    },
    async createTask(userId, name, description){
        const client = await db.connect();
        if (description == null){
            const rVal = await client.query(`INSERT INTO todo (user_id, name) VALUES (${userId}, '${name}') RETURNING *`);
            client.release();
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        } else {
            const rVal = await client.query(`INSERT INTO todo (user_id, name, description) VALUES (${userId}, '${name}', '${description}') RETURNING *`);
            client.release();
            return {rowCount: rVal.rowCount, rows: rVal.rows};
        }
    },
    async findTaskById(id){
        const client = await db.connect();
        const rVal = await client.query(`SELECT * FROM todo WHERE todo_id = ${id}`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows};
    },
    async updateTaskName(id, value){
        const client = await db.connect();
        const rVal = await client.query(`UPDATE todo SET name = '${value}' WHERE todo_id = ${id} RETURNING *`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows}
    },
    async updateTaskDescription(id, value){
        const client = await db.connect();
        const rVal = await client.query(`UPDATE todo SET description = '${value}' WHERE todo_id = ${id} RETURNING *`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows}
    },
    async updateTaskStatus(id, value){
        const client = await db.connect();
        const rVal = await client.query(`UPDATE todo SET status = ${value} WHERE todo_id = ${id} RETURNING *`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows}
    },
    async getTasksByUserId(id){
        const client = await db.connect();
        const rVal = await client.query(`SELECT * FROM todo WHERE user_id = ${id}`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows}
    },
    async deleteTaskById(id){
        const client = await db.connect();
        const rVal = await client.query(`DELETE FROM todo WHERE todo_id = ${id}`);
        client.release();
        return {rowCount: rVal.rowCount, rows: rVal.rows}
    }
}