import pg from 'pg';

const pool = new pg.Pool({
    user: process.env.DATABASE_USER,
    host: 'localhost',
    database: 'eckerman_user_records',
    port:5432
});

export default pool;