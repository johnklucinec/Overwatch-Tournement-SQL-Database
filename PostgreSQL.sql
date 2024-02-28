--BEGIN;

-- Entity that stores player information
DROP TABLE IF EXISTS Players CASCADE;
CREATE TABLE Players (
    playerID SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL
);

-- Create a type for Roles
DROP TYPE IF EXISTS RoleT CASCADE;
CREATE TYPE RoleT AS ENUM('TANK', 'DPS', 'SUPPORT');

-- Entity that stores all the available roles for a player
DROP TABLE IF EXISTS Roles CASCADE;
CREATE TABLE Roles (
    roleID SERIAL PRIMARY KEY,
    roleName RoleT NOT NULL
);

-- Create a type for Ranks
DROP TYPE IF EXISTS RankT CASCADE;
CREATE TYPE RankT AS ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Champion');

-- Entity that stores all the available ranks for a player
DROP TABLE IF EXISTS Ranks CASCADE;
CREATE TABLE Ranks (
    rankID SERIAL PRIMARY KEY,
    rankName RankT NOT NULL,
    division INT NOT NULL CHECK (division BETWEEN 1 AND 5),
    mmr INT NOT NULL
);

-- Intersection Table - this links Players with their Roles (M:N)
DROP TABLE IF EXISTS PlayerRoles CASCADE;
CREATE TABLE PlayerRoles (
    playerID INT NOT NULL,
    roleID INT NOT NULL,
    rankID INT NOT NULL,
    PRIMARY KEY (playerID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID) ON DELETE CASCADE,
    FOREIGN KEY (rankID) REFERENCES Ranks(rankID) ON DELETE CASCADE
);

-- Entity that stores the teams
DROP TABLE IF EXISTS Teams CASCADE;
CREATE TABLE Teams (
    teamID SERIAL PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL UNIQUE,
    formationDate TIMESTAMP NOT NULL
);

-- Create a type for Tournament Status
DROP TYPE IF EXISTS TournamentStatusT CASCADE;
CREATE TYPE TournamentStatusT AS ENUM('Enrollment Open', 'Registration Closed');

-- Entity that stores the tournaments
DROP TABLE IF EXISTS Tournaments CASCADE;
CREATE TABLE Tournaments (
    tournamentID SERIAL PRIMARY KEY,
    tournamentName VARCHAR(255) NOT NULL UNIQUE,
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    tournamentStatus TournamentStatusT NOT NULL
);

-- Intersection Table - this links Teams and Players (M:N)
DROP TABLE IF EXISTS TeamPlayers CASCADE;
CREATE TABLE TeamPlayers (
    playerID INT NOT NULL,
    teamID INT NOT NULL,
    roleID INT NOT NULL,
    PRIMARY KEY (playerID, teamID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID) ON DELETE CASCADE
);

-- Intersection Table - this links Tournaments and Teams (M:N)
DROP TABLE IF EXISTS TournamentTeams CASCADE;
CREATE TABLE TournamentTeams (
    tournamentID INT NOT NULL,
    teamID INT NOT NULL,
    PRIMARY KEY (tournamentID, teamID),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID) ON DELETE CASCADE,
    FOREIGN KEY (teamID) REFERENCES Teams(teamID) ON DELETE CASCADE
);

-- Add data

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
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Wintah' 
  AND roleName = 'DPS' 
  AND rankName = 'Grandmaster' 
  AND division = 4;

-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID)
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Wintah' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Gold' 
  AND division = 2;
        
-- Gliscor
INSERT INTO Players (username, email, createdAt) 
VALUES ('Gliscor', 'gliscor@tournament.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Gliscor' 
  AND roleName = 'TANK' 
  AND rankName = 'Grandmaster' 
  AND division = 1;

-- PhevieWonder
INSERT INTO Players (username, email, createdAt) 
VALUES ('PhevieWonder', 'PhevieWonder@tournament.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'PhevieWonder' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Master' 
  AND division = 1;
        
-- unicorn
INSERT INTO Players (username, email, createdAt) 
VALUES ('unicorn', 'unicorn@tournament.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'unicorn' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Grandmaster' 
  AND division = 3;
        
-- BigSimpConnor
INSERT INTO Players (username, email, createdAt) 
VALUES ('BigSimpConnor', 'BigSimpConnor@tournament.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'TANK' 
  AND rankName = 'Grandmaster' 
  AND division = 2;
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'DPS' 
  AND rankName = 'Gold' 
  AND division = 4;

-- Add Players to the Wildcats Team. 

-- Wintah (Does not play SUPPORT for Wildcats, so the ROLE is not added.)
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Wintah' 
  AND roleName = 'DPS' 
  AND teamName = 'WildCats';

-- Gliscor
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Gliscor' 
  AND roleName = 'TANK' 
  AND teamName = 'WildCats';

-- unicorn
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'unicorn' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'WildCats';

-- PhevieWonder
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'PhevieWonder' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'WildCats';

-- BigSimpConnor
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'TANK' 
  AND teamName = 'WildCats';
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'DPS' 
  AND teamName = 'WildCats';

-- Add Players to the HellCats Team.

-- Wintah (Does not play SUPPORT for Wildcats, so the ROLE is not added.)
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Wintah' 
  AND roleName = 'DPS' 
  AND teamName = 'HellCats';

-- Gliscor
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Gliscor' 
  AND roleName = 'TANK' 
  AND teamName = 'HellCats';

-- unicorn
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'unicorn' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'HellCats';

-- PhevieWonder
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'PhevieWonder' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'HellCats';

-- BigSimpConnor
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'TANK' 
  AND teamName = 'HellCats';
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'BigSimpConnor' 
  AND roleName = 'DPS' 
  AND teamName = 'HellCats';

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
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Seraphina' 
  AND roleName = 'DPS' 
  AND rankName = 'Grandmaster' 
  AND division = 3;
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Seraphina' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Gold' 
  AND division = 1;

-- Ignis
INSERT INTO Players (username, email, createdAt) 
VALUES ('Ignis', 'ignis@dragonguardians.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Ignis' 
  AND roleName = 'TANK' 
  AND rankName = 'Grandmaster' 
  AND division = 2;

-- Vesper
INSERT INTO Players (username, email, createdAt) 
VALUES ('Vesper', 'vesper@dragonguardians.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Vesper' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Master' 
  AND division = 2;

-- Phoenix
INSERT INTO Players (username, email, createdAt) 
VALUES ('Phoenix', 'phoenix@dragonguardians.com', CURRENT_DATE);
-- Add SUPPORT Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Phoenix' 
  AND roleName = 'SUPPORT' 
  AND rankName = 'Grandmaster' 
  AND division = 4;

-- Aegis
INSERT INTO Players (username, email, createdAt) 
VALUES ('Aegis', 'aegis@dragonguardians.com', CURRENT_DATE);
-- Add TANK Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Aegis' 
  AND roleName = 'TANK' 
  AND rankName = 'Grandmaster' 
  AND division = 1;
-- Add DPS Role and Rank
INSERT INTO PlayerRoles (playerID, roleID, rankID) 
SELECT playerID, roleID, rankID 
FROM Players, Roles, Ranks 
WHERE username = 'Aegis' 
  AND roleName = 'DPS' 
  AND rankName = 'Gold' 
  AND division = 3;

-- Add Players to the DragonGuardians Team.

-- Seraphina
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Seraphina' 
  AND roleName = 'DPS' 
  AND teamName = 'DragonGuardians';

-- Ignis
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Ignis' 
  AND roleName = 'TANK' 
  AND teamName = 'DragonGuardians';

-- Vesper
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Vesper' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'DragonGuardians';

-- Phoenix
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Phoenix' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'DragonGuardians';

-- Aegis
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Aegis' 
  AND roleName = 'TANK' 
  AND teamName = 'DragonGuardians';

-- Add Players to the WolfGuardians Team.

-- Seraphina
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Seraphina' 
  AND roleName = 'DPS' 
  AND teamName = 'WolfGuardians';

-- Ignis
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Ignis' 
  AND roleName = 'TANK' 
  AND teamName = 'WolfGuardians';

-- Vesper
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Vesper' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'WolfGuardians';

-- Phoenix
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Phoenix' 
  AND roleName = 'SUPPORT' 
  AND teamName = 'WolfGuardians';

-- Aegis
INSERT INTO TeamPlayers (playerID, roleID, teamID) 
SELECT playerID, roleID, teamID 
FROM Players, Roles, Teams 
WHERE username = 'Aegis' 
  AND roleName = 'TANK' 
  AND teamName = 'WolfGuardians';

-- Insert the Pachimari Tournament into the Tournaments table
WITH new_tournament AS (
  INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
  VALUES ('Pachimari Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open')
  RETURNING tournamentID
),
team_ids AS (
  SELECT teamID FROM Teams 
  WHERE teamName IN ('WildCats', 'DragonGuardians', 'HellCats', 'WolfGuardians')
)
-- Add the teams to the Pachimari Tournament
INSERT INTO TournamentTeams (tournamentID, teamID)
SELECT new_tournament.tournamentID, team_ids.teamID FROM new_tournament, team_ids;

-- Insert the Pachimummy Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Pachimummy Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open');

-- Insert the Catchamari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Catchamari Tournament', '2024-03-01', '2024-03-15', 'Registration Closed');

-- Insert the Ultimari Tournament into the Tournaments table
INSERT INTO Tournaments (tournamentName, startDate, endDate, tournamentStatus)
VALUES ('Ultimari Tournament', '2024-03-01', '2024-03-15', 'Enrollment Open');

COMMIT;