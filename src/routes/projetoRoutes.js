const express = require('express');
const controller = require('../controllers/projetoController');

const router = express.Router();
router.get('/', controller.listar);
router.post('/', controller.criar);
router.get('/:codigo/tarefas', controller.listarTarefas);
router.post('/:codigo/tarefas', controller.adicionarTarefa);
router.put('/:codigo/tarefas/:codigoTarefa', controller.atualizarTarefa);
router.delete('/:codigo/tarefas/:codigoTarefa', controller.excluirTarefa);
router.get('/:codigo/resumo', controller.resumo);
router.get('/:codigo', controller.buscar);
router.put('/:codigo', controller.atualizar);
router.delete('/:codigo', controller.excluir);

module.exports = router;
