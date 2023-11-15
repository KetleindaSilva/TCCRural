const Anuncio = require('../Models/anuncio');
const User = require('../Models/user');
const cloudinary = require('../cloudinary');


exports.principal = (req, res) => {
  const userId = req.session.userId;
  const termoPesquisa = '';

  const categoriaSelecionada = req.query.categoria || null;

  Anuncio.getAllCategorias((err, categorias) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar categorias.');
      return;
    }

    Anuncio.getAllporCategorias((err, anuncios) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar anúncios.');
        return;
      }

      if (categoriaSelecionada) {
        anuncios = anuncios.filter(anuncio => anuncio.categoria_id == categoriaSelecionada);
        console.log(categoriaSelecionada);
      }

      const categoriaSelecionadaNome = categorias.find(categoria => categoria.id == categoriaSelecionada)?.nome;

      const anunciosPorCategoria = organizarPorCategoria(anuncios, categorias);
      console.log(categoriaSelecionada);

      Anuncio.buscarPorCategoria(categoriaSelecionada, (err, anuncios) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao buscar anúncios por categoria.');
        } else { }

        res.render('principal', {
          categorias,
          anunciosPorCategoria,
          userId,
          anuncios,
          termoPesquisa,
          anunciosPesquisa: anuncios,
          categoriaSelecionada,
          categoriaSelecionadaNome
        });
      });
    });
  });
};

function organizarPorCategoria(anuncios, categorias) {
  const anunciosPorCategoria = {};

  categorias.forEach(categoria => {
    anunciosPorCategoria[categoria.id] = {
      nome: categoria.nome,
      anuncios: [],
    };
  });

  anuncios.forEach(anuncio => {
    anunciosPorCategoria[anuncio.categoria_id].anuncios.push(anuncio);
  });

  return anunciosPorCategoria;
}

exports.filtrarPorCategoria = (req, res) => {
  const categoriaSelecionada = req.query.categoria;
  Anuncio.buscarPorCategoria(categoriaSelecionada, (err, anuncios) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar anúncios por categoria.');
      return;
    }

    Anuncio.getAllCategorias((err, categorias) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar categorias.');
        return;
      }

      Anuncio.buscarTodosAnuncios((err, anuncios) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao buscar anúncios.');
          return;
        }

        const anunciosPorCategoria = organizarPorCategoria(anuncios, categorias);

        res.render('principal', {
          title: 'Principal',
          anuncios,
          anunciosPesquisa: anuncios,
          termoPesquisa: '',
          categorias,
          categoriaSelecionada,
          anunciosPorCategoria
        });
      });
    });
  });
};
exports.buscarNomePorId = (req, res) => {
  const anuncianteId = req.params.anuncianteId; 

  User.buscarNomePorId(anuncianteId, (err, usuario) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar o nome do anunciante.');
    } else {
     res.json({ nomeAnunciante: usuario.nome });
    }
  });
};

exports.criarAnuncio = (req, res) => {
  res.render('criar-anuncio');
};



exports.criarAnuncioPost = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    const anunciante_id = req.session.userId;
    const { titulo, descricao, valor, categoria_id, contato } = req.body;

    if (!req.file) {
      return res.status(400).send('Por favor, faça o upload de uma imagem.');
    }
    console.log(req.file);
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    const imagemCloudinaryURL = cloudinaryResult.secure_url;

    const anuncioId = await Anuncio.create({
      titulo,
      imagem: imagemCloudinaryURL,
      descricao,
      valor,
      categoria_id,
      anunciante_id,
      contato
    });

    res.redirect('/principal');
  } catch (error) {
    console.error('Erro ao criar o anúncio ou fazer upload da imagem:', error);
    res.status(500).send('Erro ao criar o anúncio ou fazer upload da imagem.');
  }
};



exports.meusAnuncios = (req, res) => {
  const anunciante_id = req.session.userId;

  Anuncio.buscarAnuncianteId(anunciante_id, (err, anuncios) => {
    if (err) {
      console.error(err);
      res.send('Erro ao buscar os anúncios do usuário.');
    } else {
      res.render('meus-anuncios', { title: 'Meus Anúncios', anuncios });
    }
  });
};

exports.detalhesAnuncio = (req, res) => {
  const anuncioId = req.params.id;
  Anuncio.buscarId(anuncioId, (err, anuncio) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar detalhes do anúncio.');
    } else if (!anuncio) {
      res.status(404).send('Anúncio não encontrado.');
    } else {
      User.buscarNomePorId(anuncio.anunciante_id, (userErr, usuario) => {
        if (userErr) {
          console.error(userErr);
          res.status(500).send('Erro ao buscar o nome do anunciante.');
        } else {
          Anuncio.buscarAnuncianteId(anuncio.anunciante_id, (anunciosErr, outrosAnuncios) => {
            if (anunciosErr) {
              console.error(anunciosErr);
              res.status(500).send('Erro ao buscar outros anúncios do mesmo anunciante.');
            } else {
              outrosAnuncios = outrosAnuncios.filter(outroAnuncio => outroAnuncio.id !== anuncio.id);
          
              res.render('detalhes-anuncio', { title: 'Detalhes do Anúncio', anuncio, usuario, outrosAnuncios });
            }
          });
        }
      });
    }
  });
};




exports.editarAnuncio = (req, res) => {
  const anuncioId = req.params.id;

  if (req.session.userId) {
    Anuncio.buscarId(anuncioId, (err, anuncio) => {
      if (err) {
        console.error(err);
        res.send('Erro ao buscar o anúncio.');
      } else {
        if (anuncio && anuncio.anunciante_id === req.session.userId) {
          res.render('edit-anuncio', { anuncio });
        } else {
          res.send('Você não tem permissão para editar este anúncio.');
        }
      }
    });
  } else {
    res.redirect('/login');
  }
};

exports.atualizarAnuncio = async (req, res) => {
  const anuncioId = req.params.id;
  const { titulo, descricao, valor, categoria_id,imagem, contato } = req.body;

  if (req.session.userId) {
    Anuncio.buscarId(anuncioId, (err, anuncio) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar o anúncio.');
        return;
      }

      if (anuncio.anunciante_id !== req.session.userId) {
        res.status(403).send('Você não tem permissão para editar este anúncio.');
        return;
      }

      const updatedAnuncio = {
        titulo,
        descricao,
        valor,
        categoria_id,
        imagem,
        contato,
      };

      Anuncio.atualizar(anuncioId, updatedAnuncio, (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).send('Erro ao atualizar o anúncio.');
        }
        })

        res.redirect(`/anuncio/${anuncioId}`);
      });
    }else {
    res.status(401).send('Você precisa estar logado para editar anúncios.');
  }
}

exports.excluirAnuncio = (req, res) => {
  const anuncioId = req.params.id;

  if (req.session.userId) {
    Anuncio.buscarId(anuncioId, (err, anuncio) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar o anúncio.');
        return;
      }

      if (anuncio && anuncio.anunciante_id === req.session.userId) {
        Anuncio.excluir(anuncioId, (deleteErr, result) => {
          if (deleteErr) {
            console.error(deleteErr);
            res.status(500).send('Erro ao excluir o anúncio.');
            return;
          }

          if (result.affectedRows === 0) {
            res.status(404).send('Anúncio não encontrado para exclusão.');
          } else {
            res.redirect('/principal');
          }
        });
      } else {
        res.status(403).send('Você não tem permissão para excluir este anúncio.');
      }
    });
  } else {
    res.status(401).send('Você não está autenticado. Faça login para excluir anúncios.');
  }
};

exports.buscarAnuncios = (req, res) => {
  const termoPesquisa = req.query.termo;
  const categoriaSelecionada = req.query.categoria;

  Anuncio.buscarPorCategoria(categoriaSelecionada, (err, anuncios) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar anúncios por categoria.');
      return;
    }
    Anuncio.buscaPorTermo(termoPesquisa, (err, anunciosPesquisa) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar anúncios.');
        return;
      }

      Anuncio.getAllCategorias((err, categorias) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao buscar categorias.');
          return;
        }

        Anuncio.buscarTodosAnuncios((err, anunciosCadastrados) => {
          if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar anúncios.');
            return;
          }

          const anunciosPorCategoria = organizarPorCategoria(anunciosCadastrados, categorias);

          res.render('principal', {
            title: 'Principal',
            anuncios: anunciosCadastrados,
            anunciosPesquisa,
            termoPesquisa,
            categorias,
            anunciosPorCategoria,
            categoriaSelecionada
          });
        });
      });
    });
  })
};
