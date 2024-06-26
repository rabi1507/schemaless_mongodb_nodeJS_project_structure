const UserModel = require('../Models/User')
const apiResponse = require('../Helper/apiResponse')
const validator = require('../Helper/Validator')
const{getCurrentDateTime} = require('../Helper/Formatting')

const register = (request, response, next)=>{

    try {
      
        // if(request.body.roles === undefined || request.body.roles.length === 0) request.body.roles = [new ObjectId(request.body.UserRoleID)]
        const {name, job} = request.body
        if( !name && !job) return apiResponse.validationError(response, "data are missing")
        UserModel.createUser(request.body).then(res=>{
            if(!res.status) throw {}
            return apiResponse.successResponseWithData(response, 'registered successfully', res.data)
        }).catch(error=>{
            return apiResponse.somethingResponse(response,error.message)
        })
    } catch (error) {
        return apiResponse.somethingResponse(response,error.message)
    }
}

module.exports= { register }