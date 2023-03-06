const crypto = require('crypto');

module.exports = {
    md5: function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    }
}
