const mysql = require('mysql')
const dbConfig = require('../config/db-config.json')

let Module = class {
    constructor(tableName) {
        this.config = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database
        }
        this.tableName = tableName
    }

    // 连接数据库
    // 连接池方法
    sqlConnect(sql, sqlArr, callBack) {
        const pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {
                console.log(err)
                return
            }
            err = null
            // 事件驱动回调
            conn.query(sql, sqlArr, callBack)
            conn.release()
        })
    }

    // Insert a function
     insert(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        } 
        const sql = `insert into ${this.tableName} set ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    update(sqlArr, callBack, where = null) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        if (where != null) {
            const sql = `update ${this.tableName} set ? where ?`
            this.sqlConnect(sql, [sqlArr, where], callBack)
            return
        }
        const sql = `update ${this.tableName} set ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    search(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        if (sqlArr === null || Object.keys(sqlArr).length === 0) {
            const sql = `select * from ${this.tableName}`
            this.sqlConnect(sql, sqlArr, callBack)
            return
        }
        const sql = `select * from ${this.tableName} where ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    delete(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        const sql = `delete from ${this.tableName} where ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    exec(sql, sqlArr, callBack) {
        this.sqlConnect(sql, sqlArr, callBack)
    }
}
module.exports = Module