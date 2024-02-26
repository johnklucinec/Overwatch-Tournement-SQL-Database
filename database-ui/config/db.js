var mysql = require("mysql");

var hostname = "n4q.h.filess.io";
var database = "OverwatchTournament_leftplenty";
var port = "3305";
var username = "OverwatchTournament_leftplenty";
var password = "d60f50465feb727531319b3c431daad9083bafab";

var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  console.log("Connected to MySQL!");
});

const executeQuery = (queryString, params = []) => {
  return new Promise((resolve, reject) => {
    con.query(queryString, params, function (err, results) {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = executeQuery;