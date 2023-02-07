const Product = require('../models/product');
const Cart = require('../models/cart')
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, filedData]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products',
            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(([product]) => {
        res.render('shop/product-detail', {
            product: product[0],
            pageTitle: product.title,
            path: '/product'
        })
    }).catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, filedData]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, nex) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (const product of products) {
                const cartProductData = cart.products.find(prod => prod.id.trim() === product.id.trim());
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty })
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            })
        })
    })
}

exports.postCart = (req, res, nex) => {
    const prodId = req.body.productId.trim();
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/')
}

exports.postCartDeleteProduct = (req, res, nex) => {
    const prodId = req.body.productId.trim();
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart')
    });
}

exports.getOrders = (req, res, nex) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    })
}

exports.getCheckout = (req, res, nex) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Your Checkout'
    })
}