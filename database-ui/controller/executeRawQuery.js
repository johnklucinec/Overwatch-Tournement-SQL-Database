const executeQuery = require("../config/db");

async function executeRawQuery(queryString) {
  try {
    const result = await executeQuery(queryString);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; 
  }
}

module.exports = executeRawQuery;