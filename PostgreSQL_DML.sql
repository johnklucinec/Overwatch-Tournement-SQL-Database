-- NOTICE --
-- These queries were made to work with PostgreSQL
-- NOTICE --

-- Project Title: Overwatch 2 Database Management System
-- Team Members: John Klucinec, Troy Hoffman 
-- Project Group: 56

-- SELECT Queries:

-- Used to calculate the AverageRank name + division when given an MMR number
-- Ideally, this is used instead of all the Hardcoded case statements. 
SELECT 
    rankname || ' ' || division::text AS AverageRank
FROM 
    public.ranks
WHERE 
    mmr <= FLOOR(:averageMMR / 10) * 10
ORDER BY 
    mmr DESC
LIMIT 1;

-- Query to retrieve player information along with their Name, HighestRank, MMR, Email, CreatedAt, and Roles.
SELECT
    p.username AS Name,
    r.rankname || ' ' || CAST(r.division AS VARCHAR) AS HighestRank,
    r.mmr AS MMR,
    p.email AS Email,
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS CreatedAt,
    ARRAY_AGG(ro.rolename ORDER BY ro.rolename) AS Roles
FROM
    players p
JOIN
    (SELECT
         pr.playerid,
         MAX(rk.mmr) AS max_mmr
     FROM
         playerroles pr
     JOIN ranks rk ON pr.rankid = rk.rankid
     GROUP BY pr.playerid) AS highest_rank
ON
    p.playerid = highest_rank.playerid
JOIN
    ranks r ON highest_rank.max_mmr = r.mmr
JOIN
    playerroles pr ON p.playerid = pr.playerid
JOIN
    roles ro ON pr.roleid = ro.roleid
GROUP BY
    p.username, r.rankname, r.division, r.mmr, p.email, p.createdat
ORDER BY
    MMR DESC;

-- Query to retrieve all the players that ARE NOT on a given team. 
-- Returns their playerID, Name, and Roles. 
SELECT
    p.playerid AS id,
    p.username AS name,
    ARRAY_AGG(DISTINCT ro.rolename ORDER BY ro.rolename) AS roles
FROM
    players p
JOIN playerroles pr ON p.playerid = pr.playerid
JOIN roles ro ON pr.roleid = ro.roleid
WHERE
    p.playerid NOT IN (
        SELECT
            tp.playerid
        FROM
            teamplayers tp
        WHERE
            tp.teamid = :teamID
    )
GROUP BY
    p.playerid, p.username
ORDER BY
    p.username;

-- Query to get a spesific players roles
-- Replace :playerID with the playersID

SELECT 
    ro.roleid AS "RoleID",
    ro.rolename AS "Role",
    CONCAT(r.rankname, ' ', 
        CASE
            WHEN r.mmr % 500 < 100 THEN '5'
            WHEN r.mmr % 500 < 200 THEN '4'
            WHEN r.mmr % 500 < 300 THEN '3'
            WHEN r.mmr % 500 < 400 THEN '2'
            WHEN r.mmr % 500 < 500 THEN '1'
        END
    ) AS "RankWithDivision"
FROM 
    public.playerroles pr
JOIN 
    public.roles ro ON pr.roleid = ro.roleid
JOIN 
    public.ranks r ON pr.rankid = r.rankid
WHERE 
    pr.playerid = :playerID
ORDER BY 
    r.mmr DESC;

--Query to get spesific infomation about a spesific player including Playername, HighestRank, DateAdded, and Email
-- Replace :playerID with the players real id

SELECT 
    p.username AS "Name",
    r.rankname || ' ' ||
        CASE
            WHEN r.mmr % 500 < 100 THEN '5'
            WHEN r.mmr % 500 < 200 THEN '4'
            WHEN r.mmr % 500 < 300 THEN '3'
            WHEN r.mmr % 500 < 400 THEN '2'
            WHEN r.mmr % 500 < 500 THEN '1'
        END AS "HighestRank",
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS "DateAdded",
    p.email AS "Email"
FROM 
    public.players p
JOIN 
    public.playerroles pr ON p.playerid = pr.playerid
JOIN 
    public.ranks r ON pr.rankid = r.rankid
WHERE 
    p.playerid = :playerID
ORDER BY 
    r.mmr DESC
LIMIT 1;

-- Query to retrieve a spesific team's information along with playerID, userName, highestRank, MMR, email, created at, and roles
-- :teamID is the variable to use when searching for the team. 
-- Only the ranks the player players for the team are taken into consideration
SELECT 
    p.playerid AS "id",
    p.username AS "name",
    (SELECT r.rankname || ' ' || r.division::text
     FROM public.playerroles pr
     JOIN public.ranks r ON pr.rankid = r.rankid
     WHERE pr.playerid = p.playerid AND pr.roleid IN (
         SELECT roleid
         FROM public.teamplayers
         WHERE playerid = p.playerid AND teamid = :teamID
     )
     ORDER BY r.mmr DESC
     LIMIT 1) AS "highestRole",
    (SELECT max(r.mmr)
     FROM public.playerroles pr
     JOIN public.ranks r ON pr.rankid = r.rankid
     WHERE pr.playerid = p.playerid AND pr.roleid IN (
         SELECT roleid
         FROM public.teamplayers
         WHERE playerid = p.playerid AND teamid = :teamID
     )) AS "mmr",
    p.email AS "email",
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS "createdAt",
    ARRAY_AGG(DISTINCT ro.rolename ORDER BY ro.rolename) AS "roles"
FROM 
    public.players p
JOIN 
    public.teamplayers tp ON p.playerid = tp.playerid AND tp.teamid = :teamID
JOIN 
    public.roles ro ON tp.roleid = ro.roleid
GROUP BY 
    p.playerid, p.username, p.email, p.createdat
ORDER BY 
    "mmr" DESC, "id";

-- Query to retrieve all the teams information, including Name, AverageRank, MMR, FormationDate, and Players(amount)
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles. 
SELECT 
    t.teamid AS "id",
    t.teamname AS "name",
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
    END || ' ' ||
    CASE
        WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
    END AS "averageRank",
    FLOOR(AVG(highest_mmr.max_mmr)) AS "mmr",
    TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
    COUNT(DISTINCT highest_mmr.playerid) AS "players"
FROM 
    public.teams t
JOIN 
    (
        SELECT 
            tp.teamid,
            tp.playerid,
            MAX(r.mmr) AS max_mmr
        FROM 
            public.teamplayers tp
        JOIN 
            public.playerroles pr ON tp.playerid = pr.playerid AND tp.roleid = pr.roleid
        JOIN 
            public.ranks r ON pr.rankid = r.rankid
        GROUP BY 
            tp.teamid, tp.playerid
    ) AS highest_mmr ON t.teamid = highest_mmr.teamid
GROUP BY 
    t.teamid
ORDER BY 
    "mmr" DESC, "name";

-- Query to retrieve all the teams information (as above), but only for a spesific tournament
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles, only the roles for that team. 
SELECT 
    t.teamid AS "id",
    t.teamname AS "name",
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
    END || ' ' ||
    CASE
        WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
    END AS "averageRank",
    FLOOR(AVG(highest_mmr.max_mmr)) AS "mmr",
    TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
    COUNT(DISTINCT highest_mmr.playerid) AS "players"
FROM 
    public.teams t
JOIN 
    (
        SELECT 
            tp.teamid,
            tp.playerid,
            MAX(r.mmr) AS max_mmr
        FROM 
            public.teamplayers tp
        JOIN 
            public.playerroles pr ON tp.playerid = pr.playerid AND tp.roleid = pr.roleid
        JOIN 
            public.ranks r ON pr.rankid = r.rankid
        GROUP BY 
            tp.teamid, tp.playerid
    ) AS highest_mmr ON t.teamid = highest_mmr.teamid
JOIN 
    public.tournamentteams tt ON t.teamid = tt.teamid
WHERE 
    tt.tournamentid = :tournamentID
GROUP BY 
    t.teamid
ORDER BY 
    "mmr" DESC, "name";

-- Query to retrieve a spesific team's information, including Name, AverageRank, MMR, FormationDate, and Players(amount)
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles. 
SELECT 
    t.teamid AS "id",
    t.teamname AS "name",
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
    END || ' ' ||
    CASE
        WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
    END AS "averageRank",
    FLOOR(AVG(highest_mmr.max_mmr)) AS "mmr",
    TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
    COUNT(DISTINCT highest_mmr.playerid) AS "players"
FROM 
    public.teams t
JOIN 
    (
        SELECT 
            tp.teamid,
            tp.playerid,
            MAX(r.mmr) AS max_mmr
        FROM 
            public.teamplayers tp
        JOIN 
            public.playerroles pr ON tp.playerid = pr.playerid AND tp.roleid = pr.roleid
        JOIN 
            public.ranks r ON pr.rankid = r.rankid
        GROUP BY 
            tp.teamid, tp.playerid
    ) AS highest_mmr ON t.teamid = highest_mmr.teamid
WHERE 
    t.teamid = :teamID
GROUP BY 
    t.teamid
ORDER BY 
    "mmr" DESC, "name";

-- Query to retrieve tournament information along as TournamentID, Status, Name, StartDate, EndDate, and Teams

SELECT 
    t.tournamentid AS "TournamentID",
    t.tournamentstatus AS "Status",
    t.tournamentname AS "Name",
    TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "StartDate",
    TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "EndDate",
    COUNT(tt.teamid) AS "Teams"
FROM 
    public.tournaments t
LEFT JOIN 
    public.tournamentteams tt ON t.tournamentid = tt.tournamentid
GROUP BY 
    t.tournamentid
ORDER BY 
    t.startdate DESC;

-- Query to retrieve a spesific tournament's information along as TournamentID, Status, Name, StartDate, EndDate, and Teams
SELECT 
    t.tournamentid AS "TournamentID",
    t.tournamentstatus AS "Status",
    t.tournamentname AS "Name",
    TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "StartDate",
    TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "EndDate",
    COUNT(tt.teamid) AS "Teams"
FROM 
    public.tournaments t
LEFT JOIN 
    public.tournamentteams tt ON t.tournamentid = tt.tournamentid
WHERE 
    t.tournamentid = :tournamentID
GROUP BY 
    t.tournamentid
ORDER BY 
    t.startdate DESC;

-- Query to retrieve all the teams information for a spesific tournament, including TeamID, Name, AverageRank, MMR, FormationDate, and Players(amount)
-- Average rank is only calculated based on the highest role that each player has on the team.
-- It does not take into consideration all the players roles. 
-- replace :tournamentID with the tournament ID

SELECT 
    t.teamid AS "TeamID",
    t.teamname AS "Name",
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
    END || ' ' ||
    CASE
        WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
        WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
    END AS "AverageRank",
    FLOOR(AVG(highest_mmr.max_mmr)) AS "MMR",
    TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "FormationDate",
    COUNT(DISTINCT tp.playerid) AS "Players"
FROM 
    public.teams t
JOIN 
    public.tournamentteams tt ON t.teamid = tt.teamid
JOIN 
    public.teamplayers tp ON t.teamid = tp.teamid
JOIN 
    (
        SELECT 
            tp.teamid,
            pr.playerid,
            MAX(r.mmr) AS max_mmr
        FROM 
            public.teamplayers tp
        JOIN 
            public.playerroles pr ON tp.playerid = pr.playerid
        JOIN 
            public.ranks r ON pr.rankid = r.rankid
        WHERE 
            tp.teamid IN (SELECT teamid FROM public.tournamentteams WHERE tournamentid = :tournamentID)
        GROUP BY 
            tp.teamid, pr.playerid
    ) AS highest_mmr ON t.teamid = highest_mmr.teamid
WHERE 
    tt.tournamentid = :tournamentID
GROUP BY 
    t.teamid
ORDER BY 
    "MMR" DESC, "Name";

-- Query to retrieve all Ranks
SELECT 
    rankid AS "RankID",
    rankname AS "RankName",
    division AS "Division",
    mmr AS "MMR"
FROM 
    public.ranks
ORDER BY 
    mmr DESC;

-- Query to retrieve all Roles
SELECT 
    roleid AS "RoleID",
    rolename AS "Role"
FROM 
    public.roles;

-- insert queries
-- add new player
INSERT INTO Players (username, email, createdAt)
VALUES (:usernameInput, :emailInput, CURRENT_TIMESTAMP);

-- add new team
INSERT INTO Teams (teamName, formationDate)
VALUES (:teamNameInput, CURRENT_TIMESTAMP);

--add new tournament
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES (:tournamentNameInput, :startDateInput, :endDateInput, :tournamentStatusInput);

-- add a new players role
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES (:playerIDInput, :roleIDInput, :rankIDInput);

--add player to a team
INSERT INTO TeamPlayers (playerID, teamID, roleID)
VALUES (:playerIDInput, :teamIDInput, :roleIDInput);


--add team to tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (:tournamentIDInput, :teamIDInput);


--update queries
--update player email
UPDATE Players
SET email = :newEmailInput
WHERE playerID = :playerIDToUpdate;


-- update team formation date
UPDATE Teams
SET formationDate = :newFormationDateInput
WHERE teamID = :teamIDToUpdate;

--update tournament end date
UPDATE Tournaments
SET endDate = :newEndDateInput
WHERE tournamentID = :tournamentIDToUpdate;

-- update player's role and rank
UPDATE PlayerRoles
SET roleID = :newRoleIDInput,
    rankID = :newRankIDInput
WHERE playerID = :playerIDToUpdate;

-- Delete queries
--remove a player
DELETE FROM TeamPlayers
WHERE playerID = :playerIDToRemove
  AND teamID = :teamIDToRemove;


--remove team from tournament
DELETE FROM TournamentTeams
WHERE teamID = :teamIDToRemove
  AND tournamentID = :tournamentIDToRemove;

--remove a player role
DELETE FROM PlayerRoles
WHERE playerID = :playerIDToRemove
  AND roleID = :roleIDToRemove;