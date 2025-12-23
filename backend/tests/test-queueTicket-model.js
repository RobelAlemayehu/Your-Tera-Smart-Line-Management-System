const { User, Office, Service, QueueTicket, sequelize } = require('../models');

(async () => {
  try {
    // 1. Verify Connection
    await sequelize.authenticate();
    console.log('DB connection successful.');

    // 2. Create a parent Office
    const office = await Office.create({
      office_name: `Bole Branch_${Date.now()}`,
      location: 'Addis Ababa'
    });
    console.log('Office created:', office.office_name);

    // 3. Create a Service for that Office
    const service = await Service.create({
      office_id: office.office_id,
      service_name: 'Currency Exchange',
      avg_wait_time: 20
    });
    console.log('Service created:', service.service_name);

    // 4. Create a User
    const user = await User.create({
      phone_number: `+2519${Math.floor(Math.random() * 100000000)}`,
      role: 'Customer'
    });
    console.log('User created with ID:', user.user_id);

    // 5. Create the Queue Ticket (The main test)
    const ticket = await QueueTicket.create({
      user_id: user.user_id,
      service_id: service.service_id,
      ticket_number: 501, // Manual ticket number for now
      status: 'Waiting'
    });

    console.log('Queue Ticket successfully created:');
    console.log({
      id: ticket.ticket_id,
      number: ticket.ticket_number,
      status: ticket.status,
      issued_at: ticket.issued_at
    });

    // 6. Verification: Fetch the ticket back
    const foundTicket = await QueueTicket.findByPk(ticket.ticket_id);
    if (foundTicket) {
      console.log('Database verification: Ticket exists in Queue_Tickets table.');
    }

    process.exit(0);
  } catch (error) {
    console.error('QueueTicket Test Failed:', error);
    process.exit(1);
  }
})();