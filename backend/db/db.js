/**
 * Модуль для создания объекта, с помощью которого выполняются операции с базой данных
 */
import sqlite3 from 'sqlite3'

// Имя файла базы данных, можно указать путь к файлу (если он должен быть расположен не в корне проекта)
const dbsource = 'db.sqlite'

// Создание объекта для работы с базой данных
// Функция обратного вызова запускается при создании объекта
// с ее помощью формируется структура базы данных
const db = new sqlite3.Database(dbsource, err => {

    // обработка ошибки подключения к базе данных
    if(err) {
        console.error(err.message)
        throw err
    }

    // создание таблицы category (категории товаров)
    db.run(`CREATE TABLE IF NOT EXISTS category (
        id integer primary key autoincrement,
        name text unique
    )`, err => {
        if(!err) {
            console.log('Table Category created')
        }
    })

    // создание таблицы product (товары)
    db.run(`CREATE TABLE IF NOT EXISTS product (
        id integer primary key autoincrement,
        name text unique,
        price integer,
        description text,
        promotion boolean default false

    )`, err => {
        if(!err) {
            console.log('Table Product created')
        }
    })

    // создание таблицы product_category (связь товара и категории)
    // один товар может находиться в разных категориях
    db.run(`CREATE TABLE IF NOT EXISTS product_category (
        id integer primary key autoincrement,
        product_id integer REFERENCES product(id),
        category_id integer REFERENCES category(id),
        UNIQUE(product_id, category_id)
    )`, err => {
        if(!err) {
            console.log('Table ProductCategory created')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS cart(
        cart_id integer primary key autoincrement,
        user_id integer,
        product_id integer NOT NULL REFERENCES product(id)
    )`, err => {
        if(!err) {
            console.log('Table Cart created')
        }
    })
})

export default db