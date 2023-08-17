import express from 'express'
import { engine } from 'express-handlebars'
import http from 'http'
import bodyParser from 'body-parser'
import axios from 'axios';
import { dirname } from "path";
import { fileURLToPath } from "url";

// создание экземпляра приложения
const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
app.use(express.static(`${_dirname}/assets`, {
    extensions:['css','ico','png','js']
}));
// промежуточное ПО (middleware) для обработки тела запроса и ответа
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// настройка шаблонизатора Handlebars
app.engine('hbs', engine({
    extname: '.hbs', // расширение файлов шаблонов
    defaultLayout: 'main' // название макета по умолчанию
}));

// назначение Handlebars шаблонизатором по умолчанию
app.set('view engine', 'hbs');

// Функция для выполнения http-запросов !!!!
function performHttpRequest(path, method, headers, body) {
     const httpOptions = {
            hostname: 'localhost',
            port: 3002,
            path: path,
            method: method,
            headers: headers
                    };
    return new Promise((resolve, reject) => {
        const request = http.request(httpOptions, response => {
            let responseData = '';
            response.on('data', data => {
                responseData += data;
            });
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            });
        });
        request.on('error', error => {
            reject(error);
        });
        if (body) {
            request.write(body);
        }
        request.end();
    });
};

// Функция для получения списка категорий !!!!
async function getCategoryList() {
    const path = '/api/v1/category';
    const method = 'GET';
    const categoryListResponse = await performHttpRequest(path, method);
    return categoryListResponse.data;
};

// Функция для получения списка товаров в корзине !!!!
async function getCart() {
    const path = '/api/v1/cart';
    const method = 'GET';
    const cartResponse = await performHttpRequest(path, method);
    return cartResponse.data;
};

// Функция для расчета общего количества товаров в корзине !!!!
function calculateTotalItemCount(cart) {
    return Array.isArray(cart) ? cart.length : 0;
};

// Функция для расчета общей суммы по всем товарам в корзине !!!!
function calculateTotalCartPrice(cart) {
    let totalCartPrice = 0;
    if (Array.isArray(cart)) {
        cart.forEach(item => {
            if (item && typeof item === 'object' && item.price) {
                totalCartPrice += item.price;
            }
        });
    }
    return totalCartPrice;
};

// Функция для получения списка товаров участвующих в акции !!!!
async function getProductPromotion() {
    const  path = '/api/v1/product/promotion';
    const method = 'GET';
    const productPromotion = await performHttpRequest(path, method);
    return productPromotion.data;
};

// Функция для получения списка всех товаров !!!!
async function getProducts() {
    const  path = '/api/v1/product';
    const method = 'GET';
    const products = await performHttpRequest(path, method);
    return products.data;
};

// Функция для получения товара по ID !!!!
async function getProduct(id) {
    let path = '/api/v1/product/';
    path = path+id;
    const method = 'GET';
    const product = await performHttpRequest(path, method);
    return product.data;
};

// Функция для получения категории по ID !!!!
async function getCategory(id) {
    let path = '/api/v1/category/';
    path = path+id;
    const method = 'GET';
    const category = await performHttpRequest(path, method);
    return category.data;
};

// Функция для получения списка товаров находящихся в категории по ID категории !!!!
async function getProductCategory(id) {
    let path = '/api/v1/product_category/';
    path = path+id;
    const method = 'GET';
    const productCategoryList = await performHttpRequest(path, method);
    return productCategoryList.data;
};

// обработка корневого маршрута (главная страница) !!!!
app.get('/', async (req, res) => {
    try { //создаем константы и переменные
        const categoryList = await getCategoryList();
        const productList = await getProductPromotion();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('home', { // рендеринг отрисовка страницы
            title: 'Store',
            categoryList: categoryList,
            productList: productList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice
        });
    } catch (error) { // Обработка ошибок
        res.render('home', {
            title: 'Store',
            categoryList: [],
            productList: [],
            cart: [],
            totalItemCount: 0,
            totalCartPrice: 0
        });
    };
});

// обработка маршрута отображения всех товаров !!!!
app.get('/products', async (req, res) => {
    try {
        const categoryList = await getCategoryList();
        const productList = await getProducts();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('products', {
            title: 'Products | Store',
            categoryList: categoryList,
            productList: productList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice
        });
    } catch (error) {
        res.render('products', {
            title: 'Products | Store',
            categoryList: [],
            productList: [],
            cart: [],
            totalItemCount: 0,
            totalCartPrice: 0
        });
    };
});

// обработка маршрута для отображения товара по Id !!!!
app.get('/product/:product',async (req, res) => {
    try {
        const id = `${req.params.product}`;
        const categoryList = await getCategoryList();
        const product = await getProduct(id);
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('product', {
            title: 'Product | Store',
            categoryList: categoryList,
            product: product,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice
        });
    } catch (error) {
        res.render('product', {
            title: 'Product | Store',
            categoryList: [],
            product: [],
            cart: [],
            totalItemCount: 0,
            totalCartPrice: 0
        });
    };
});

// обработка маршрута отображения страницы создания товара !!!!
app.get('/create-product', async (req, res) => {
    try {
        const categoryList = await getCategoryList();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('create-product', {
            title: 'Create-Product | Store',
            categoryList: categoryList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice
        });
    } catch (error) {
        res.render('create-product', {
            title: 'Create-Product | Store',
            categoryList: [],
            cart: [],
            totalItemCount: [],
            totalCartPrice: [],
        });
    };
});

// обработка маршрута для отображения страницы создания категории !!!!
app.get('/create-category', async (req, res) => {
     try {
        const categoryList = await getCategoryList();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('create-category',{
            title: 'create-category | Store',
            categoryList: categoryList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice,
        });
         } catch (error) {
        res.render('create-category', {
            title: 'create-category | Store',
            categoryList: [],
            cart: [],
            totalItemCount: [],
            totalCartPrice: [],
        });
    };
});

// обработка маршрута для отображения страницы просмотра категории !!!!
app.get('/category/:id', async (req, res) => {
     try {
        const id = `${req.params.id}`;
        const categoryList = await getCategoryList();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        const category = await getCategory(id);
        const productList = await getProductCategory(id);
        res.render('category',{
            title: 'Category | Store',
            categoryList: categoryList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice,
            category: category,
            productList:productList,
        });
         } catch (error) {
        res.render('Category', {
            title: 'Category | Store',
            categoryList: [],
            cart: [],
            totalItemCount: [],
            totalCartPrice: [],
            category: [],
            productList:[],
        });
    };
});

// обработка маршрута для оформления заказа !!!!
app.get('/cart', async(req, res) => {
     try {
        const categoryList = await getCategoryList();
        const cart = await getCart();
        const totalItemCount = calculateTotalItemCount(cart);
        const totalCartPrice = calculateTotalCartPrice(cart);
        res.render('cart', {
            title: 'Cart | Store',
            categoryList: categoryList,
            cart: cart,
            totalItemCount: totalItemCount,
            totalCartPrice: totalCartPrice,
        });
    } catch (error) {
        res.render('cart', {
            title: 'Cart | Store',
            categoryList: [],
            cart: [],
            totalItemCount: [],
            totalCartPrice: [],
        });
    };
});

// Обработка маршрута на server.js для добавления, удаления и изменения категории !!!!
app.post('/create-category/:id', async (req, res) => {
    try {
        const httpMethod = req.body._method;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify(req.body);
        let path = `/api/v1/category/${req.params.id}`;
        if (httpMethod === 'POST') {
            path = '/api/v1/category';
            await performHttpRequest(path, httpMethod, headers, body);
            res.send(`<script>alert("Category add"); window.location.href = "/create-category"; </script>`);
        } else if (httpMethod === 'PUT') {
            await performHttpRequest(path, httpMethod, headers, body);
            res.send(`<script>alert("Category update"); window.location.href = "/category/${req.params.id}"; </script>`);
        } else if (httpMethod === 'DELETE'){
            await performHttpRequest(path, httpMethod);
            res.send(`<script>alert("Category Delete"); window.location.href = "/"; </script>`);
        }
    }  catch (error) {
        // В случае возникновения ошибки при выполнении запроса
        if (error.response) {
            // Если ответ с ошибкой пришел от сервера API
            res.status(error.response.status).json(error.response.data);
        } else {
            // Если произошла другая внутренняя ошибка
            res.status(500).json({
                error: 'Internal server error'
            });
        };
    };
});

// Обработка маршрута на server.js для добавления, удаления и изменения товара !!!!
app.post('/create-product/:id', async (req, res) => {
    try {
        let path = `/api/v1/product/${req.params.id}`;
        const httpMethod = req.body._method;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify(req.body);
        if (httpMethod === 'POST') {
            path = '/api/v1/product';
            await performHttpRequest(path, httpMethod, headers, body);
            res.send(`<script>alert("Product add"); window.location.href = "/create-product"; </script>`);
        } if (httpMethod === 'PUT') {
            await performHttpRequest(path, httpMethod, headers, body);
            res.send(`<script>alert("Product update"); window.location.href = "/product/${req.params.id}"; </script>`);
        } else if (httpMethod === 'DELETE'){
            await performHttpRequest(path, httpMethod);
            res.send(`<script>alert("Product Delete"); window.location.href = "/"; </script>`);
        }
    } catch (error) {
        res.render('create-category', {
            title: 'create-category | Store',
            categoryList: [],
            cart: [],
        });
    };
});

// Обработка маршрута на server.js  для добавления в корзину  и удаления из корзины !!!
app.post('/cart/:id', async (req, res) => {
    try {
        const httpMethod = req.body._method;
        if (httpMethod === 'POST') {
            const cartData = JSON.stringify(req.body);
            const path = '/api/v1/cart';
            const headers = { 'Content-Type': 'application/json' };
            await performHttpRequest(path, httpMethod, headers, cartData);
            res.send(`<script>alert("Product add to cart"); window.location.href = "/cart"; </script>`);
        } else if (httpMethod === 'DELETE') {
            const path = `/api/v1/cart/${req.params.id}`;
            await performHttpRequest(path, httpMethod);
            res.send(`<script>alert("Product Delete to cart"); window.location.href = "/cart"; </script>`);
        }
    } catch (error) {
        res.render('cart', {
            title: 'Cart | Store',
            categoryList: [],
            cart: [],
        });
    };
});

// обработка марщрута для отображения страницы ошибки (страница не найдена)
app.get('**', (req, res) => {
    res.status(404).render('page404')
});


// запуск сервера (прослушивание порта 3000)
app.listen(port, () => {
    console.log('App started')
});

