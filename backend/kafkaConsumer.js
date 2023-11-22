const { Kafka, logLevel } = require('kafkajs');
const addParcel = require('./components/robotScheduling').addParcel
const parseEstimate = require('./components/deliveryEstimates').parseEstimate
const assignParcelToRobot = require('./components/robotComponent').assignParcelToRobot
const clearRobot = require('./components/robotComponent').clearRobot


const kafka = new Kafka({
    clientId: 'my-app',
    requestTimeout: 25000,
    connectionTimeout: 30000,
    authenticationTimeout:30000,
    retry: {
      initialRetryTime: 3000,
      retries: 0
    },
    logLevel: logLevel.INFO,
    brokers: ['localhost:9092']
  });


// consume kafka message and forward the message to CPI 
const consumer = kafka.consumer({ groupId: 'my-app' })

//let consumer1 =  new kafka.Consumer(client,[ {topic: 'topic1', partition: 0}], {groupId: 'group1'});

const subscribeConsumer = async () => {
    console.log("consuming")
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({topic: "robot-commands"})
    await consumer.subscribe({topic: "delivery-estimates"})
    await consumer.subscribe({topic: "parcels"})

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          // Handle each message based on the topic
          console.log({
            value: message.value.toString(),
            topic,
            partition,
            offset: message.offset,
          });
          switch (topic) {
            case 'parcels':
                addParcel(message.value)
                break
            case 'delivery-estimates':
                parseEstimate(message.value)
                break
            case 'robot-commands':
                
                const parsed = JSON.parse(message.value)
                console.log('robot-commands', parsed.action.toString())
                if(parsed.action === 'clear'){
                    console.log("clearing")
                    clearRobot(message.value)

                }
                if(parsed.action.toString() === 'assign'){
                    console.log("assigning")
                    assignParcelToRobot(message.value)
                }
                break
          }
        },
      })

    return consumer
}

module.exports = {subscribeConsumer, consumer, kafka}