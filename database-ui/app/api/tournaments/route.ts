/*
Citation for the following code:
Date: 2/27/2024
Adapted from Build & Deploy a Next.js Project with Neon & Vercel:
Source URL: https://youtu.be/_LF-IvJsr5Y
*/

//import { extractbody } from "@/utils/extractBody";
import { NextRequest } from "next/server";
//import zod from "zod";
import sqlstring from "sqlstring";
import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

/**
 * Creates custom response messages
 */
function createResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/tournaments/?id=1' to get all the info about the tournament with the ID 1
 * Usage Example: Send a GET request to 'http://localhost:3000/api/tournaments/' to retrieve all the tournaments
 */
async function readTournamentsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getTournamentQuery = id
    ? sqlstring.format(
        `
        SELECT 
        t.tournamentid AS "id",
        t.tournamentstatus AS "status",
        t.tournamentname AS "name",
        TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "startDate",
        TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "endDate",
        COUNT(tt.teamid) AS "teams"
        FROM 
            public.tournaments t
        LEFT JOIN 
            public.tournamentteams tt ON t.tournamentid = tt.tournamentid
        WHERE 
            t.tournamentid = 1
        GROUP BY 
            t.tournamentid
    `,
        [id]
      )
    : null;

  const getTournamentsQuery = sqlstring.format(
    `
    SELECT 
    t.tournamentid AS "id",
    t.tournamentstatus AS "status",
    t.tournamentname AS "name",
    TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "startDate",
    TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "endDate",
    COUNT(tt.teamid) AS "teams"
    FROM 
        public.tournaments t
    LEFT JOIN 
        public.tournamentteams tt ON t.tournamentid = tt.tournamentid
    GROUP BY 
        t.tournamentid
    ORDER BY 
        t.startdate DESC;
    `
  );

  try {
    const query = id ? getTournamentQuery : getTournamentsQuery;
    const result = await pool.query(query || "");

    if (result.rowCount === 0) {
      return createResponse("No Tournament found with this ID", 400);
    }

    return new Response(JSON.stringify({ tournamentsRows: result.rows }), {
      status: 200,
    });

  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);

  } finally {
    await pool.end();
  }
}

export async function GET(req: NextRequest) {
  return readTournamentsHandler(req);
}
