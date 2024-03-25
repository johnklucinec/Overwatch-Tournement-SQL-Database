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

Check out their [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.