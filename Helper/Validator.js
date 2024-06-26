const moment = require('moment')
const apiResponse = require('./apiResponse')

function isValidMobileNumber(number) {
  const pattern = /^[6789]\d{9}$/;
  return pattern.test(number);
}

function isValidMobilewithCountryCode(number) {
    const pattern = /^\+91-\d{10}$/;
    return pattern.test(number);
  }

function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

const InputChecks = async(request,response,next) => {
    const body = request.body;
    if(body.startDate) body.FromDate = body.startDate
    if(body.endDate) body.ToDate = body.endDate

    let {VersionId,FromDate,ToDate} = body;

    if(FromDate && ToDate && FromDate > ToDate) return apiResponse.validationError(response,"Start date should be lesser than End date")

    return next();
}

const recursiveFeatureValidation = async() => {
    const body = request.body;
    if(body.startDate) body.FromDate = body.startDate
    if(body.endDate) body.ToDate = body.endDate

    let {VersionId,FromDate,ToDate} = body;
    if(FromDate && ToDate && FromDate > ToDate) return apiResponse.validationError(response,"Start date should be lesser than End date")

    return next();
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  
  if (isNaN(date)) {
      return false;
  }

  const [year, month, day] = dateString.split('T')[0].split('-');
  
  if (Number(year) !== date.getFullYear() || Number(month) !== date.getMonth() + 1 || Number(day) !== date.getDate()) {
      return false;
  }

  return true;
}


module.exports={
    isValidMobileNumber,
    isValidMobilewithCountryCode,
    isValidEmail,
    InputChecks,
    recursiveFeatureValidation,
    isValidDate
}