import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // routes below this one will use this middleware
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

module.exports = routes;
