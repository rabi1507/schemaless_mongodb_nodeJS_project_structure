exports.successResponse = function (res, msg) {
	var responseData = {
		status: 200,
		message: msg
	};
	logResponse(responseData)
	return res.status(200).json(responseData);
};



exports.partialSuccessResponse = function (res, msg) {
	var responseData = {
		status: 206,
		message: msg
	};
	logResponse(responseData)
	return res.status(206).json(responseData);
};




exports.successResponseWithData = function (res, msg, data) {
	var responseData = {
		status: 200,
		message: msg,
		data: data
	};
	logResponse(responseData)
	return res.status(200).json(responseData);
};



exports.ErrorResponse = function (res, msg, err) {
	var responseData = {
		status: 500,
		message: msg,
		Error:err
	};
	logResponse(responseData)
	return res.status(500).json(responseData);
};

exports.notFoundResponse = function (res, msg) {
	var responseData = {
		status: 404,
		message: msg,
	};
	logResponse(responseData)
	return res.status(404).json(responseData);
};

exports.validationErrorWithData = function (res, msg, data) {
	var responseData = {
		status: 400,
		message: msg,
		data: data
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
};

exports.validationError = function (res, msg) {
	var responseData = {
		status: 400,
		message: msg
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
};

exports.unauthorizedResponse = function (res, msg) {
	var responseData = {
		status: 401,
		message: msg,
	};
	logResponse(responseData)
	return res.status(401).json(responseData);
};
exports.duplicateResponse = function (res, msg) {
	var responseData = {
		status: 409,
		message: msg,
	};
	logResponse(responseData)
	return res.status(responseData.status).json(responseData);
};

exports.customResponse = function (res, msg, data, info) {
	var responseData = {
		status: 400,
		message: msg,
		data:data,
		info,
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
};
exports.somethingResponse = function (res,info) {
	var responseData = {
		status: 400,
		message: "Something went wrong! Please try again later.",
		info
	};
	logResponse(responseData)
	return res.status(400).json(responseData);
};

function logResponse(responseData){
	// console.error("\x1B[36m"+JSON.stringify(responseData, null, 2)+"\x1B[39m")
	console.error("=======================================================\n");
}