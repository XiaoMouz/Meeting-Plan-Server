const mysql = require('mysql')
const dbConfig = require('../config/db-config.json')

let Module = class {
    /**
     * 初始化 Database Model
     * @param {*} tableName 需要操作的表名 
     */
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

    // Connect to database
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

    /**
     * 插入数据
     * @param {*} sqlArr 插入的参数
     * @param {*} callBack 回调参数
     */
    insert(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        const sql = `insert into ${this.tableName} set ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    /**
     * 更新数据
     * @param {*} sqlArr 更新的参数
     * @param {*} where 需要更新的数据条件
     * @param {*} callBack 回调函数
     * @returns 
     */
    update(sqlArr, where = null, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        if (where != null) {
            const sql = `update ${this.tableName} set ? where ?`
            this.sqlConnect(sql, [sqlArr, where], callBack)
            return
        }
        const sql = `update ${this.tableName} set ? limit 1`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    /**
     * 搜索数据
     * @param {*} sqlArr 搜索条件
     * @param {*} callBack 回调函数
     * @returns 
     */
    search(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        if (sqlArr === null || Object.keys(sqlArr).length === 0) {
            const sql = `select * from ${this.tableName}`
            this.sqlConnect(sql, sqlArr, callBack)
            return
        }
        const sql = `select * from ${this.tableName} where ? `
        this.sqlConnect(sql, sqlArr, callBack)
    }

    searchOne(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        if (sqlArr === null || Object.keys(sqlArr).length === 0) {
            const sql = `select * from ${this.tableName}`
            this.sqlConnect(sql, sqlArr, callBack)
            return
        }
        const sql = `select * from ${this.tableName} where ? limit 1`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    /**
     * 硬删除数据
     * @param {*} sqlArr 删除条件
     * @param {*} callBack 回调函数
     */
    hardDelete(sqlArr, callBack) {
        if (!typeof sqlArr === 'object' || Array.isArray(sqlArr)) {
            throw new Error('sqlArr must be an object')
        }
        const sql = `delete from ${this.tableName} where ?`
        this.sqlConnect(sql, sqlArr, callBack)
    }

    /**
     * 自定义函数
     * @param {*} sql  sql语句
     * @param {*} sqlArr sql参数
     * @param {*} callBack 回调函数
     */
    exec(sql, sqlArr, callBack) {
        this.sqlConnect(sql, sqlArr, callBack)
    }
}
module.exports = Module