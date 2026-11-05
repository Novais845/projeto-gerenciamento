require('dotenv').config();
const connectDatabase = require('./database');
const Projeto = require('../models/Projeto');

const projetosIniciais = [
  {
    codigo: 'PRJ001', nome: 'Desenvolvimento de Site',
    tarefas: [
      { codigo: 'TAR101', nome: 'Criar layout', responsavel: 'Ana' },
      { codigo: 'TAR102', nome: 'Desenvolver API', responsavel: 'Carlos' }
    ]
  },
  {
    codigo: 'PRJ002', nome: 'Aplicativo Mobile',
    tarefas: [
      { codigo: 'TAR201', nome: 'Criar protótipo', responsavel: 'Beatriz' },
      { codigo: 'TAR202', nome: 'Implementar login', responsavel: 'Carlos' }
    ]
  },
  {
    codigo: 'PRJ003', nome: 'Sistema de Relatórios',
    tarefas: [
      { codigo: 'TAR301', nome: 'Modelar dados', responsavel: 'Ana' },
      { codigo: 'TAR302', nome: 'Criar dashboard', responsavel: 'Diego' }
    ]
  }
];

async function seed() {
  await connectDatabase();
  const quantidade = await Projeto.countDocuments();
  if (quantidade === 0) {
    await Projeto.insertMany(projetosIniciais);
    console.log('Três projetos iniciais cadastrados.');
  } else {
    console.log('Seed ignorado: a coleção já possui dados.');
  }
  await require('mongoose').connection.close();
}

seed().catch((erro) => {
  console.error('Erro ao executar seed:', erro.message);
  process.exitCode = 1;
});
