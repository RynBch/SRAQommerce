
import express from "express"
import ordersController from '../controllers/orders.Controller.js' ;
import {auth,isClient} from '../middlewares/auth.js' ;


const router = express.Router();

// Utilisation du middleware Joi pour la vérification de données
//Lisible si admin (non implémenté pour l'instant/ donc visible par tous le monde)
router.get('/', ordersController.GetAllOrders);
// Lisible si client
router.get('/my-orders',auth, isClient, ordersController.GetOrdersByClient);
// Lisible si client
router.get('/:id',auth, isClient, ordersController.GetOrderById);
// Créable si client
router.post('/', auth, isClient, ordersController.CreateOrder);
// Editable si client 
router.patch('/:id', auth, isClient, ordersController.UpdateOrder);
// Supprimable si client
router.delete('/:id', auth, isClient, ordersController.DeleteOrder);

export default router