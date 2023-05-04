const crypto = require('crypto');

module.exports = {
    /**
     * String 加密为 MD5
     * @param {*} text 字符串
     * @returns MD5串
     */
    md5: function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    }
}
