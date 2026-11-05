const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  nome: { type: String, required: true, trim: true },
  responsavel: { type: String, required: true, trim: true }
}, { _id: false });

const projetoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, trim: true },
  nome: { type: String, required: true, trim: true },
  tarefas: { type: [tarefaSchema], default: [] }
}, { timestamps: true, versionKey: false });

projetoSchema.path('tarefas').validate(function (tarefas) {
  const codigos = tarefas.map((tarefa) => tarefa.codigo);
  return new Set(codigos).size === codigos.length;
}, 'Não pode haver tarefas com códigos repetidos no mesmo projeto.');

module.exports = mongoose.model('Projeto', projetoSchema);
