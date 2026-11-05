const Projeto = require('../models/Projeto');

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function erroValidacao(res, mensagem) {
  return res.status(400).json({ erro: mensagem });
}

async function listar(req, res, next) {
  try {
    const filtro = {};
    if (req.query.nome !== undefined) {
      if (!textoValido(req.query.nome)) return erroValidacao(res, 'O filtro nome não pode ser vazio.');
      filtro.nome = { $regex: req.query.nome.trim(), $options: 'i' };
    }
    if (req.query.tarefa !== undefined) {
      if (!textoValido(req.query.tarefa)) return erroValidacao(res, 'O filtro tarefa não pode ser vazio.');
      filtro['tarefas.codigo'] = req.query.tarefa.trim();
    }
    return res.status(200).json(await Projeto.find(filtro).sort({ codigo: 1 }));
  } catch (erro) { return next(erro); }
}

async function buscar(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    return res.status(200).json(projeto);
  } catch (erro) { return next(erro); }
}

async function criar(req, res, next) {
  try {
    const { codigo, nome, tarefas } = req.body || {};
    if (!textoValido(codigo) || !textoValido(nome)) return erroValidacao(res, 'Código e nome do projeto são obrigatórios.');
    if (tarefas !== undefined && !Array.isArray(tarefas)) return erroValidacao(res, 'Tarefas deve ser um array.');
    if (await Projeto.exists({ codigo: codigo.trim() })) return res.status(409).json({ erro: 'Já existe um projeto com esse código.' });
    const projeto = await Projeto.create({ codigo: codigo.trim(), nome: nome.trim(), tarefas: tarefas || [] });
    return res.status(201).json(projeto);
  } catch (erro) { return next(erro); }
}

async function atualizar(req, res, next) {
  try {
    const { nome } = req.body || {};
    if (!textoValido(nome)) return erroValidacao(res, 'O nome do projeto é obrigatório.');
    const projeto = await Projeto.findOneAndUpdate({ codigo: req.params.codigo }, { $set: { nome: nome.trim() } }, { new: true, runValidators: true });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    return res.status(200).json(projeto);
  } catch (erro) { return next(erro); }
}

async function excluir(req, res, next) {
  try {
    const projeto = await Projeto.findOneAndDelete({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    return res.status(204).send();
  } catch (erro) { return next(erro); }
}

async function listarTarefas(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo }, { tarefas: 1, _id: 0 });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    return res.status(200).json(projeto.tarefas);
  } catch (erro) { return next(erro); }
}

async function adicionarTarefa(req, res, next) {
  try {
    const { codigo, nome, responsavel } = req.body || {};
    if (!textoValido(codigo) || !textoValido(nome) || !textoValido(responsavel)) return erroValidacao(res, 'Código, nome e responsável da tarefa são obrigatórios.');
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    if (projeto.tarefas.some((tarefa) => tarefa.codigo === codigo.trim())) return res.status(409).json({ erro: 'Já existe uma tarefa com esse código no projeto.' });
    projeto.tarefas.push({ codigo: codigo.trim(), nome: nome.trim(), responsavel: responsavel.trim() });
    await projeto.save();
    return res.status(201).json(projeto.tarefas[projeto.tarefas.length - 1]);
  } catch (erro) { return next(erro); }
}

async function atualizarTarefa(req, res, next) {
  try {
    const { nome, responsavel } = req.body || {};
    if (!textoValido(nome) || !textoValido(responsavel)) return erroValidacao(res, 'Nome e responsável da tarefa são obrigatórios.');
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    const tarefa = projeto.tarefas.find((item) => item.codigo === req.params.codigoTarefa);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    tarefa.nome = nome.trim();
    tarefa.responsavel = responsavel.trim();
    await projeto.save();
    return res.status(200).json(tarefa);
  } catch (erro) { return next(erro); }
}

async function excluirTarefa(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    const quantidade = projeto.tarefas.length;
    projeto.tarefas = projeto.tarefas.filter((tarefa) => tarefa.codigo !== req.params.codigoTarefa);
    if (projeto.tarefas.length === quantidade) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    await projeto.save();
    return res.status(204).send();
  } catch (erro) { return next(erro); }
}

async function resumo(req, res, next) {
  try {
    const projeto = await Projeto.findOne({ codigo: req.params.codigo });
    if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    return res.status(200).json({ codigo: projeto.codigo, nome: projeto.nome, totalTarefas: projeto.tarefas.length, responsaveis: [...new Set(projeto.tarefas.map((tarefa) => tarefa.responsavel))] });
  } catch (erro) { return next(erro); }
}

module.exports = { listar, buscar, criar, atualizar, excluir, listarTarefas, adicionarTarefa, atualizarTarefa, excluirTarefa, resumo };
