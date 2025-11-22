const mqtt = require('mqtt');

const connectMQTT = () => {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com'; // Public broker for testing
    const options = {
        clientId: 'parking_server_' + Math.random().toString(16).substr(2, 8),
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
        console.log('MQTT Connected');
        client.subscribe('parking/scan', (err) => {
            if (!err) {
                console.log('Subscribed to parking/scan');
            }
        });
    });

    client.on('error', (err) => {
        console.error('MQTT Error:', err);
    });

    return client;
};

module.exports = connectMQTT;
