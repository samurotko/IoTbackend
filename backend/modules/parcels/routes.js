const express = require('express')
const { Kafka, logLevel } = require('kafkajs');

var bodyParser = require('body-parser')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const basePath = 'http://localhost:3000/parcels/'

router
    .route('/')
    .get(
        asyncHandler(async (req, res) => {
            fetch(basePath)
    .then(response => response.json())
    .catch(error => res.status(400).json(error))
    .then(response =>  {
        console.log(response)
        return res.status(200).json(response)
    })
    }))

router
    .route('/:_id')
    .get(
        asyncHandler(async (req, res) => {
            fetch(basePath)
        .then(response => response.json())
        .catch(error => res.status(400).json(error))
        .then(response =>  {
            console.log(response)
            return res.status(200).json(response)
        })
    }))
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
          console.log("posting a parcel")
          const run = async () => {
          await producer.connect();
          await   producer.send({
            topic: "parcels",
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