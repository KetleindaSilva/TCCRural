const db = require('./database');
const cloudinary = require('../cloudinary');

class Anuncio {
  constructor({ titulo, descricao, valor, categoria_id, anunciante_id, imagem,  contato }) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.valor = valor;
    this.categoria_id = categoria_id;
    this.anunciante_id = anunciante_id;
    this.imagem = imagem;
    this.contato = contato; 
  }
  static async uploadImagemCloudinary(imagemPath) {
    try {
      const cloudinaryResult = await cloudinary.uploader.upload(imagemPath);
      return cloudinaryResult.secure_url;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem para o Cloudinary:', error);
      throw error;
    }
  }

  static async create({ titulo, descricao, valor, categoria_id, anunciante_id, imagem, contato }) {
    const query = 'INSERT INTO anuncios (titulo, descricao, valor, categoria_id, anunciante_id, imagem,contato) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return db.execute(query, [titulo, descricao, valor, categoria_id, anunciante_id, imagem, contato]);
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    throw error;
  }

  static buscarTodosAnuncios(callback) {
    const sql = 'SELECT * FROM anuncios';
    db.query(sql, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }

  static buscarPorCategoria(categoriaId, callback) {
    const sql = 'SELECT * FROM anuncios WHERE categoria_id = ?';
    db.query(sql, [categoriaId], (err, result) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  static buscarAnuncianteId(anuncianteId, callback) {
    const sql = 'SELECT * FROM anuncios WHERE anunciante_id = ?';
    db.query(sql, [anuncianteId], (err, results) => {
      if (err) {
        console.error(err);
      } else {
        callback(null, results);
      }
    });
  }


  static buscarId(id, callback) {
    const sql = 'SELECT * FROM anuncios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      if (result.length === 0) {
        callback(null, null);
        return;
      }
      callback(null, result[0]);
    });
  }

  static atualizar(id, { titulo, descricao, valor, categoria_id, imagem,  contato }, callback) {
    const sql = 'UPDATE anuncios SET titulo = ?, descricao = ?, valor = ?, categoria_id = ?, imagem = ?,  contato = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, valor, categoria_id, imagem,  contato, id], (err, result) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  static excluir(id, callback) {
    const sql = 'DELETE FROM anuncios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  static buscaPorTermo(termoPesquisa, callback) {
    const sql = 'SELECT * FROM anuncios WHERE titulo LIKE ? OR descricao LIKE ?';
    const termo = `%${termoPesquisa}%`;
    db.query(sql, [termo, termo], (err, results) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }
  static getAllCategorias(callback) {
    const sql = 'SELECT * FROM categorias';
    db.query(sql, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
  static getAllporCategorias(callback) {
    const sql = `
      SELECT a.*, c.nome AS categoria_nome
      FROM anuncios a
      JOIN categorias c ON a.categoria_id = c.id
    `;
    db.query(sql, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
  
}

module.exports = Anuncio;
