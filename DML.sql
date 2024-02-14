-- SELECT Queries:


-- Query to retrieve player information along with their Name, HighestRank, Email, CreatedAt, and Roles.
SELECT 
    p.username AS Name,
    CONCAT(
        r.rankName, ' ',
        CASE
            WHEN max_mmr.mmr % 500 < 100 THEN '5'
            WHEN max_mmr.mmr % 500 < 200 THEN '4'
            WHEN max_mmr.mmr % 500 < 300 THEN '3'
            WHEN max_mmr.mmr % 500 < 400 THEN '2'
            WHEN max_mmr.mmr % 500 < 500 THEN '1'
        END
    ) AS HighestRank,
    p.email AS Email,
    DATE_FORMAT(p.createdAt, '%Y-%m-%d') AS CreatedAt,
    GROUP_CONCAT(DISTINCT ro.roleName ORDER BY ro.roleName SEPARATOR ', ') AS Roles
FROM 
    Players p
JOIN 
    (
        SELECT 
            pr.playerID,
            MAX(rk.mmr) AS mmr
        FROM 
            PlayerRoles pr
        JOIN 
            Ranks rk ON pr.rankID = rk.rankID
        GROUP BY 
            pr.playerID
    ) AS max_mmr ON p.playerID = max_mmr.playerID
JOIN 
    Ranks r ON max_mmr.mmr = r.mmr
JOIN 
    PlayerRoles pr ON p.playerID = pr.playerID
JOIN 
    Roles ro ON pr.roleID = ro.roleID
GROUP BY 
    p.playerID
ORDER BY 
    p.username;

-- Query to retrieve team information along with players, their roles, and ranks


-- Query to retrieve all the teams information, including Name, AverageRank, MMR, FormationDate, and Players(amount)
SELECT 
    t.teamName AS Name,
    CONCAT(
        CASE
            WHEN AVG(highest_mmr.max_mmr) >= 4500 THEN 'Champion'
            WHEN AVG(highest_mmr.max_mmr) >= 4000 THEN 'Grandmaster'
            WHEN AVG(highest_mmr.max_mmr) >= 3500 THEN 'Master'
            WHEN AVG(highest_mmr.max_mmr) >= 3000 THEN 'Diamond'
            WHEN AVG(highest_mmr.max_mmr) >= 2500 THEN 'Platinum'
            WHEN AVG(highest_mmr.max_mmr) >= 2000 THEN 'Gold'
            WHEN AVG(highest_mmr.max_mmr) >= 1500 THEN 'Silver'
            WHEN AVG(highest_mmr.max_mmr) >= 1000 THEN 'Bronze'
            ELSE 'Unranked'
        END,
        ' ',
        CASE
            WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
        END
    ) AS AverageRank,
    FLOOR(AVG(highest_mmr.max_mmr)) AS MMR,
    DATE_FORMAT(t.formationDate, '%Y-%m-%d') AS FormationDate,
    COUNT(DISTINCT playerID) AS Players
FROM 
    Teams t
JOIN 
    (
        SELECT 
            tp.teamID,
            tp.playerID,
            MAX(rk.mmr) AS max_mmr
        FROM 
            TeamPlayers tp
        JOIN 
            PlayerRoles pr ON tp.playerID = pr.playerID AND tp.roleID = pr.roleID
        JOIN 
            Ranks rk ON pr.rankID = rk.rankID
        GROUP BY 
            tp.teamID, tp.playerID
    ) AS highest_mmr ON t.teamID = highest_mmr.teamID
GROUP BY 
    t.teamID;

-- Query to retrieve tournament information along with participating teams


Bababoey

-- INSERT Queries: 

-- Query to add a new player
-- Query to add a new team
-- Query to add a new tournament
-- Query to add a new player's role
-- Query to add a player to a team
-- Query to add a team to a tournament

-- UPDATE Queries:

-- Query to update player email
-- Query to update team formation date
-- Query to update tournament end date
-- Query to update player's role and rank



-- DELETE Queries
-- Query to remove a player from a team
-- Query to remove a team from a tournament
-- Query to remove a player's role
