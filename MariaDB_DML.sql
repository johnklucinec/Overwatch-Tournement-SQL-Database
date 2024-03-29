-- NOTICE --
-- These queries were made to work with MariaDB
-- NOTICE --

-- Project Title: Overwatch 2 Database Management System
-- Team Members: John Klucinec, Troy Hoffman 
-- Project Group: 56

-- SELECT Queries:

-- Query to retrieve player information along with their Name, HighestRank, MMR, Email, CreatedAt, and Roles.
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


-- Query to get a spesific players roles
-- Replace :playerID with the playersID

SELECT 
    ro.roleName AS Role,
    CONCAT(r.rankName, ' ', 
        CASE
            WHEN r.mmr % 500 < 100 THEN '5'
            WHEN r.mmr % 500 < 200 THEN '4'
            WHEN r.mmr % 500 < 300 THEN '3'
            WHEN r.mmr % 500 < 400 THEN '2'
            WHEN r.mmr % 500 < 500 THEN '1'
        END
    ) AS RankWithDivision
FROM 
    PlayerRoles pr
JOIN 
    Roles ro ON pr.roleID = ro.roleID
JOIN 
    Ranks r ON pr.rankID = r.rankID
WHERE 
    pr.playerID = :playerID
ORDER BY 
    r.mmr DESC;

--Query to get spesific infomation about a spesific player including Playername, HighestRank, DateAdded, and Email
-- Replace :playerID with the players real id

SELECT 
    p.username AS Name,
    CONCAT(
        r.rankName, ' ',
        CASE
            WHEN r.mmr % 500 < 100 THEN '5'
            WHEN r.mmr % 500 < 200 THEN '4'
            WHEN r.mmr % 500 < 300 THEN '3'
            WHEN r.mmr % 500 < 400 THEN '2'
            WHEN r.mmr % 500 < 500 THEN '1'
        END
    ) AS HighestRank,
    DATE_FORMAT(p.createdAt, '%Y-%m-%d') AS DateAdded,
    p.email AS Email
FROM 
    Players p
JOIN 
    PlayerRoles pr ON p.playerID = pr.playerID
JOIN 
    Ranks r ON pr.rankID = r.rankID
WHERE 
    p.playerID = :playerID
ORDER BY 
    r.mmr DESC
LIMIT 1;

-- Query to retrieve a spesific team's information along with playerID, userName, highestRank, MMR, email, created at, and roles
-- :teamID is the variable to use when searching for the team. 
-- Only the ranks the player players for the team are taken into consideration

SELECT 
    p.playerID AS PlayerID,
    p.username AS Name,
    CONCAT(r.rankName, ' ', r.division) AS HighestRankedRole,
    r.mmr AS HighestRoleMMR,
    p.email AS Email,
    DATE_FORMAT(p.createdAt, '%Y-%m-%d') AS CreatedAt,
    GROUP_CONCAT(DISTINCT ro.roleName ORDER BY ro.roleName SEPARATOR ', ') AS Roles
FROM 
    Players p
JOIN 
    TeamPlayers tp ON p.playerID = tp.playerID AND tp.teamID = :teamID
JOIN 
    PlayerRoles pr ON p.playerID = pr.playerID AND tp.roleID = pr.roleID
JOIN 
    Ranks r ON pr.rankID = r.rankID
JOIN 
    Roles ro ON tp.roleID = ro.roleID
GROUP BY 
    p.playerID
ORDER BY 
    r.mmr DESC, p.playerID;

-- Query to retrieve all the teams information, including Name, AverageRank, MMR, FormationDate, and Players(amount)
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles. 
SELECT 
    t.teamID AS TeamID,
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
    COUNT(DISTINCT highest_mmr.playerID) AS Players
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
    t.teamID
ORDER BY 
    MMR DESC, Name;

-- Query to retrieve tournament information along as TournamentID, Status, Name, StartDate, EndDate, and Teams
SELECT 
    t.tournamentID AS TournamentID,
    t.tournamentStatus AS Status,
    t.tournamentName AS Name,
    DATE_FORMAT(t.startDate, '%Y-%m-%d') AS StartDate,
    DATE_FORMAT(t.endDate, '%Y-%m-%d') AS EndDate,
    COUNT(tt.teamID) AS Teams
FROM 
    Tournaments t
LEFT JOIN 
    TournamentTeams tt ON t.tournamentID = tt.tournamentID
GROUP BY 
    t.tournamentID
ORDER BY 
    t.startDate DESC;

-- Query to retrieve all the teams information for a spesific tournament, including TeamID, Name, AverageRank, MMR, FormationDate, and Players(amount)
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles. 
-- replace :tournamentID with the tournament ID
SELECT 
    t.tournamentStatus AS Status,
    t.tournamentName AS Name,
    DATE_FORMAT(t.startDate, '%Y-%m-%d') AS StartDate,
    DATE_FORMAT(t.endDate, '%Y-%m-%d') AS EndDate,
    COUNT(tt.teamID) AS Teams
FROM 
    Tournaments t
LEFT JOIN 
    TournamentTeams tt ON t.tournamentID = tt.tournamentID
GROUP BY 
    t.tournamentID
ORDER BY 
    t.startDate;

SELECT 
    t.teamID AS TeamID,
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
    COUNT(DISTINCT tp.playerID) AS Players
FROM 
    Teams t
JOIN 
    TournamentTeams tt ON t.teamID = tt.teamID
JOIN 
    TeamPlayers tp ON t.teamID = tp.teamID
JOIN 
    (
        SELECT 
            tp.teamID,
            pr.playerID,
            MAX(r.mmr) AS max_mmr
        FROM 
            TeamPlayers tp
        JOIN 
            PlayerRoles pr ON tp.playerID = pr.playerID
        JOIN 
            Ranks r ON pr.rankID = r.rankID
        GROUP BY 
            tp.teamID, pr.playerID
    ) AS highest_mmr ON t.teamID = highest_mmr.teamID
WHERE 
    tt.tournamentID = :tournamentID
GROUP BY 
    t.teamID
ORDER BY 
    MMR DESC, Name;

-- Query to get all the available ranks
SELECT 
    rankName AS RankName,
    division AS Division,
    mmr AS MMR
FROM 
    Ranks
ORDER BY 
    mmr DESC;

-- Query to get all the available roles

SELECT 
    roleName AS Role
FROM 
    Roles;

-- INSERT Queries: 
    --  denote the variables that will have data from the backend programming language using :variable


-- Query to add a new player

INSERT INTO Players (username, email, createdAt)
VALUES (:usernameInput, :emailInput, NOW());


-- Query to add a new team

INSERT INTO Teams (teamName, formationDate)
VALUES (:teamNameInput, NOW());

-- Query to add a new tournament

INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES (:tournamentNameInput, :startDateInput, :endDateInput, :tournamentStatusInput);

-- Query to add a new player's role
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES (:playerIDInput, :roleIDInput, :rankIDInput);

-- Query to add a player to a team
INSERT INTO TeamPlayers (playerID, teamID, roleID)
VALUES (:playerIDInput, :teamIDInput, :roleIDInput);

-- Query to add a team to a tournament

INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (:tournamentIDInput, :teamIDInput);

-- UPDATE Queries:

-- Query to update player email
UPDATE Players
SET email = :newEmailInput
WHERE playerID = :playerIDToUpdate;

-- Query to update team formation date
UPDATE Teams
SET formationDate = :newFormationDateInput
WHERE teamID = :teamIDToUpdate;

-- Query to update tournament end date
UPDATE Tournaments
SET endDate = :newEndDateInput
WHERE tournamentID = :tournamentIDToUpdate;

-- Query to update player's role and rank
UPDATE PlayerRoles
SET roleID = :newRoleIDInput,
    rankID = :newRankIDInput
WHERE playerID = :playerIDToUpdate;



-- DELETE Queries:
-- Query to remove a player from a team
DELETE FROM TeamPlayers
WHERE playerID = :playerIDToRemove
  AND teamID = :teamIDToRemove;

-- Query to remove a team from a tournament
DELETE FROM TournamentTeams
WHERE teamID = :teamIDToRemove
  AND tournamentID = :tournamentIDToRemove;

-- Query to remove a player's role
DELETE FROM PlayerRoles
WHERE playerID = :playerIDToRemove
  AND roleID = :roleIDToRemove;
