-- NOTICE --
-- These queries were made to work with MariaDB
-- NOTICE --

-- Project Title: Overwatch 2 Database Management System
-- Team Members: John Klucinec, Troy Hoffman 
-- Project Group: 56

-- Disable commits and foreign keys
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Entity that stores player information
CREATE OR REPLACE TABLE Players (
    playerID INT AUTO_INCREMENT UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (playerID)
);

-- Entity that stores all the available roles for a player
CREATE OR REPLACE TABLE Roles (
    roleID INT AUTO_INCREMENT UNIQUE NOT NULL,
    roleName ENUM('TANK', 'DPS', 'SUPPORT') NOT NULL,
    PRIMARY KEY (roleID)
);

-- Entity that stores all the available ranks for a player
CREATE OR REPLACE TABLE Ranks (
    rankID INT AUTO_INCREMENT UNIQUE NOT NULL,
    rankName ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Champion') NOT NULL,
    division INT NOT NULL CHECK (division BETWEEN 1 AND 5),
    mmr INT NOT NULL,
    PRIMARY KEY (rankID)
);

-- Intersection Table - this links Players with their Roles (M:N)
CREATE OR REPLACE TABLE PlayerRoles (
    playerID INT NOT NULL,
    roleID INT NOT NULL,
    rankID INT NOT NULL,
    PRIMARY KEY (playerID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID) ON DELETE CASCADE,
    FOREIGN KEY (rankID) REFERENCES Ranks(rankID) ON DELETE CASCADE
);

-- Entity that stores the teams
CREATE OR REPLACE TABLE Teams (
    teamID INT AUTO_INCREMENT UNIQUE NOT NULL,
    teamName VARCHAR(255) NOT NULL UNIQUE,
    formationDate DATETIME NOT NULL,
    PRIMARY KEY (teamID)
);

-- Entity that stores the tournaments
CREATE OR REPLACE TABLE Tournaments (
    tournamentID INT AUTO_INCREMENT UNIQUE NOT NULL,
    tournamentName VARCHAR(255) NOT NULL UNIQUE,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    tournamentStatus ENUM('Enrollment Open', 'Registration Closed') NOT NULL,
    PRIMARY KEY (tournamentID)
);

-- Intersection Table - this links Teams and Players (M:N)
CREATE OR REPLACE TABLE TeamPlayers (
    playerID INT NOT NULL,
    teamID INT NOT NULL,
    roleID INT NOT NULL,
    PRIMARY KEY (playerID, teamID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID)ON DELETE CASCADE
);

-- Intersection Table - this links Tournaments and Teams (M:N)
CREATE OR REPLACE TABLE TournamentTeams (
    tournamentID INT,
    teamID INT,
    PRIMARY KEY (tournamentID, teamID),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE
);


-- Give each rank variation a unique ID
INSERT INTO Ranks (rankName, division, mmr) VALUES
('Bronze', 5, 1000),
('Bronze', 4, 1100),
('Bronze', 3, 1200),
('Bronze', 2, 1300),
('Bronze', 1, 1400),
('Silver', 5, 1500),
('Silver', 4, 1600),
('Silver', 3, 1700),
('Silver', 2, 1800),
('Silver', 1, 1900),
('Gold', 5, 2000),
('Gold', 4, 2100),
('Gold', 3, 2200),
('Gold', 2, 2300),
('Gold', 1, 2400),
('Platinum', 5, 2500),
('Platinum', 4, 2600),
('Platinum', 3, 2700),
('Platinum', 2, 2800),
('Platinum', 1, 2900),
('Diamond', 5, 3000),
('Diamond', 4, 3100),
('Diamond', 3, 3200),
('Diamond', 2, 3300),
('Diamond', 1, 3400),
('Master', 5, 3500),
('Master', 4, 3600),
('Master', 3, 3700),
('Master', 2, 3800),
('Master', 1, 3900),
('Grandmaster', 5, 4000),
('Grandmaster', 4, 4100),
('Grandmaster', 3, 4200),
('Grandmaster', 2, 4300),
('Grandmaster', 1, 4400),
('Champion', 5, 4500),
('Champion', 4, 4600),
('Champion', 3, 4700),
('Champion', 2, 4800),
('Champion', 1, 4900);

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

-- Create the HellCats Team
INSERT INTO Teams (teamName, formationDate)
VALUES ('HellCats', CURRENT_DATE);

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

-- Add Players to the HellCats Team. 

-- Wintah (Does not play SUPPORT for Wildcats, so the ROLE is not added.
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Wintah'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));


-- Gliscor
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Gliscor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));
        
-- unicorn
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'unicorn'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));
        
-- PhevieWonder
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'PhevieWonder'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));
        
-- BigSimpConnor
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'BigSimpConnor'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));
        
-- Create the DragonGuardians Team
INSERT INTO Teams (teamName, formationDate)
VALUES ('DragonGuardians', CURRENT_DATE);

-- Create the WolfGuardians Team
INSERT INTO Teams (teamName, formationDate)
VALUES ('WolfGuardians', CURRENT_DATE);

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

-- Add Players to the WolfGuardians Team.

-- Seraphina
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Seraphina'),
        (SELECT roleID FROM Roles WHERE roleName = 'DPS'),
        (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));

-- Ignis
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Ignis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));

-- Vesper
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Vesper'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));

-- Phoenix
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Phoenix'),
        (SELECT roleID FROM Roles WHERE roleName = 'SUPPORT'),
        (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));

-- Aegis
INSERT INTO TeamPlayers (playerID, roleID, teamID)
VALUES ((SELECT playerID FROM Players WHERE username = 'Aegis'),
        (SELECT roleID FROM Roles WHERE roleName = 'TANK'),
        (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));
        

-- Insert the Pachimari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Pachimari Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open');

-- Retrieve the tournamentID for the tournament
SET @tournamentId = LAST_INSERT_ID();

-- Add the Wildcats team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'WildCats'));

-- Add the DragonGuardians team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'DragonGuardians'));

-- Add the HellCats team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'HellCats'));

-- Add the WolfGuardians team to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
VALUES (@tournamentId, (SELECT teamID FROM Teams WHERE teamName = 'WolfGuardians'));

-- Insert the Pachimummy Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Pachimummy Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open');

-- Insert the Catchamari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Catchamari  Tournament', '2024-03-01', '2024-03-15', 'Registration Closed');

-- Insert the Ultimari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Ultimari Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
   


