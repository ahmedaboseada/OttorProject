import {Router} from 'express';
const ticketRouter = Router();
import ticketController from '../controllers/ticketController.js';
import { validation } from '../middlewares/validation.js';
import { createTicketValidation, getAllTicketsValidation, getTicketByIdValidation, updateTicketValidation, deleteTicketValidation } from '../validations/ticketValidation.js';
import { verifyToken } from '../middlewares/authentication.js';

ticketRouter.post('/', validation(createTicketValidation), ticketController.createTicket);
ticketRouter.get('/', verifyToken, validation(getAllTicketsValidation), ticketController.getAllTickets);
ticketRouter.get('/stats/completed', ticketController.getCompletedTicketsCount);
ticketRouter.get('/:id', verifyToken, validation(getTicketByIdValidation), ticketController.getTicketById);
ticketRouter.put('/:id',verifyToken, validation(updateTicketValidation), ticketController.updateTicketStatus);
ticketRouter.delete('/:id', verifyToken, validation(deleteTicketValidation), ticketController.deleteTicket);

export default ticketRouter;
