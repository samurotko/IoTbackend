const express = require('express')

var bodyParser = require('body-parser')
const getRobotStates = require('../../components/robotComponent').getRobotStates

const basePath = 'http://localhost:3000/robots/'

const controller = {}

controller.getAllRobotsAvailable = () => {
    
    console.log("getting robots")
        const available = getRobotStates().filter(r => r.available)
    console.log("getAllRobotsAvailable",available)
    return available
    
}

controller.getAllRobots = () => {
    console.log("getting robots")
 
    return new Promise((resolve, reject) => {
        fetch(basePath)
        .then(response => response.json())
        .catch(error =>  {
            reject(error) 
            
        })
        .then(response =>  {
    console.log("getAllRobots",response)
    resolve(response)
    
})
})

}

module.exports = controller
