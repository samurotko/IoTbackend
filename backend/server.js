const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const subscribeConsumer = require("./kafkaConsumer").subscribeConsumer
const initalizeRobotState = require('./components/robotComponent').initalizeRobotState
const robotsController = require('./modules/robots/controller')

require('./modules/routes')(app)



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const subscribeKafka = async () => {
await subscribeConsumer()
}

const setRobotState = async () => {
const initialState = await robotsController.getAllRobots()
  initalizeRobotState(initialState)
}

subscribeKafka()
setRobotState()

