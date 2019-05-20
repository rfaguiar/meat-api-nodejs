export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/meat-api',
        authdb: process.env.DB_AUTH || 'admin',
        user: process.env.DB_USER || 'mongoadmin',
        password: process.env.DB_PWD || 'secret'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
};