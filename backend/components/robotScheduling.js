const express = require('express')
const { Kafka, logLevel } = require('kafkajs');
//const {consumer, kafka} = require('../kafkaConsumer')

const robotController = require('../modules/robots/controller')

var bodyParser = require('body-parser')
const router = express.Router()
const asyncHandler = require('express-async-handler')

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
const producer = kafka.producer()

const pendingParcels = []

const dropPoint = [0,0]
const robotSpeed = 50 //seconds per distanceunit

const compareDistance = (parcel, robot1, robot2) => {
    const parcelLocation = JSON.parse(parcel.location)
    const robot1Location = robot1.location
    const robot2Location = robot2.location

    console.log(parcelLocation)
    const getDistance = (x1,y1,x2,y2) => {
    let y = x2 - x1
    let x = y2 - y1
    return Math.sqrt(x * x + y * y)
    }

    const robot1Distance = getDistance(robot1Location[0], robot1Location[1], parcelLocation[0], parcelLocation[1])
    const robot2Distance = getDistance(robot2Location[0], robot2Location[1], parcelLocation[0], parcelLocation[1])
    return robot1Distance - robot2Distance

}

const countDeliveryTime = (robot, parcel) => {
    const parcelLocation = JSON.parse(parcel.location)
    const distToParcel = Math.abs(parcelLocation[0] - robot.location[0]) + Math.abs(parcelLocation[1] - robot.location[1])
    const distToDrop = parcelLocation[0] + parcelLocation[1]
    const t = new Date()
    console.log(t)
    const deliveryTime = new Date(t.setSeconds(t.getSeconds() + (distToParcel + distToDrop) * robotSpeed)).toISOString()
    console.log("deliveryTime", robot.location, parcelLocation, distToParcel, distToDrop, deliveryTime)
    return deliveryTime

}

const addParcel = async (incomingParcel) => {
    const parcel = JSON.parse(incomingParcel)
    console.log("parsed message", parcel)
    const parcelDL = Date.parse(parcel.deadline,"yyyy-MM-ddTHH:mm.sssZ")
    const insertIdx = pendingParcels.findIndex(e => parcelDL > Date.parse(e.deadline) )
    pendingParcels.splice(insertIdx, 0, parcel)

    console.log("pending",pendingParcels)
    
    robotSceduling()
    //count time to fetch
    //assign to robot (set to unavailable)
}



const robotSceduling = async () => {
    const prioParcel = pendingParcels[0]
    //get robots
    const availabeRobots = robotController.getAllRobotsAvailable()
    if(availabeRobots === null || availabeRobots === undefined || availabeRobots?.length === 0){
        console.log("no robots available")
        return null
    }

    console.log("prioParcel",prioParcel)
    //sort robots by distance
    const sorted = availabeRobots.sort((a,b) => compareDistance(prioParcel, a,b))
    console.log("sorted robots", sorted)

    const robotToAssign = sorted[0]
    console.log("locations",robotToAssign.location,prioParcel.location)
    
    //count time to fetch
    const deliveryTime = countDeliveryTime(robotToAssign, prioParcel)


    // assigndelivery estimate
    const estimate = {
        _id: prioParcel._id,
        customer: prioParcel.customer,
        deliveryEstimate: deliveryTime
    }


    const runDeliveryEstimate = async () => {
        await producer.connect();
        await   producer.send({
          topic: "delivery-estimates",
          messages: [
            { value: JSON.stringify(estimate) },
          ],
        });
        await producer.disconnect();
      
        console.log('delivery estimate message send', estimate);
      }
      runDeliveryEstimate().catch((e)=>{
          console.log(e);
      }) 


    const newRobotStatus = {
        ...robotToAssign,
        available: false,
        parcel: prioParcel,
        action: 'assign'
    }

    console.log("newRobotStatus",newRobotStatus)
    
    //assign to robot (set to unavailable)
    const runCommand = async () => {
        await producer.connect();
        await   producer.send({
          topic: "robot-commands",
          messages: [
            { value: JSON.stringify(newRobotStatus) },
          ],
        });
        await producer.disconnect();
      
        console.log('robot-commands send', newRobotStatus);
      }
      runCommand().catch((e)=>{
          console.log(e);
      })   

}


const handelParcelRequest = async () => { 
    if(pendingParcels.length > 0){
        await robotSceduling()
    }

}


module.exports = { addParcel, handelParcelRequest }