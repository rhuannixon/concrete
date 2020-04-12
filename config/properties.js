require('dotenv/config');

module.exports = {
    database: {
        dev: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
            host: process.env.DB_HOST,
        },
        test: {
            username: process.env.DB_TEST_USERNAME,
            password: process.env.DB_TEST_PASSWORD,
            name: process.env.DB_TEST_NAME,
            host: process.env.DB_TEST_HOST
        }
    },
    clear_db_url: process.env.CLEARDB_DATABASE_URL,
    token_secrete: process.env.TOKEN_SECRETE,
    token_expires: process.env.TOKEN_EXPIRES || 3600,
    node_env: process.env.NODE_ENV
}