const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    console.log('Test Client Connected');

    const entryData = {
        licensePlate: '30A-12345',
        timestamp: new Date().toISOString(),
        action: 'entry',
        image: 'http://example.com/entry.jpg',
        raspberryPiId: 'pi-01'
    };

    console.log('Sending Entry Data...');
    client.publish('parking/scan', JSON.stringify(entryData));

    setTimeout(() => {
        const exitData = {
            licensePlate: '30A-12345',
            timestamp: new Date().toISOString(),
            action: 'exit',
            image: 'http://example.com/exit.jpg',
            raspberryPiId: 'pi-01'
        };

        console.log('Sending Exit Data...');
        client.publish('parking/scan', JSON.stringify(exitData));

        setTimeout(() => {
            client.end();
            process.exit();
        }, 1000);

    }, 5000);
});
