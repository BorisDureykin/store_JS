import express from 'express'
import db from './db/db.js'
import bodyParser from 'body-parser'

// экземпляр приложения
const app = express()

// промежуточное ПО (middleware) для обработки тела запроса и ответа
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

// обработка корневого маршрута для тестирования запуска приложения !!!!
app.get('/', (req, res) => {
    res.json({
        message: 'Ok'
    })
})

// обработка маршрута для получения списка категорий !!!!
app.get('/api/v1/category', (req, res) => {
    // подготовка SQL-запроса
    const sql = `SELECT * FROM category`
    // выполнение запроса для получения всех строк результата
    db.all(sql, [], (err, rows) => {

        // обработка ошибки в процессе выполнения запроса
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return
        }
        // отправка ответа с результатом выполнения запроса
        res.json({

            data: rows
        })
    })
})

// обработка маршрута для получения данных по конкретной категории (по идентификатору) !!!!
app.get('/api/v1/category/:id', (req, res) => {
    const sql = `SELECT * FROM category WHERE id = ?`
    // выполнение запроса с получением одной строки результата
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(404).json({
                error: err.message
            })
            return
        }
        res.json({
            data: row
        })
    })
})

// обработка маршрута для создания новой категории// данные новой категории передаются в теле запроса!!!!
app.post('/api/v1/category', (req, res) => {
    const errors = []// обработка ошибок
    if (!req.body.name) {
        errors.push('No name category')
    }
    if (errors.length) {
        res.status(400).json({
            error: errors.join(', ')
        })
        return
    }
    const sql = `INSERT INTO category (name) VALUES (?)`
    const params = [req.body.name]

     // Проверяем уникальное ограничение на поле name перед добавлением категории
    const uniqueCheckSql = `SELECT id FROM category WHERE name = ? LIMIT 1`
    db.get(uniqueCheckSql, [req.body.name], (err, row) => {
        if (err) {
            res.status(500).json({
                error: 'Internal server error'
            })
            return
        }
        if (row) {
            // Если категория с таким именем уже существует, возвращаем ошибку
            res.status(400).json({
                error: 'Category with the same name already exists'
            })
            return
        }

    db.run(sql, params, function (err) { // выполнение запроса без получения результата
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        res.json({// для получения идентификатора созданого объекта используется контекст this и его свойство lastID
            id: this.lastID,
            name: req.body.name
            })
        })
    })
})

// обработка маршрута для изменения категории !!!!
app.put('/api/v1/category/:id', (req, res) => {
    const errors = []
    if (!req.body.name) {
        errors.push('No name category')
    }
    if (errors.length) {
        res.status(400).json({
            error: errors.join(', ')
        })
        return
    }
    const sql = `UPDATE category SET name = ? WHERE id = ?`
    const params = [req.body.name, req.params.id]
    // Проверяем уникальное ограничение на поле name перед изменением категории
    const uniqueCheckSql = `SELECT id FROM category WHERE name = ? LIMIT 1`
    db.get(uniqueCheckSql, [req.body.name], (err, row) => {
        if (err) {
            res.status(500).json({
                error: 'Internal server error'
            })
            return
        }
        if (row) {
            // Если категория с таким именем уже существует, возвращаем ошибку
            res.status(400).json({
                error: 'Category with the same name already exists'
            })
            return
        }

    db.run(sql, params, (err) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        res.json({
            id: req.params.id,
            name: req.body.name
            })
        })
    })
})

// обработка маршрута для удаления категории по идентификатору !!!!
app.delete('/api/v1/category/:id', (req, res) => {
    const sql = `DELETE FROM category WHERE id = ?`
    const params = [req.params.id]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        res.json({
            id: req.params.id
        })
    })
})

// обработка маршрута для получения списка всех товаров !!!!
app.get('/api/v1/product', (req, res) => {
    const sql = `SELECT * FROM product`
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return
        }
        res.json({
            data: rows
        })
    })
})

// обработка маршрута для получения списка товаров участвующих в акции !!!!
app.get('/api/v1/product/promotion', (req, res) => {
    const sql = `SELECT * FROM product WHERE promotion = ?`
    const params = 'true'
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return
        }
        res.json({
            data: rows
        })
    })
})

// обработка маршрута для получения списка товаре находящихся в категории !!!!
app.get('/api/v1/product_category/:id', (req, res) => {
     const sql = `SELECT * FROM product_category
     JOIN product ON product.id = product_category.product_id
     WHERE product_category.category_id=?`
     const params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(404).json({
                error: err.message
            })
            return
        }
       res.json({
            data: rows
        })
    })
})

// обработка маршрута для получения данных о товаре по его идентификатору !!!!
app.get('/api/v1/product/:id', (req, res) => {
    const sql = `SELECT * FROM product WHERE id = ?`
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(404).json({
                error: err.message
            })
            return
        }
       res.json({
            data: row
        })
    })
})

// обработка маршрута для создания товара !!!!
app.post('/api/v1/product', (req, res) => {
    const errors = []
    if (!req.body.name) {
        errors.push('No name product')
    }
    if (!req.body.price) {
        errors.push('No price product')
    }
    if (errors.length) {
        res.status(400).json({
            error: errors.join(', ')
        })
        return
    }
    let promotion = req.body.promotion
    if (!req.body.promotion){
        promotion='0'
        }
    const sql = `INSERT INTO product (name, price, description, promotion) VALUES (?, ?, ?, ?) `
    const params = [req.body.name, req.body.price, req.body.description, promotion]

    // Проверяем уникальное ограничение на поле name перед добавлением товара
    const uniqueCheckSql = `SELECT id FROM product WHERE name = ? LIMIT 1`
    db.get(uniqueCheckSql, [req.body.name], (err, row) => {
        if (err) {
            res.status(500).json({
                error: 'Internal server error'
            })
            return
        }
        if (row) {
            // Если товар с таким именем уже существует, возвращаем ошибку
            res.status(400).json({
                error: 'Product with the same name already exists'
            })
            return
        }

        // Если товар с таким именем не найден, добавляем новый товар
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({
                    error: err.message
                })
                return
            }

            // кроме создания товара необходимо еще добавить связь товар-категории, если она указана
             if (req.body.category_id) {
                const categorySql = `INSERT INTO product_category (product_id, category_id) VALUES (?, ?)`;

                db.run(categorySql, [this.lastID, req.body.category_id], (err, result) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
            }
            res.json({
                id: this.lastID,
                name: req.body.name
            });
        });
    });
});

// Обработка маршрута для изменения товара по идентификатору !!!!
app.put('/api/v1/product/:id', (req, res) => {
    const errors = [];
    if (!req.body.name) {
        errors.push('No name product');
    }
    if (!req.body.price) {
        errors.push('No price product');
    }

    if (errors.length) {
        res.status(400).json({
            error: errors.join(', ')
        });
        return;
    }
    const sql = `UPDATE product SET name = ?, price = ?, description = ?, promotion=? WHERE id = ?`;
    const params = [req.body.name, req.body.price, req.body.description, req.body.promotion, req.params.id];
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        if (req.body.category_id && req.body.category_id.length) {
            const insertCategorySQL = `INSERT OR IGNORE INTO product_category (product_id, category_id) VALUES (?, ?)`;
            db.run(insertCategorySQL, [req.params.id, req.body.category_id], (err, result) => {
                 if (err) {
                    res.status(400).json({
                        error: err.message
                     });
                  }
                });
        }
        res.json({
            id: +req.params.id,
            name: req.body.name,
            price: req.body.price,
            category_id: req.body.category_id,
        });
    });
});

// обработка маршрута для удаления товара по его идентификатору! !!!
app.delete('/api/v1/product/:id', (req, res) => {
    const sql = `DELETE FROM product WHERE id = ?`
    const params = [req.params.id]
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        res.json({
            id: req.params.id
        })
    })
})

// Обработка маршрута для отображения товаров в корзине !!!!
app.get('/api/v1/cart', (req, res) => {
    const sql = `SELECT * FROM cart c
                JOIN product p ON p.id = c.product_id`

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
            return
        }
        res.json({
            data: rows
        })
    })
})

// Обработка маршрута для добавления в корзину !!!!
app.post('/api/v1/cart', (req, res) => {
    const body = req.body
    const sql = `INSERT INTO cart (product_id) VALUES (?)`;
    const params = [body.id];
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        res.json({

            product_id: req.body.id
        });
    });
});

// Обработка маршрута для удаления из корзины !!!!
app.delete('/api/v1/cart/:id', (req, res) => {
    const sql = `DELETE FROM cart WHERE cart_id = ?`
    const params = [req.params.id]
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            })
        }
        res.json({
            cart_id: req.params.id
        })
    })
})

// middleware
app.use((req, res) => {
    res.status(404)
})

app.listen(3002, () => {
    console.log('Backend started')
})
