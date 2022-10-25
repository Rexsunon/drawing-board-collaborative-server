import { Sequelize } from 'sequelize';
import 'dotenv/config';

const database = process.env.NODE_ENV == 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME;

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    // multipleStatements: true,
    logging: false,
    dialect: "postgres"
});

const createDBconnection = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        logger.info(`Connected to ${process.env.NODE_ENV} database.`);
    } catch (error: any) {
        console.log({
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            // multipleStatements: true,
            logging: false,
            dialect: "postgres"
        });
        logger.error('Unable to connect to the database:', error);
    }
};
createDBconnection();
