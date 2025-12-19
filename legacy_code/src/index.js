require('dotenv').config();
const connectDB = require('./config/database');
const connectMQTT = require('./config/mqtt');
const handleMessage = require('./mqtt/handler');

// Load Models
require('./models/Resident');
require('./models/Vehicle');
require('./models/ParkingSession');
require('./models/AccessLog');

// Connect to Database
connectDB();

// Connect to MQTT Broker
const mqttClient = connectMQTT();

// Handle MQTT Messages
mqttClient.on('message', (topic, message) => {
    handleMessage(topic, message, mqttClient);
});

console.log('Parking Management Server Started');

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    mqttClient.end();
    process.exit();
});
