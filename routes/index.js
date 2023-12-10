const express = require('express');
const router = express.Router();
const MiddlewareAuthenticate = require('../middleware/MiddlewareAuthenticate');

const ProductsController = require('../controllers/ProductsController');
const productsContoller = new ProductsController();

router.get('/products', MiddlewareAuthenticate.authenticateToken(roles =
	['admin', 'user']), (req, res) => {
	productsContoller.getProducts(req, res);
});

router.get('/product/:id', MiddlewareAuthenticate.authenticateToken(roles =
	['admin', 'user']), (req, res) => {
	productsController.getProduct(req, res);
});

router.get('/products/:id', MiddlewareAuthenticate.authenticateToken(roles = 
	['admin', 'user']), (req, res) => {
		productsContoller.getProductsByIdCategory(req, res);
	});

router.post('/product-add', MiddlewareAuthenticate.authenticateToken(roles =
	['admin', 'user']), (req, res) => {
	productsController.addProduct(req, res);
});

router.patch('/product-update/:id', MiddlewareAuthenticate.authenticateToken(roles = 
	'admin'), (req, res) => {
	productsContoller.updateProduct(req, res);
});

router.delete('/product-delete/:id', MiddlewareAuthenticate.authenticateToken(roles = 
	'admin'), (req, res) => {
	productsContoller.deleteProduct(req, res);
});

router.delete('/category-delete/:id', MiddlewareAuthenticate.authenticateToken
(roles = 'admin'), (req ,res) => {
categoryControllerContoller.deleteCategory(req, res);
});

router.delete('/orders-delete/:id', MiddlewareAuthenticate.authenticateToken(roles = 
	'admin', (req, res) => {
		ordersController.deleteOrders(req ,res);
	}));

router.delete('user-delete/:id', MiddlewareAuthenticate.authenticateToken(roles = 
	'admin', (req, res) => {
		usersController.deleteUsers(req ,res);
	}));

const CategoryController = require('../controllers/CategoryController');
const categoryController = new CategoryController();

router.get('/category', (req, res) => {
	categoryController.getCategory(req, res);
});

router.get('/category/:id', (req, res) => {
	categoryController.getCategoryById(req, res);
});

const UsersController = require('../controllers/UsersController');
const usersController = new UsersController();

router.get('/users', (req, res) => {
	usersController.getUsers(req, res);
});

router.get('/users/:id', (req, res) => {
	usersController.getUser(req, res);
});

router.post(
	'/user-add',
	MiddlewareAuthenticate.authenticateToken((roles = 'admin')),
	(req, res) => {
		usersController.addUser(req, res);
	},
);

router.post('/login', (req, res) => {
	usersController.UserLogin(req, res);
});

router.post('/registration', (req, res) => {
	usersController.UserRegistration(req, res);
});

router.post(
	'/logout',
	MiddlewareAuthenticate.authenticateToken((roles = ['admin', 'user'])),
	(req, res) => {
		usersController.UserLogout(req, res);
	},
);

router.post('/refresh-token', (req, res) => {
	usersController.refreshToken(req, res);
});

module.exports = router;
