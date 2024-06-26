const { ObjectId } = require('mongodb');
const connectToDB = require('../Config/mongoConfig')
const { create} = require('../Helper/mongo')
const collection_name = "User"

const createUser = async (body) => {
    let query = {
        name:body.name,
        job:body.job,
       
    }

  
    return await create(query,collection_name,{activity : {user : body.name , job : body.job, action: "create" }})
}

module.exports = {createUser}