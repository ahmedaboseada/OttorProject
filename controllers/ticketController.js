import Ticket, { statusEnum } from "../models/ticketModel.js";

class TicketController {
    createTicket = async (req, res) => {
        const { fullname, companyname, email, phonenumber, message, service } = req.body;
        const ticket = await Ticket.create({
            fullname,
            companyname,
            email,
            phonenumber,
            message,
            service,
        });
        res.status(201).json({
            message: "Ticket created successfully",
            ticket
        });
    }
    getAllTickets = async (req, res) => {
    try {
        const { page = 1, limit = 5, service, status } = req.query;

        const filter = {};
        if (service) filter.service = service;
        if (status) filter.status = status;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const totalTickets = await Ticket.countDocuments(filter);
        const totalPages = Math.ceil(totalTickets / limitNum);

        const tickets = await Ticket.find(filter)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);

        res.status(200).json({
            message: "Tickets fetched successfully",
            tickets,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalTickets,
                limit: limitNum
            }
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    getTicketById = async (req, res) => {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }
        res.status(200).json({
            message: "Ticket fetched successfully",
            ticket
        });
    }
    updateTicketStatus = async (req, res) => { 
        const { id } = req.params;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }
        const { status } = req.body;
        if(status===ticket.status){
            return res.status(400).json({
                message: "Ticket status is the same"
            });
        }
        if((status=== statusEnum.Completed || status=== statusEnum.Cancelled)){
            return res.status(400).json({
                message: "You cannot change the status of a completed or cancelled ticket"
            });
        }
        const updatedTicket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });
    }
    deleteTicket = async (req, res) => {
        const { id } = req.params;
        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }
        res.status(200).json({
            message: "Ticket deleted successfully",
            ticket
        });
    }

    getCompletedTicketsCount = async (req, res) => {
        try {
            const completedCount = await Ticket.countDocuments({ status: 'Completed' });
            res.status(200).json({
                message: "Completed tickets count fetched successfully",
                count: completedCount
            });
        } catch (error) {
            console.error("Error fetching completed tickets count:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

const ticketController = new TicketController();
export default ticketController;
