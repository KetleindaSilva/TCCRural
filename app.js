const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.static('public'));
app.use(express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const AnuncioController = require('./Controllers/AnuncioController');


app.get('/', (req, res) => {
    res.redirect('/principal');
});

app.get('/principal', AnuncioController.principal);
app.post('/principal', AnuncioController.filtrarPorCategoria);

app.get('/anuncio/:id', AnuncioController.detalhesAnuncio);
app.get('/criar-anuncio', AnuncioController.criarAnuncio);
app.post('/criar-anuncio', upload.single('imagem'), AnuncioController.criarAnuncioPost);
app.get('/editar-anuncio/:id', AnuncioController.editarAnuncio);
app.post('/editar-anuncio/:id', upload.single('imagem'), AnuncioController.atualizarAnuncio);
app.get('/excluir-anuncio/:id', AnuncioController.excluirAnuncio);
app.get('/meus-anuncios', AnuncioController.meusAnuncios);
app.get('/buscar-anuncios', AnuncioController.buscarAnuncios);

const UserController = require('./Controllers/UserController');

app.get('/registro', UserController.registro);
app.post('/registro', UserController.registroPost);
app.get('/login', UserController.login);
app.post('/login', UserController.loginPost);
app.get('/logout', UserController.logout);

app.get('/principal/:categoria', (req, res) => {
  const categoriaSelecionada = req.params.categoria;
  res.render('principal', { categoriaSelecionada });
});

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});
