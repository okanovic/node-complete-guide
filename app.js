const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

//const expressHbs = require('express-handlebars') //for hbs

const errorController = require('./controllers/error')
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();


//app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})); //for hbs
//app.set('view engine', 'hbs')
app.set('view engine', 'ejs')
//app.set('view engine', 'pug')
app.set('views', 'views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        }).catch((err) => {

        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constrains: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize.sync(/* { force: true } */).then(result => {
    return User.findByPk(1);

})
    .then(user => {
        if (!user) {
            User.create({
                name: "Okan",
                email: "okan@gmail.com"
            })
        }
        return user
    })
    .then(cart => {
        cart.createCart()
    }).then(() => {
        app.listen(3000)

    })
    .catch(err => {
        console.log(err);
    });

