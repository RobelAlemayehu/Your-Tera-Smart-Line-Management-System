'use strict';
const queueService = require('./services/queueService');
const { sequelize } = require('./models');

async function runTest() {
    try {
        console.log("🚀 Starting System Test...");

        // 1. Test Database Connection
        await sequelize.authenticate();
        console.log("✅ Database Connected.");

        // 2. Simulate a User Joining the Queue
        // Replace with a real user_id and service_id from your DB, and YOUR phone number
        const testUserId = 1; 
        const testServiceId = 3; 
        const testOfficeId = 1;
        const myPhoneNumber = "+251978090782"; // USE YOUR REAL NUMBER HERE

        console.log("📨 Testing SMS #1: Joining Queue...");
        const ticket = await queueService.joinQueue(
            testUserId, 
            testServiceId, 
            testOfficeId, 
            myPhoneNumber
        );
        console.log(`✅ Ticket Created: ${ticket.ticket_number} at Position: ${ticket.position}`);

        // 3. Simulate Staff calling the user (Wait 3 seconds first)
        console.log("⏳ Waiting 3 seconds before calling ticket...");
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("🔔 Testing SMS #3: Staff calling 'Next'...");
        await queueService.updateTicketStatus(ticket.ticket_id, 'Serving');
        console.log("✅ Status updated to 'Serving'. Check your phone!");

    } catch (error) {
        console.error("❌ Test Failed:", error.message);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

runTest();