CREATE OR REPLACE TABLE Players (
    playerID INT AUTO_INCREMENT UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (playerID)
);

CREATE OR REPLACE TABLE Roles (
    roleID INT AUTO_INCREMENT UNIQUE NOT NULL,
    roleName ENUM('TANK', 'DPS', 'SUPPORT') NOT NULL,
    PRIMARY KEY (roleID)
);

CREATE OR REPLACE TABLE Ranks (
    rankID INT AUTO_INCREMENT UNIQUE NOT NULL,
    rankName ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster') NOT NULL,
    division INT NOT NULL CHECK (division BETWEEN 1 AND 5),
    PRIMARY KEY (rankID)
);

CREATE OR REPLACE TABLE PlayerRoles (
    playerID INT NOT NULL,
    roleID INT NOT NULL,
    rankID INT NOT NULL,
    PRIMARY KEY (playerID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID) ON DELETE CASCADE,
    FOREIGN KEY (rankID) REFERENCES Ranks(rankID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Teams (
    teamID INT AUTO_INCREMENT UNIQUE NOT NULL,
    teamName VARCHAR(255) NOT NULL UNIQUE,
    formationDate DATETIME NOT NULL,
    PRIMARY KEY (teamID)
);

CREATE OR REPLACE TABLE Tournaments (
    tournamentID INT AUTO_INCREMENT UNIQUE NOT NULL,
    tournamentName VARCHAR(255) NOT NULL UNIQUE,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    PRIMARY KEY (tournamentID)
);

CREATE OR REPLACE TABLE TeamPlayers (
    playerID INT NOT NULL,
    teamID INT NOT NULL,
    roleID INT NOT NULL,
    PRIMARY KEY (playerID, teamID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID)ON DELETE CASCADE
);

CREATE OR REPLACE TABLE TournamentTeams (
    tournamentID INT NOT NULL,
    teamID INT NOT NULL,
    PRIMARY KEY (tournamentID, teamID),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE
);


-- Give each rank variation a unique ID
INSERT INTO Ranks (rankName, division) VALUES
('Bronze',  1),
('Bronze',  2),
('Bronze',  3),
('Bronze',  4),
('Bronze',  5),
('Silver',  1),
('Silver',  2),
('Silver',  3),
('Silver',  4),
('Silver',  5),
('Gold',  1),
('Gold',  2),
('Gold',  3),
('Gold',  4),
('Gold',  5),
('Platinum',  1),
('Platinum',  2),
('Platinum',  3),
('Platinum',  4),
('Platinum',  5),
('Diamond',  1),
('Diamond',  2),
('Diamond',  3),
('Diamond',  4),
('Diamond',  5),
('Master',  1),
('Master',  2),
('Master',  3),
('Master',  4),
('Master',  5),
('Grandmaster',  1),
('Grandmaster',  2),
('Grandmaster',  3),
('Grandmaster',  4),
('Grandmaster',  5);

-- Give each role a unique id
INSERT INTO Roles (roleName) VALUES
('TANK'),
('DPS'),
('SUPPORT');


-- SAMPLE DATA --
-- SAMPLE DATA --
-- SAMPLE DATA --

-- Create the Wildcats Team
INSERT INTO Teams (teamName, formationDate)
VALUES ('WildCats', CURRENT_DATE);

-- Create the players and add their roles

-- Wintah
INSERT INTO Players (username, email, createdAt)
VALUES ('Wintah', 'wintah@tournament.com', CURRENT_DATE);
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Wintah'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division = 4));
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Wintah'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Gold' AND division = 2));
        
-- Gliscor
INSERT INTO Players (username, email, createdAt)
VALUES ('Gliscor', 'gliscor@tournament.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Gliscor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division = 1));
        
-- PhevieWonder
INSERT INTO Players (username, email, createdAt)
VALUES ('PhevieWonder', 'PhevieWonder@tournament.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'PhevieWonder'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Master' AND division = 1));
        
-- unicorn
INSERT INTO Players (username, email, createdAt)
VALUES ('unicorn', 'unicorn@tournament.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'unicorn'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division = 3));
        
-- BigSimpConnor
INSERT INTO Players (username, email, createdAt)
VALUES ('BigSimpConnor', 'BigSimpConnor@tournament.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division = 2));
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Gold' AND division = 4));        
       
-- Add Players to the Wildcats Team. 

-- Wintah (Does not play SUPPORT for Wildcats, so the ROLE is not added.
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Wintah'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));


-- Gliscor
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Gliscor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));
        
-- unicorn
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'unicorn'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));
        
-- PhevieWonder
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'PhevieWonder'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));
        
-- BigSimpConnor
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));
        
-- Create the DragonGuardians Team
INSERT INTO Teams (teamName, formationDate)
VALUES ('DragonGuardians', CURRENT_DATE);

-- Create the players and add their roles

-- Seraphina
INSERT INTO Players (username, email, createdAt)
VALUES ('Seraphina', 'seraphina@dragonguardians.com', CURRENT_DATE);
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Seraphina'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division =  3));
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Seraphina'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Gold' AND division =  1));
        
-- Ignis
INSERT INTO Players (username, email, createdAt)
VALUES ('Ignis', 'ignis@dragonguardians.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Ignis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division =  2));
        
-- Vesper
INSERT INTO Players (username, email, createdAt)
VALUES ('Vesper', 'vesper@dragonguardians.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Vesper'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Master' AND division =  2));
        
-- Phoenix
INSERT INTO Players (username, email, createdAt)
VALUES ('Phoenix', 'phoenix@dragonguardians.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Phoenix'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division =  4));
        
-- Aegis
INSERT INTO Players (username, email, createdAt)
VALUES ('Aegis', 'aegis@dragonguardians.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Aegis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Grandmaster' AND division =  1));
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Aegis'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT rankID FROM Ranks WHERE rankName = 'Gold' AND division =  3));
        
-- Add Players to the DragonGuardians Team.

-- Seraphina
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Seraphina'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

-- Ignis
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Ignis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

-- Vesper
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Vesper'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

-- Phoenix
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Phoenix'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

-- Aegis
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Aegis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));
        

-- Insert the Pachimari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate)
VALUES ('Pachimari Tournament', '2024-03-01', '2024-03-15');

-- Retrieve the tournamentID for the tournament
SET @tournamentId = LAST_INSERT_ID();

-- Add the Wildcats team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));

-- Add the DragonGuardians team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

   
-- SAMPLE QUERYS --
-- SAMPLE QUERYS --
-- SAMPLE QUERYS --


-- Presents Each Player on the Team, along with thier Highest Ranked Role and Role SR
SELECT  
    tp.playerID,
    rk.rankName AS HighestRankName,
    rk.division AS HighestRankDivision,
    CASE
        WHEN rk.rankName = 'Grandmaster' THEN  4000
        WHEN rk.rankName = 'Master' THEN  3500
        WHEN rk.rankName = 'Diamond' THEN  3000
        WHEN rk.rankName = 'Platinum' THEN  2500
        WHEN rk.rankName = 'Gold' THEN  2000
        WHEN rk.rankName = 'Silver' THEN  1500
        WHEN rk.rankName = 'Bronze' THEN  1000
        ELSE  0 -- Default case if none of the above ranks match
    END + (CASE
        WHEN rk.division =  1 THEN  400
        WHEN rk.division =  2 THEN  300
        WHEN rk.division =  3 THEN  200
        WHEN rk.division =  4 THEN  100
        WHEN rk.division =  5 THEN  0
        ELSE  0 -- Default case if division is not between  1 and  5
    END) AS SkillRating
FROM  
    TeamPlayers tp
JOIN  
    PlayerRoles pr ON tp.playerID = pr.playerID AND tp.roleID = pr.roleID
JOIN  
    Ranks rk ON pr.rankID = rk.rankID
JOIN  
    Teams t ON tp.teamID = t.teamID
WHERE  
    t.teamName = 'WildCats'
GROUP BY  
    tp.playerID
ORDER BY  
    FIELD(rk.rankName, 'Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze') DESC,
    rk.division ASC;
    
-- Calculates the Average Team SR and Convert it back to how it should be displayed
SELECT 
    AverageSkillRating,
    CASE
        WHEN AverageSkillRating >= 4000 THEN 'Grandmaster'
        WHEN AverageSkillRating >= 3500 THEN 'Master'
        WHEN AverageSkillRating >= 3000 THEN 'Diamond'
        WHEN AverageSkillRating >= 2500 THEN 'Platinum'
        WHEN AverageSkillRating >= 2000 THEN 'Gold'
        WHEN AverageSkillRating >= 1500 THEN 'Silver'
        WHEN AverageSkillRating >= 1000 THEN 'Bronze'
        ELSE 'Unranked'
    END AS RankName,
    CASE
        WHEN AverageSkillRating % 500 < 100 THEN 5
        WHEN AverageSkillRating % 500 < 200 THEN 4
        WHEN AverageSkillRating % 500 < 300 THEN 3
        WHEN AverageSkillRating % 500 < 400 THEN 2
        WHEN AverageSkillRating % 500 < 500 THEN 1
    END AS RankDivision
FROM (
    SELECT 
        (SELECT SUM(SkillRating) 
         FROM (
             SELECT
                 tp.playerID,
                 CASE
                     WHEN rk.rankName = 'Grandmaster' THEN  4000
                     WHEN rk.rankName = 'Master' THEN  3500
                     WHEN rk.rankName = 'Diamond' THEN  3000
                     WHEN rk.rankName = 'Platinum' THEN  2500
                     WHEN rk.rankName = 'Gold' THEN  2000
                     WHEN rk.rankName = 'Silver' THEN  1500
                     WHEN rk.rankName = 'Bronze' THEN  1000
                     ELSE  0 -- Default case if none of the above ranks match
                 END + (CASE
                     WHEN rk.division =  1 THEN  400
                     WHEN rk.division =  2 THEN  300
                     WHEN rk.division =  3 THEN  200
                     WHEN rk.division =  4 THEN  100
                     WHEN rk.division =  5 THEN  0
                     ELSE  0 -- Default case if division is not between  1 and  5
                 END) AS SkillRating
             FROM
                 TeamPlayers tp
             JOIN
                 PlayerRoles pr ON tp.playerID = pr.playerID AND tp.roleID = pr.roleID
             JOIN
                 Ranks rk ON pr.rankID = rk.rankID
             JOIN
                 Teams t ON tp.teamID = t.teamID
             WHERE
                 t.teamName = 'WildCats'
             GROUP BY
                 tp.playerID
         ) AS SubQuery) / 
        (SELECT COUNT(DISTINCT playerID) 
         FROM TeamPlayers tp 
         JOIN Teams t ON tp.teamID = t.teamID 
         WHERE t.teamName = 'WildCats') AS AverageSkillRating
) AS AverageSR;

-- Display all teams participating in the Pachimari Tournament
SELECT Teams.teamName, Tournaments.tournamentName
FROM Teams
JOIN TournamentTeams ON Teams.teamID = TournamentTeams.teamID
JOIN Tournaments ON TournamentTeams.tournamentID = Tournaments.tournamentID
WHERE Tournaments.tournamentName = 'Pachimari Tournament';

