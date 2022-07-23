require('dotenv').config();
function checkrole(req, res,next) {
    return (res.locals.role==process.env.USER)?res.sendStatus(401):next();
}

module.exports = {checkrole:checkrole}