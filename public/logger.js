exports.logRequestInfo = logRequestInfo;
exports.logError = logError;

function logRequestInfo(method, url, filename, extension) {
    console.log("HTTP Request:");
    console.log("  method = " + method);
    console.log("  url = " + url);
    console.log("  file name = " + filename);
    console.log("  extension = " + extension);
}

function logError(error) {
    console.log(error);
}
