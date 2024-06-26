const connectToDB = require('../Config/mongoConfig');
const { logRequest } = require('./Formatting');

const create = async (query,collection_name,logInfo) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      const result = await collection.insertOne(query);

      try {
        // Log the request details
        await logRequest(logInfo);
      } catch (logError) {
        return {status:true, data:result}  
      }

      return {status:true, data:result}
    } catch (error) {
      return {status:false,error}
    } 
}
const createMany = async (query,collection_name,logInfo) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      
      const result = await collection.insertMany(query);

      try {
        // Log the request details
        await logRequest(logInfo);
      } catch (logError) {
        return {status:true, data:result}  
      }

      return {status:true, data:result}
    } catch (error) {
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}

const getMany = async (query,collection_name,projection) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    projection = projection || {};
    const result = await collection.find(query).project(projection).toArray();

    if (result.error)  throw {error:result.error}
    
    return { status: true, data: result };
  } catch (error) {
    console.error('An error occurred:', error);
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
}

const getOne = async (query,collection_name,projection) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      projection = projection || {};
      console.log(query);
      console.log(projection);
      const result = await collection.findOne(query,{ projection : projection });
      if(result == null || result.length==0) throw {}

      return {status:true, data:result}  
    } catch (error) {
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}

const aggregate = async(query, collection_name) => {
  let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      const cursor = collection.aggregate(query);
      if(cursor == null) throw {};

      const result = await cursor.toArray();
      if(result == null) throw {}
      return {status:true, data:result}
    } catch (error) {
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}

const updateOne = async (query, update, collection_name,logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.updateOne(query, update);

    if (result.matchedCount <= 0 && result.modifiedCount === 0) throw {};

    try {
      // Log the request details
      await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Document updated successfully" };
    }
    return { status: true, message: "Document updated successfully" };
  } catch (error) {
    console.log(error);
    console.error('An updateError occurred:');
    return { status: false, message: "Failed to update document" };
  } 
  // finally {
  //   db?.client.close();
  // }
}

const updateMany = async (query, update, collection_name, logInfo) => {
  let db;
  try {
    db = await connectToDB()
    const collection = db.collection(collection_name)
    const result = await collection.updateMany(query, update)

    if (result.matchedCount <= 0 && result.modifiedCount === 0) throw {}

    try {
      // Log the request details
      await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Document updated successfully" };
    }
    
    return { status: true, message: "Documents updated successfully" }
  } catch (error) {
    console.error('An updateError occurred:', error)
    return { status: false, message: "Failed to update documents" }
  } 
  // finally {
  //   db?.client.close()
  // }
};

const distinct = async(query,collection_name) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.distinct(query);
    return { status: true, data: result };
  } catch (error) {
    console.error('An distinctError occurred:', error);
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
}

const sort = async (query, collection_name, sortQuery, limit,fields) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    limit = limit || 1;
    const cursor =  collection.find(query).project(fields).sort(sortQuery).limit(limit);
    const result = await cursor.toArray();
    if (result.length === 0) throw {};
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};

const removeMany = async (query, collection_name,logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const data =  await collection.deleteMany(query);
    if (result.length === 0) throw {};

    try {
      // Log the request details
      await logRequest(logInfo);
    } catch (logError) {
      return { status: true, data: result };
    }

    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};

const removeOne = async (query, collection_name,logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) throw {};

    try {
      // Log the request details
      await logRequest(logInfo);
    } catch (logError) {
      return { status: true, data: result };
    }

    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};



module.exports = {
  create,
  getOne,
  removeOne,
  updateOne,
  createMany,
  removeMany,
  getMany,
  updateMany,
  aggregate,
  distinct,
  sort,
}
