const express = require('express')

const router = express.Router()
const asyncHandler = require('express-async-handler')


router
    .route('/')
    
    .get(
        asyncHandler(async (req, res) => {
            // const projects = await ProjectController.getProjectPreviewsByEvent(
            //     req.event._id,
            // )
            return res.status(200).json("station")
        }),
    )

module.exports = router