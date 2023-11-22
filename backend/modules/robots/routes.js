const express = require('express')
const { Kafka, logLevel } = require('kafkajs');

const router = express.Router()
var bodyParser = require('body-parser')
const asyncHandler = require('express-async-handler')
const getRobotStates = require('../../components/robotComponent').getRobotStates
const robotControler = require('./controller')

// create application/json parser
var jsonParser = bodyParser.json()

router
    .route('/')
    .get(
        asyncHandler(async (req, res) => {
            const robots = await robotControler.getAllRobots()
            return res.status(200).json(robots)
        }),
    )

router
        .route('/states')
        .get(
            asyncHandler(async (req, res) => {
                const states = getRobotStates()
            return res.status(200).json(states)
            })
        )

        router
        .route('/:id/free')
        .post(jsonParser,
            asyncHandler(async (req, res) => {

            const kafka = new Kafka({
                clientId: 'my-app',
                requestTimeout: 25000,
                connectionTimeout: 30000,
                authenticationTimeout:30000,
                retry: {
                    initialRetryTime: 3000,
                    retries: 0
                },
                brokers: ['localhost:9092']
                })
                const producer = kafka.producer()
                console.log("free robot")
                const run = async () => {
                await producer.connect();
                await   producer.send({
                topic: "robot-commands",
                messages: [
                    { value: JSON.stringify(req.body) },
                ],
                });
                await producer.disconnect();
                console.log("sent")
                res.status(200).send('message send');
            }
            run().catch((e)=>{
                console.log(e);
                res.status(500).send('error');
            })   
            })
    )


module.exports = router