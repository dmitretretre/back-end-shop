const { Pool } = require("pg");

const user = "postgres";
const password = "starrycat48!";
const host = "localhost";
const port = 5432;
const database = "Tretyak-Dmitry-ISIP-2-21";

const connectionString =
	"postgres://${user}:${password}@${host}:${port}/${database}";

const pool = new Pool({});

module.exports = pool;
