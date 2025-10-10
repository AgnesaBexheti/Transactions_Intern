"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const category_1 = require("./src/entities/category");
const expense_1 = require("./src/entities/expense");
const user_1 = require("./src/entities/user");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [category_1.Category, expense_1.Expense, user_1.User],
    synchronize: true,
    logging: false,
});
exports.default = exports.AppDataSource;
