const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to WebSocket Server');
});

socket.on('parking/live-feed', (data) => {
    console.log('Received parking/live-feed:', data);
});

socket.on('dashboard/stats', (data) => {
    console.log('Received dashboard/stats:', data);
});

socket.on('parking/alert', (data) => {
    console.log('Received parking/alert:', data);
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket Server');
});

// Keep alive for a bit
setTimeout(() => {
    console.log('Test Client Timeout');
    process.exit(0);
}, 15000);
