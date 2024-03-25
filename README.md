<br/>
<p align="center">
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"></a> 
  <h3 align="center">Overwatch 2 Tournament DBMS</h3>

  <p align="center">
    Take Control of Your Overwatch 2 Tournaments 
    <br/>
    <br/>
    <a href="https://overwatch-tournement-sql-database.vercel.app/"><strong>View Live Demo »</strong></a>
    <br/>
    <br/>
  </p>
</p>

<div align="center">
![Contributors](https://img.shields.io/github/contributors/johnklucinec/Overwatch-Tournement-SQL-Database?color=dark-green) ![Forks](https://img.shields.io/github/forks/johnklucinec/Overwatch-Tournement-SQL-Database?style=social) ![Stargazers](https://img.shields.io/github/stars/johnklucinec/Overwatch-Tournement-SQL-Database?style=social) ![License](https://img.shields.io/github/license/johnklucinec/Overwatch-Tournement-SQL-Database) 
</div>

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

![homepage](images/homepage.png)

This is a project I made for Introduction to Databases at Oregon State University. This project involved both independent and collaborative efforts. I designed and built the website, and together with a partner, we designed the database.

**Key Features:**

* Manage Player Information:
  * Create, edit, and delete player profiles including their roles.
  * Automatically calculate the player's highest achieved rank.
  * Easy-to-use forms simplify data entry and updates.

* Manage Team Information:
  * Create, edit, and delete team information and assigned players.
  * Calculate the team's average rank based solely on the players' roles within the team (not their full role repertoire).
  * Effortlessly add and remove players from your teams.

* Manage Tournament Information:
  * Create, edit, and delete tournament details.
  * Manage participating teams, easily adding, viewing, and removing them from the competition.


## Built With



* [Next.js](https://nextjs.org/)
* [shadcn](https://ui.shadcn.com/)
* [NEON - Serverless Postgres](https://neon.tech/)
* [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Make sure you have the latest version of npm installed. 

* npm

```sh
npm install npm@latest -g
```

### Installation

1. Get a free Database Key at [https://neon.tech/]

2. Clone the repo

```sh
git clone https://github.com/johnklucinec/Overwatch-Tournement-SQL-Database
```

3. Install NPM packages

```sh
npm install
```

4. Enter your API in `env.local`. Only the first two variables are required.

```
DATABASE_URL=DATABASE_URL=postgresql://ExampleUser:ExampleToken@neonserver/OverwatchTournamentdb?sslmode=require
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_JOHN_GITHUB=https://github.com/johnklucinec
NEXT_PUBLIC_TROY_GITHUB=https://github.com/RemyTroy
NEXT_PUBLIC_WALKTHROUGH=https://youtu.be/-lLLTluAkBw
NEXT_PUBLIC_GITUHB=https://github.com/johnklucinec/Overwatch-Tournement-SQL-Database
NEXT_PUBLIC_PORTFOLIO=https://johnklucinec.github.io/github-pages/

```
### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Usage

You can use the provided SQL files to create the tables and import some sample data into your own database.

**ERD**
![erd](images/erd.png)

**SCHEMA**

![schema](images/schema.png)



## License

Distributed under the MIT License. See [LICENSE](https://github.com/johnklucinec/Overwatch-Tournement-SQL-Database/blob/main/LICENSE.md) for more information.

## Authors

* **John Klucinec** - *Comp Sci Student* - [John Klucinec](https://github.com/johnklucinec/) - *Designed Website and Database*
* **Troy Hoffman** - *Comp Sci Student* - [Troy Hoffman](https://github.com/RemyTroy) - *Quality Assurance*

## Acknowledgements

* [ShaanCoding](https://github.com/ShaanCoding/)
* [TomDoesTech](https://www.youtube.com/@TomDoesTech)
* [Oregon State University](https://oregonstate.edu/)
