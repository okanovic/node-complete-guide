const Product = require('../models/product');
const Cart = require('../models/cart')
exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        console.log(products)
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        })
    }).catch((err) => {
        console.log(err)
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/product'
        })
    }).catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then((products) => {
        console.log(products)
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        })
    }).catch((err) => {
        console.log(err)
    });
}

exports.getCart = (req, res, nex) => {
    req.user.getCart()
        .then((cart) => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    })
                })
                .catch(err => console.log(err))
        }).catch((err) => {

        });
}

exports.postCart = (req, res, nex) => {
    const prodId = req.body.productId.trim();
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart()
        .then((cart) => {
            fetchedCart = cart
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product['cart-item'].quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(() => {
            res.redirect('/')
        })
        .then((product) => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            })
        })
        .catch((err) => {

        });
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