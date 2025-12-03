const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com');

const vehicles = [
    { plate: '30A-12345', type: 'car' },
    { plate: '29B-67890', type: 'motorbike' },
    { plate: '30E-55555', type: 'car' },
    { plate: '29M-11111', type: 'motorbike' }
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('connect', async () => {
    console.log('Traffic Generator Connected');

    // Generate 5 rounds of traffic
    for (let i = 0; i < 1; i++) {
        console.log(`--- Round ${i + 1} ---`);
        for (const vehicle of vehicles) {
            // Entry
            const entryData = {
                licensePlate: vehicle.plate,
                timestamp: new Date().toISOString(),
                action: 'entry',
                image: `http://example.com/${vehicle.plate}_entry_${i}.jpg`,
                raspberryPiId: 'pi-01'
            };
            console.log(`[${new Date().toLocaleTimeString()}] Sending ENTRY for ${vehicle.plate}`);
            client.publish('parking/scan', JSON.stringify(entryData));

            // Simulate parking duration (short for demo)
            await sleep(500 + Math.random() * 1000);

            // Exit
            const exitData = {
                licensePlate: vehicle.plate,
                timestamp: new Date().toISOString(),
                action: 'exit',
                image: `http://example.com/${vehicle.plate}_exit_${i}.jpg`,
                raspberryPiId: 'pi-01'
            };
            console.log(`[${new Date().toLocaleTimeString()}] Sending EXIT for ${vehicle.plate}`);
            client.publish('parking/scan', JSON.stringify(exitData));

            await sleep(500); // Wait before next vehicle
        }

        // Random unauthorized attempt per round
        if (Math.random() > 0.5) {
            const unauthorizedData = {
                licensePlate: `99X-${Math.floor(Math.random() * 10000)}`,
                timestamp: new Date().toISOString(),
                action: 'entry',
                image: 'http://example.com/stranger.jpg',
                raspberryPiId: 'pi-01'
            };
            console.log(`[${new Date().toLocaleTimeString()}] Sending UNAUTHORIZED ENTRY`);
            client.publish('parking/scan', JSON.stringify(unauthorizedData));
        }

        await sleep(1000);
    }

    console.log('Traffic generation complete');
    client.end();
    process.exit();
});
