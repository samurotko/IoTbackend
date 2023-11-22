const express = require('express')
const getEstimates = require('../../components/deliveryEstimates').getEstimates

var bodyParser = require('body-parser')
const router = express.Router()
const asyncHandler = require('express-async-handler')



router
    .route('/')
    .get(
        asyncHandler(async (req, res) => {
            const estimates = getEstimates()
        return res.status(200).json(estimates)
    })
    )

module.exports = router
    