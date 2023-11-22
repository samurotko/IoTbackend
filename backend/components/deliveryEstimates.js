const estimates = []

const parseEstimate = (estimate) => {
    const parsed = JSON.parse(estimate)
    estimates.push(parsed)
    console.log("estimates updated",estimates)
}

const updateEstimate = (id) => {
    console.log("id",id, typeof(id))
    const index = estimates.findIndex(r => {
        return r._id.toString() === id
    })

    var original = estimates[index]
    console.log("original estimate",original, estimates)
    if(original){
    original.deliveryEstimate = 'delivered',
    estimates[index] = original
    }
    console.log("updated", estimates)
    return null
}

const getEstimates = () => {
    return estimates
}




module.exports = { parseEstimate, getEstimates, updateEstimate}