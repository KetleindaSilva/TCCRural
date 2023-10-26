const Anuncio = require('./models/Anuncio');

exports.paginaPrincipal = (req, res) => {
  Anuncio.getAllAnuncios((err, anuncios) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar anúncios');
      return;
    }

    const categorias = ['Frutas', 'Legumes', 'Verduras','Coloniais','Alimento Animal']; 
    const anunciosPorCategoria = {};

    categorias.forEach((categoria) => {
      anunciosPorCategoria[categoria] = anuncios.filter((anuncio) => anuncio.categoria === categoria);
    });

    res.render('principal', { anunciosPorCategoria });
  });
};
