function checkValidKeys(validKeys, reqBody) {
    const updates = reqBody
    const allowedUpdates = validKeys
    //console.log (validKeys, reqBody, updates, allowedUpdates)
    return updates.every((update) => allowedUpdates.includes(update))
}

module.exports = checkValidKeys