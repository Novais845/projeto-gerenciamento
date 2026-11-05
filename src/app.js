require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/database');
const projetoRoutes = require('./routes/projetoRoutes');

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/projetos', projetoRoutes);
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use((erro, req, res, next) => {
  if (erro.code === 11000) return res.status(409).json({ erro: 'Já existe um projeto com esse código.' });
  if (erro.name === 'ValidationError') return res.status(400).json({ erro: Object.values(erro.errors).map((item) => item.message).join(' ') });
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

if (require.main === module) {
  connectDatabase().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API executando em http://localhost:${port}`));
  }).catch((erro) => {
    console.error(`Não foi possível conectar ao MongoDB: ${erro.message}`);
    process.exit(1);
  });
}

module.exports = app;
