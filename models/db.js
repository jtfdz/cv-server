const config = require('./config');
const pgp = require('pg-promise')();
pgp.pg.defaults.ssl = true;
const db = pgp(config.dbUrl);
// let pool = new pg.Pool({
//     user: 'admin',
//     database: 'dev',
//     password: 'password',
//     host: 'localhost',
//     port: 5432,
//     max: 10
// });


module.exports = db;