const asyncHandler = require('express-async-handler')

const chargingStationRouter = require('./chargingStations/routes.js')
const parcelsRouter = require('./parcels/routes')
const robotsRouter = require('./robots/routes')
const estimatesRouter = require('./deliveryEstimates/routes')

const db = 'http://localhost:3000'

module.exports = app => {

    app.use('/api/charginStations', chargingStationRouter)
    app.use('/api/parcels', parcelsRouter)
    app.use('/api/robots', robotsRouter)
    app.use('/api/estimates',estimatesRouter)

}