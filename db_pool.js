import pg from 'pg';

const pool = new pg.Pool({
    // connectionString: process.env.DATABASE_URL,
    user: process.env.DATABASE_USER,
    host: 'localhost',
    database: 'user_records',
    port:5432
    // ssl:process.env.DATABASE_URL ? true : false
});

export default pool;