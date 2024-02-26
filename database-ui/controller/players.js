const executeQuery = require("../config/db");

async function executeDbQuery(query, params = []) {
  try {
    const result = await executeQuery(query, params);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error; 
  }
}

// Function to retrieve all players
async function getAllPlayers() {
  const query = getPlayersAndMMR;
  return await executeDbQuery(query);
}

// Function to add a new player
async function addPlayer(username, email) {
  const query = "INSERT INTO Players (username, email, createdAt) VALUES (?, ?, NOW())";
  return await executeDbQuery(query, [username, email]);
}

// Function to update an existing player
async function updatePlayer(playerID, username, email) {
  const query = "UPDATE Players SET username = ?, email = ? WHERE playerID = ?";
  return await executeDbQuery(query, [username, email, playerID]);
}

// Function to remove a player
async function deletePlayer(playerID) {
  const query = "DELETE FROM Players WHERE playerID = ?";
  return await executeDbQuery(query, [playerID]);
}

const getPlayersAndMMR = `
SELECT  
    p.username AS Name,
    CONCAT(hr.rankName, ' ', hr.division) AS HighestRank,
    hr.max_mmr AS MMR,
    p.email AS Email,
    DATE_FORMAT(p.createdAt, '%Y-%m-%d') AS CreatedAt,
    GROUP_CONCAT(DISTINCT ro.roleName ORDER BY ro.roleName SEPARATOR ', ') AS Roles
FROM  
    Players p
JOIN  
    (
        SELECT  
            pr.playerID,
            MAX(r.mmr) AS max_mmr,
            r.rankName,
            r.division
        FROM  
            PlayerRoles pr
        JOIN  
            Ranks r ON pr.rankID = r.rankID
        GROUP BY  
            pr.playerID
    ) hr ON p.playerID = hr.playerID
JOIN  
    PlayerRoles pr ON p.playerID = pr.playerID
JOIN  
    Roles ro ON pr.roleID = ro.roleID
GROUP BY  
    p.playerID
ORDER BY  
    p.username;
`;

module.exports = { getAllPlayers, addPlayer, updatePlayer, deletePlayer };