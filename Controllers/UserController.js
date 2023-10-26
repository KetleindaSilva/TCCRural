const User = require('../Models/user');

exports.registro = (req, res) => {
  res.render('registro');
};

exports.registroPost = (req, res) => {
  const { nome, email, senha } = req.body;

  User.create(nome, email, senha, (err, result) => {
    if (err) {
      console.error(err);
      res.redirect('/registro');
    } else {
      res.redirect('/login');
    }
  });
};

exports.login = (req, res) => {
  res.render('login');
};

exports.loginPost = (req, res) => {
  const { email, senha } = req.body;

  User.autenticar(email, senha, (err, user) => {
    if (err || !user) {
      console.error(err);
      res.redirect('/login');
    } else {
      req.session.userId = user.id;
      req.session.user = { nome: user.nome };
      res.locals.user = req.session.user;
      console.log(res.locals.user);
        res.redirect('/principal');
    }
  });
};

exports.logout = (req, res) => {
  delete req.session.userId;
  delete req.session.user;
  res.redirect('/login');
};