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


/** Usage Example: Send a GET request to 'http://localhost:3000/api/teamplayers/?id=1' to retrieve all the players on the team with the ID 1.
 */
async function readTeamPlayersHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return new Response("Player not Found", {
      status: 404,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getPlayerRolesQuery = sqlstring.format(
    `
    SELECT 
    p.playerid AS "id",
    p.username AS "name",
    (SELECT r.rankname || ' ' || r.division::text
     FROM public.playerroles pr
     JOIN public.ranks r ON pr.rankid = r.rankid
     WHERE pr.playerid = p.playerid AND pr.roleid IN (
         SELECT roleid
         FROM public.teamplayers
         WHERE playerid = p.playerid AND teamid = ?
     )
     ORDER BY r.mmr DESC
     LIMIT 1) AS "highestRole",
    (SELECT max(r.mmr)
     FROM public.playerroles pr
     JOIN public.ranks r ON pr.rankid = r.rankid
     WHERE pr.playerid = p.playerid AND pr.roleid IN (
         SELECT roleid
         FROM public.teamplayers
         WHERE playerid = p.playerid AND teamid = ?
     )) AS "mmr",
    p.email AS "email",
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS "createdAt",
    ARRAY_AGG(DISTINCT ro.rolename ORDER BY ro.rolename) AS "roles"
    FROM 
        public.players p
    JOIN 
        public.teamplayers tp ON p.playerid = tp.playerid AND tp.teamid = ?
    JOIN 
        public.roles ro ON tp.roleid = ro.roleid
    GROUP BY 
        p.playerid, p.username, p.email, p.createdat
    ORDER BY 
        "mmr" DESC, "id";
  `,
    [id, id, id]
  );

  try {
    const { rows: playerRolesRows } = await pool.query(getPlayerRolesQuery);

    return new Response(JSON.stringify({ playerRolesRows }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}




export async function GET(req: NextRequest) {
  return readTeamPlayersHandler(req);
}
