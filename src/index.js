const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/User.js');
//Initialization
const app = express()
require('./database.js')
require('./config/passport')
//Settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }

}));
app.set('view engine', '.hbs');
//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: '12345678',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global variables
app.use((req,res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user|| null;
        /*res.locals.user = User.findById(req.user.id).then(data => {
            return {
                name:data.name,
                email:data.email,
                id:data.id
            }
        })
    }*/
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static files
app.use(express.static(path.join(__dirname, '/public')));

//Server is listenning
app.listen(app.get('port'), () => {
    console.log('server its listening on port', app.get('port'));
})