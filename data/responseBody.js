let ResponseBody = class {
    constructor(code, msg, data = null) {
        this.code = code
        this.msg = msg
        this.data = data

    }
}
module.exports = ResponseBody