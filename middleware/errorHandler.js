const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  //Sending a second res status after sending one in the verifyJWT is causing errors
  // res.status(500).send(err.message);
};

module.exports = errorHandler;
