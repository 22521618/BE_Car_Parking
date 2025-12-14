const mqtt = require('mqtt');

const connectMQTT = () => {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com';

    const options = {
        clientId: 'parking_server_' + Math.random().toString(16).substr(2, 8),
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        protocol: 'mqtts',
        port: 8883,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        rejectUnauthorized: true,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
        console.log('✅ MQTT Connected successfully!');
        client.subscribe('parking/scan', (err) => {
            if (!err) {
                console.log('✅ Subscribed to parking/scan');
            } else {
                console.error('❌ Subscribe error:', err);
            }
        });
    });

    client.on('error', (err) => {
        console.error('❌ MQTT Connection Error:', err.message);
        console.error('Full error:', err);
    });

    client.on('close', () => {
        console.log('⚠️ MQTT connection closed');
    });

    client.on('reconnect', () => {
        console.log('🔄 MQTT reconnecting...');
    });

    client.on('offline', () => {
        console.log('📴 MQTT client offline');
    });

    return client;
};

module.exports = connectMQTT;