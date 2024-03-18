/*
Citation for the following code:
Date: 2/27/2024
Adapted from Build & Deploy a Next.js Project with Neon & Vercel:
Source URL: https://youtu.be/_LF-IvJsr5Y
*/

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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/tournament-info/' to retrieve all the counts.
 */
async function readTournamentInfoHandler() {

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getTournamentInfoQuery = sqlstring.format(
    `
    SELECT
    (SELECT COUNT(*) FROM public.tournaments) AS tournamentsCount,
    (SELECT COUNT(*) FROM public.teams) AS teamsCount,
    (SELECT COUNT(*) FROM public.players) AS playersCount,
    (SELECT COUNT(DISTINCT rankid) FROM public.ranks) AS ranksCount;
    `
  );

  try {
    const result = await pool.query(getTournamentInfoQuery);

    if (result.rowCount === 0) {
      return createResponse("No Info Found", 400);
    }

    return new Response(JSON.stringify({ infoRows: result.rows }), {
      status: 200,
    });

  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);

  } finally {
    await pool.end();
  }
}


export async function GET() {
   return readTournamentInfoHandler();
}

