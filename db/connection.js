const mysql = require('mysql')
const dbConfig = require('../config/db-config.json')

module.exports = {
    //数据库配置
    config: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database
    },
    //连接数据库
    //连接池方法
    sqlConnect: function (sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('连接失败')
                return
            }
            //事件驱动回调
            conn.query(sql, sqlArr, callBack)
            conn.release()
        })
    },

    //异步连接池
    //promise 回调
    SySqlConnect: function (sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config)
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err)
                }
                else {
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(data)
                        }
                    })
                    conn.release()
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }
}