const config = require('./config');
const pgp = require('pg-promise')();
pgp.pg.defaults.ssl = true;
const db = pgp(config.dbUrl);

module.exports = db;