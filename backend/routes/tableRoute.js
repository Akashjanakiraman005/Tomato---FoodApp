import express from 'express';
import { addTable, listTables, updateStatus, removeTable } from '../controllers/tableController.js';

const tableRouter = express.Router();

tableRouter.get('/list', listTables);
tableRouter.post('/add', addTable);
tableRouter.post('/update', updateStatus);
tableRouter.post('/remove', removeTable);

export default tableRouter;
