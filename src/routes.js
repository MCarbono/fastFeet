import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import TaskController from './app/controllers/TaskController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/deliveries/:id', TaskController.list); // this route shows all deliveries by the id of the deliveryman that it's not calceled or ended
routes.get('/deliveryman/:id/deliveries', TaskController.listEnded); // this route show all the deliveries that was deliveried by the deliveryman
routes.put(
  '/deliveryman/:idDeliveryman/deliveries/:idDelivery',
  TaskController.takePackage
); // this route inserts a date to a start_date field.
routes.put(
  '/deliveryman/deliveries/:id',
  upload.single('file'),
  TaskController.deliverOrder
); // this route inserts a date to a end date field and a signature_id field, it's a picture.

routes.post('/delivery/:id/problems', DeliveryProblemsController.store); // this route makes registers the problems of a delivery in deliveries_problems table with a DeliveryProblmesController

routes.use(authMiddleware); // routes below this one will use this middleware
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.get('/deliveryman', DeliverymanController.list);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.delete('/deliveryman/:id', DeliverymanController.destroy);

routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.get('/deliveries', DeliveryController.list);
routes.get('/deliveries/:id', DeliveryController.show);
routes.delete('/deliveries/:id', DeliveryController.destroy);

routes.get('/delivery/problems', DeliveryProblemsController.list); // list all orders with a delivery problem
routes.get('/delivery/:id/problems', DeliveryProblemsController.show); // this route shows all the problems for a specific delivery
routes.delete(
  '/problems/:id/cancel-delivery',
  DeliveryProblemsController.destroy
); // this route puts a date to the canceled_at field in deliveries table
routes.post('/files', upload.single('file'), FileController.store);
module.exports = routes;
