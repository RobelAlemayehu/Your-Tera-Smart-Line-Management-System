const queueService = require('../services/queueService');

// 1. Join a Queue (Citizen action)
exports.join = async (req, res) => {
    try {
        // Use the same names your frontend will send in the JSON body
        const { serviceId, officeId, phone_number } = req.body;

        // Ensure req.user exists (if using Auth) or use a fallback for testing
        const userId = req.user ? req.user.id : req.body.userId; 

        const ticket = await queueService.joinQueue(
            userId, 
            serviceId, 
            officeId,
            phone_number // Matches the 4th argument in your Service
        );

        res.status(201).json({
            success: true,
            message: "Successfully joined the queue",
            ticket
        });
    } catch (error) {
        // Logging the error helps you debug during frontend integration
        console.error("Join Queue Error:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Update Ticket Status (Staff action)
exports.updateStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body; 

        const updatedTicket = await queueService.updateTicketStatus(ticketId, status);
        
        res.status(200).json({
            success: true,
            message: `Ticket marked as ${status}`,
            updatedTicket
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};