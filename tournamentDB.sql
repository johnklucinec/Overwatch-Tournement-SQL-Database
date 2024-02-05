CREATE TABLE Roles (
    roleID INT AUTO_INCREMENT UNIQUE NOT NULL,
    roleName ENUM('TANK', 'DPS', 'SUPPORT') NOT NULL,
    PRIMARY KEY (roleID)
);

CREATE TABLE Ranks (
    rankID INT AUTO_INCREMENT UNIQUE NOT NULL,
    rankName ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Masters', 'Grandmasters') NOT NULL,
    division INT NOT NULL CHECK (division BETWEEN 1 AND 5),
    PRIMARY KEY (rankID)
);

CREATE TABLE PlayerRoles (
    playerID INT NOT NULL,
    roleID INT NOT NULL,
    rankID INT NOT NULL,
    PRIMARY KEY (playerID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID),
    FOREIGN KEY (roleID) REFERENCES Roles(roleID),
    FOREIGN KEY (rankID) REFERENCES Ranks(rankID)
);

CREATE TABLE Teams (
    teamID INT AUTO_INCREMENT UNIQUE NOT NULL,
    teamName VARCHAR(255) NOT NULL UNIQUE,
    formationDate DATETIME NOT NULL,
    PRIMARY KEY (teamID)
);

CREATE TABLE Tournaments (
    tournamentID INT AUTO_INCREMENT UNIQUE NOT NULL,
    tournamentName VARCHAR(255) NOT NULL UNIQUE,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    PRIMARY KEY (tournamentID)
);

CREATE TABLE TeamPlayers (
    playerID INT NOT NULL,
    teamID INT NOT NULL,
    roleID INT NOT NULL,
    PRIMARY KEY (playerID, teamID, roleID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID),
    FOREIGN KEY (teamID) REFERENCES Teams(teamID),
    FOREIGN KEY (roleID) REFERENCES Roles(roleID)
);

CREATE TABLE TournamentTeams (
    tournamentID INT NOT NULL,
    teamID INT NOT NULL,
    PRIMARY KEY (tournamentID, teamID),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID),
    FOREIGN KEY (teamID) REFERENCES Teams(teamID)
);
