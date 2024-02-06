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
    rankName ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Masters', 'Grandmasters') NOT NULL,
    division INT NOT NULL CHECK (division BETWEEN 1 AND 5),
    PRIMARY KEY (rankID)
);

CREATE OR REPLACE TABLE PlayerRoles (
    playerID INT NOT NULL,
    roleID INT NOT NULL,
    rankID INT NOT NULL,
    PRIMARY KEY (playerID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID),
    FOREIGN KEY (roleID) REFERENCES Roles(roleID),
    FOREIGN KEY (rankID) REFERENCES Ranks(rankID)
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
    FOREIGN KEY (playerID) REFERENCES Players(playerID),
    FOREIGN KEY (teamID) REFERENCES Teams(teamID),
    FOREIGN KEY (roleID) REFERENCES Roles(roleID)
);

CREATE OR REPLACE TABLE TournamentTeams (
    tournamentID INT NOT NULL,
    teamID INT NOT NULL,
    PRIMARY KEY (tournamentID, teamID),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID),
    FOREIGN KEY (teamID) REFERENCES Teams(teamID)
);