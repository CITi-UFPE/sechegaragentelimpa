const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario');

const handleError = require('../providers/handle-error');

router.route('/').get(async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.json(usuarios);
  } catch (err) {
    handleError(res, err, 'Erro no banco de dados');
  }
});

router.route('/cadastro').post(async (req, res) => {
  try {
    const { matricula, email, empresa, tipo } = req.body; // eslint-disable-line

    if (!(matricula && email && empresa && tipo)) {
      handleError(res, null, 'Dados faltando');
      return;
    }

    try {
      const [usuario] = await Usuario.find({ matricula });
      if (usuario) {
        handleError(res, null, 'Usuário já existe');
        return;
      }
    } catch (err) {
      handleError(res, err, 'Erro no banco de dados');
    }

    try {
      const senha = (await bcrypt.hash(`${Math.random()}`, 10)).substr(0, 15);

      console.log(senha);

      const hash = await bcrypt.hash(senha, 10);

      const usuarioNovo = new Usuario({
        matricula,
        email,
        senha: hash,
        empresa,
        tipo,
      });

      try {
        await usuarioNovo.save();
      } catch (err) {
        handleError(res, err, 'Erro no banco de dados');
      }
    } catch (err) {
      handleError(res, err, 'Erro na criptografia');
    }

    try {
      const token = jwt.sign(matricula, process.env.JWT_SECRET);
      res.json({
        token,
        msg: 'Usuário cadastrado com sucesso',
      });
    } catch (err) {
      handleError(res, err, 'Erro com o token');
    }
  } catch (err) {
    handleError(res, err, null);
  }
});

router.route('/login').post(async (req, res) => {
  try {
    // const { matricula } = jwt.verify(req.body.token, process.env.JWT_SECRET);
    // TODO: add no permissionamento
    const { matricula, senha } = req.body;

    if (!(matricula || senha)) {
      handleError(res, null, 'Dados faltando');
      return;
    }

    try {
      const [usuario] = await Usuario.find({ matricula });

      if (!usuario) {
        handleError(res, null, 'Usuário não existe');
        return;
      }

      const match = await bcrypt.compare(senha, usuario.senha);

      if (!match) {
        handleError(res, null, 'Senha incorreta');
        return;
      }

      const token = jwt.sign(matricula, process.env.JWT_SECRET);

      res.json({
        tipo: usuario.tipo,
        token,
        msg: 'Login realizado com sucesso',
      });
    } catch (err) {
      console.log(err);
      handleError(res, null, 'Erro no banco de dados');
    }
  } catch (err) {
    handleError(res, err, null);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      handleError(res, null, 'Usuário não existe');
      return;
    }

    res.json(usuario);
  } catch (err) {
    handleError(res, err, 'Erro no banco de dados');
  }
});

router.route('/:id/atividade').post(async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      handleError(res, null, 'Usuário não existe');
      return;
    }

    usuario.atividadesDoDia = req.body.atividadesDoDia;

    await usuario.save();

    res.json({
      msg: 'Atividade adicionada com sucesso',
    });
  } catch (err) {
    handleError(res, err, 'Erro no banco de dados');
  }
});

router.route('/:id/atividade').delete(async (req, res) => {
  try {
    const { atividadeParaDeletar } = req.body;

    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      handleError(res, null, 'Usuário não existe');
      return;
    }

    const novasAtividades = usuario.atividadesDoDia
      .filter((atividadeDoDia) => atividadeDoDia !== atividadeParaDeletar);

    usuario.atividadesDoDia = novasAtividades;

    await usuario.save();

    res.json({
      msg: 'Atividade removida com sucesso',
    });
  } catch (err) {
    handleError(res, err, 'Erro no banco de dados');
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({
      msg: 'Usuário deletado com sucesso',
    });
  } catch (err) {
    handleError(res, err, 'Erro no banco de dados');
  }
});

module.exports = router;
