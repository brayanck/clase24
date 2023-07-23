const express = require('express')
const session = require('express-session')
const perfilRoutes = require("./routes/perfil.routes")
const handlebarsExpress  = require('express-handlebars')
const managerDb = require('./daos/ManagerDb')
const dataBaseConect = new managerDb("mongodb+srv://brayanmampaso:brayanmampaso10@cluster.r7ppmee.mongodb.net/segunda")
const MongoStore = require('connect-mongo')
const passport = require('passport')
const initializePassport = require("./config/passport")
const authRoutes = require("./routes/auth.routes")
const paginateRoute = require('./routes/paginate.routes')
const productsRouter = require("./routes/products.routes")
const cartRoutes = require('./routes/carts.routes')
const app= express()

app.use(express.json())

app.use(express.urlencoded({extended:true}))
//public
app.use(express.static(__dirname+"/public"))
app.use(session({
    store:MongoStore.create({
        mongoUrl:"mongodb+srv://brayanmampaso:brayanmampaso10@cluster.r7ppmee.mongodb.net/segunda"
    }), 
    secret: 'coderHouse',
    resave : false,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const handlebars = require('handlebars');

handlebars.registerHelper('isEqual', function (value1, value2, options) {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//view
app.engine('handlebars', handlebarsExpress.engine({
    // Otras configuraciones...
    runtimeOptions: {
      allowProtoPropertiesByDefault: true
    }
  }));
app.set('view engine', "handlebars")
app.set("views",__dirname+"/views")


const PORT = process.env.PORT || 8080;
app.use("/perfil",perfilRoutes)
app.use('/auth', authRoutes)
app.use("/",paginateRoute)
app.use("/product",productsRouter)
app.use("/api/carts",cartRoutes)
app.get("*", (req, res) => {
  res.status(404).render("error404",{})
});
app.listen(PORT,()=>{
    console.log("servidor corriendo en puerto "+ PORT)
    dataBaseConect.conectarse()
})
