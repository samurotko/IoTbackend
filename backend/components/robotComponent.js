const handelParcelRequest = require('./robotScheduling').handelParcelRequest
const updateEstimate = require('./deliveryEstimates').updateEstimate

var robotStates = []

const initalizeRobotState = (data) => {
    robotStates = data
    console.log("initalizeRobotState",robotStates)
}

const getRobotStates = () => {
    return robotStates
}

const assignParcelToRobot = (command) => {
    const parsed = JSON.parse(command)
    console.log("updateRobot",parsed)

    const index = robotStates.findIndex(r => {
        return r._id === parsed._id
    })

    var original = robotStates[index]
    original.parcel = parsed.parcel,
    original.available = parsed.available
    robotStates[index] = original
    console.log("updated", robotStates)
}

const clearRobot = async (command) => {
    const parsed = JSON.parse(command)
    console.log("updateRobot",parsed)

    const index = robotStates.findIndex(r => {
        return r._id === parsed._id
    })

    var original = robotStates[index]
    original.parcel = null,
    original.available = true
    robotStates[index] = original
    console.log("updated", robotStates)
    console.log(parsed.parcel._id)
    const update = updateEstimate(parsed.parcel._id)
    await handelParcelRequest()
}



module.exports = { assignParcelToRobot, initalizeRobotState, getRobotStates, clearRobot }