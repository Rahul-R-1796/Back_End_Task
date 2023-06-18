// Import required modules
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Read data from JSON files
const roomsData = fs.readFileSync('rooms.json');
const bookingsData = fs.readFileSync('bookings.json');

// Parse JSON data
let rooms = JSON.parse(roomsData);
let bookings = JSON.parse(bookingsData);

app.get('/', (req, res) => {
    res.send('Welcome to the Hall Booking API!');
  });

// API endpoint to create a room
app.post('/rooms', (req, res) => {
  const { seats, amenities, price } = req.body;

  // Create a new room object
  const room = {
    id: rooms.length + 1,
    seats,
    amenities,
    price
  };

  // Add the room to the rooms array
  rooms.push(room);

  res.json(room);
});


// API endpoint to book a room
app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room is already booked for the same date and time
  const conflictingBooking = bookings.find(booking => booking.roomId === roomId && booking.date === date &&
    ((booking.startTime >= startTime && booking.startTime < endTime) || (booking.endTime > startTime && booking.endTime <= endTime)));

  if (conflictingBooking) {
    return res.status(409).json({ error: 'The room is already booked for the specified date and time.' });
  }

  // Create a new booking object
  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId
  };

  // Add the booking to the bookings array
  bookings.push(booking);

  res.json(booking);
});

// API endpoint to list all rooms with booked data
app.get('/rooms/bookings', (req, res) => {
  const roomBookings = rooms.map(room => {
    const bookingsForRoom = bookings.filter(booking => booking.roomId === room.id);

    return {
      roomName: room.name,
      bookings: bookingsForRoom
    };
  });

  res.json(roomBookings);
});

// API endpoint to list all customers with booked data
app.get('/customers/bookings', (req, res) => {
  const customerBookings = bookings.map(booking => {
    const room = rooms.find(room => room.id === booking.roomId);

    return {
      customerName: booking.customerName,
      roomName: room.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime
    };
  });

  res.json(customerBookings);
});

// API endpoint to list the number of times a customer has booked a room
app.get('/customers/:customerId/bookings', (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const customerBookings = bookings.filter(booking => booking.customerId === customerId);

  res.json(customerBookings);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
