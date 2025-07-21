import { DataSource } from "typeorm";
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "5520",
    database: "HMS",
    synchronize: true,
    entities: ['src/Entities/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
})