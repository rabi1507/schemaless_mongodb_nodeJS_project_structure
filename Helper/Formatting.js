const fs = require('fs');
const path = require('path');
const moment = require('moment');

const connectToDB = require('../Config/mongoConfig');


const { networkInterfaces } = require('os');


function getData(result) {
    let inputData = []
    if (result && result.recordsets && result.recordsets[0]) {
        inputData = result.recordsets[0]
    }
    return inputData
}
function rowsAffected(result) {
    let inputData = []
    if (result && result.rowsAffected) {
        inputData = result.rowsAffected[0]
    }
    return inputData
}

function generateReferralcode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const getLastMonthCount = (userData) => {
    
    userData = userData.filter(u=>{
        let CreatedDatetime = moment(u.CreatedDate)
        let lastMonthStartDate = new Date()
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth()-1)
        if(CreatedDatetime>moment(lastMonthStartDate)){
            return u
        }
    });


    return userData;
}

const getLastYearCount = (userYear) => {
     userYear = userYear.filter(u=>{
               
        let CreatedDatetime = moment(u.CreatedDate)
        let lastYearStartDate = new Date()
        
        lastYearStartDate.setYear(lastYearStartDate.getFullYear()-1)
        
       
        if(CreatedDatetime>moment(lastYearStartDate)){
            return u
        }
    });

    return userYear;
}

const getGraphPoints= (dataList) => {

      var dt;    
    dataList= dataList.filter(d=>d.DateBit==1)


    try {
        const points = {
            "Jan":0,
            "Feb":0,
            "Mar":0,
            "Apr":0,
            "May":0,
            "Jun":0,
            "Jul":0,
            "Aug":0,
            "Sep":0,
            "Oct":0,
            "Nov":0,
            "Dec":0
        };
        
        dataList.forEach(d => {
          const createdDate = moment(d.CreatedDate).format("DD MMM YYYY");
          const month = moment(createdDate, 'DD MMM YYYY').format('MMM');
            
          if(d.total){
            points[month] += d.smsCount
          }
          else  points[month] += 1;
        });
      
        return points;
    } catch (error) {
        console.log(dt);
        console.log(error);
        return {}
    }
   
}

const getAnalysisData= (data,type) => {
    try {
        return {
            type,
            count:data.filter(d=>d.DateBit==1).length,
            categories:Object.keys(getGraphPoints(data)),
            points:Object.values(getGraphPoints(data))
        }
    }catch (error) {
        console.log(error);
        return {}
    }
}

const getDurationDates= (duration) => {
    try {
        let startDate = moment().subtract(duration*2,'days').format('YYYY-MM-DD')
        let midDate = moment().subtract(duration,'days').format('YYYY-MM-DD')
        let endDate = moment().format('YYYY-MM-DD');
        
        return {startDate, midDate,endDate}
    } catch (error) {
        console.log(error);
        return {}
    }
}

function getCurrentDateTime(){
    let currentDate = new Date();
    return currentDate

}

function getDiffDateTime(days){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+days)
    return currentDate

}
function getDiffDateTimeMin(min){
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes()+min)
    return currentDate

}

function get24HoursPrevTime(diffDays){
    const currentUtcTime = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();
    const localTime = currentUtcTime - (timezoneOffset * 60 * 1000);
    const oneDayBefore = localTime - (diffDays * 24 * 60 * 60 * 1000);
    const oneDayBeforeDate = new Date(oneDayBefore);
    return oneDayBeforeDate
}

const getServerIP = () => {
    try {
      const nets = networkInterfaces();
      const results = {};
  
      for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
              const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
              if (net.family === familyV4Value && !net.internal) {
                  if (!results[name]) {
                      results[name] = [];
                  }
                  results[name].push(net.address);
              }
          }
      }
     
      let IP = results?.Ethernet ? results?.Ethernet :  results['Wi-Fi'] ? results['Wi-Fi'] : []
      return IP != [] ? IP[0] : ""
    } catch (error) {
         console.log(error);
         return ""
    }
}

function getClientIP(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = forwardedFor.split(',');
      return ips[0];
    }
    return req.connection.remoteAddress;
}

const logRequest = async (logInfo) => {
    try {
      
    let ip = logInfo?.ip || ""
    let endpoint = logInfo?.endpoint || ""
    let queryString = logInfo?.queryString || ""
    let body = logInfo?.body || {}
    let activity = logInfo?.activity || false

    const parentDirectory = path.join(__dirname, "..")
    const logDirectory = path.join(parentDirectory, 'Logs');
  
      try {
        await fs.promises.mkdir(logDirectory);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
  
        const currentDate = moment().format('YYYY-MM-DD');
        const logFilePath = path.join(logDirectory, `${currentDate}.txt`);
        const logMessage = `[${moment().format('HH:mm:ss')}]\nIP ADDRESS : ${ip}\nAPI_ENDPOINT: ${endpoint}\nREQUEST_BODY: ${JSON.stringify(body)}\nQUERY : ${queryString}\n\n`;

        if(activity && activity?.ModuleKey){
            let db = await connectToDB();
            const collection = db.collection("Activity");
            await collection.insertOne({ip, endpoint, ...activity, CreatedDate : getCurrentDateTime()}); 
        }
        await fs.promises.appendFile(logFilePath, logMessage);

    } catch (error) {
      console.error('Error logging request:', error);
    }
};

const findLastIndex = (array, value) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (JSON.stringify(array[i]) === JSON.stringify(value)) {
        return i; // Return the index of the last occurrence
      }
    }
    return -1; // Return -1 if the value is not found in the array
}

const convertUtcToIst = (dateString) => {
    // Parse the UTC time string
    const utcDate = moment.utc(dateString);
  
    // Set the time zone to IST (Indian Standard Time)
    const istDate = utcDate.clone().tz('Asia/Kolkata');
  
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = istDate.format('YYYY-MM-DD');
  
    return formattedDate;
}


const getUpdatedFields = (oldData, newData) => {
    
    let newObj = {}
    let oldObj = {}

    for(const key in newData) {
        if((Array.isArray(newData[key]) && !JSON.stringify(newData[key]) == JSON.stringify(oldData[key]) )
        ) {
           
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
        else if(newData[key] != oldData[key]){
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
       
    }

    return {new : newObj, old : oldObj}
}



module.exports={
    generateReferralcode,
    rowsAffected,
    getLastMonthCount,
    getLastYearCount,
    getGraphPoints,
    getData,
    getAnalysisData,
    getDurationDates,
    getCurrentDateTime,
    get24HoursPrevTime,
    getDiffDateTime,
    getDiffDateTimeMin,
    logRequest,
    getClientIP,
    findLastIndex,
    convertUtcToIst,
    getUpdatedFields,
}