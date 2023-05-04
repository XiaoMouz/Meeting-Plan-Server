let ResponseBody = class {
    /**
     * 响应体
     * @param {*} code 响应代码
     * @param {*} msg 响应消息
     * @param {*} data 响应数据 默认为空
     */
    constructor(code, msg, data = null) {
        this.code = code
        this.msg = msg
        this.data = data

    }
}
module.exports = ResponseBody