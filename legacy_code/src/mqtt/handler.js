const parkingService = require('../services/parkingService');

const handleMessage = async (topic, message) => {
    if (topic === 'parking/scan') {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received scan data:', data);

            const result = await parkingService.handleScan(data);

            // Here you could publish the result back to a response topic if needed
            // client.publish('parking/response', JSON.stringify(result));
            console.log('Process result:', result);

        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
};

module.exports = handleMessage;
