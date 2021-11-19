const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const conn = require('./db/conn')
const FileStore = require('session-file-store')(session)
const toughtsRoutes = require('./routes/toughtsRoutes')

// Models //

const User = require('./models/User')
const Tought = require('./models/Tought')


// Iniciando o express //

const app = express()

// Configurando o handlebars
const hbs = exphbs.create({
    partialsDir : ['views/partials'],
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// Configurando a requisição do body

app.use(express.urlencoded({
    extended:true,
}))
app.use(express.json())

// Sessions middleware
app.use(
    session({
        name: 'session',
        secret: 'password',
        resave: false, //tempo que permanece logado
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions') // Indicando a pasta
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now()+360000),
            httpOnly: true //https config é diferente
        }
    })
)

// Flash messages 

app.use(
    flash()
)

// Public path

app.use(express.static('./public'))

// Set session to res

app.use((req, res, next)=>{

    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})


// Rotas //

app.use('/', toughtsRoutes)

//Conexão com o banco de dados//

conn.sync()
    .then(
        app.listen(3000)
    ).catch(
        (err)=>{console.log(err)}
    )