/*
Citation for the following code:
Date: 2/27/2024
Adapted from Build & Deploy a Next.js Project with Neon & Vercel:
Source URL: https://youtu.be/_LF-IvJsr5Y
*/

import { extractbody } from "@/utils/extractBody";
import { NextRequest } from "next/server";
import zod from "zod";
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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/tournamentteams/?id=1' to retrieve the player role with ID 1.
 */
async function readTournamentTeamsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const eid = searchParams.get("eid");

  if (!id && !eid) {
    return createResponse("Tournament Not Found", 404);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getTournamentTeamsQuery = sqlstring.format(
    `
      SELECT 
      t.teamid AS "id",
      t.teamname AS "name",
      COALESCE(
          CASE
              WHEN AVG(highest_mmr.max_mmr) >= 4500 THEN 'Champion'
              WHEN AVG(highest_mmr.max_mmr) >= 4000 THEN 'Grandmaster'
              WHEN AVG(highest_mmr.max_mmr) >= 3500 THEN 'Master'
              WHEN AVG(highest_mmr.max_mmr) >= 3000 THEN 'Diamond'
              WHEN AVG(highest_mmr.max_mmr) >= 2500 THEN 'Platinum'
              WHEN AVG(highest_mmr.max_mmr) >= 2000 THEN 'Gold'
              WHEN AVG(highest_mmr.max_mmr) >= 1500 THEN 'Silver'
              WHEN AVG(highest_mmr.max_mmr) >= 1000 THEN 'Bronze'
              ELSE 'Unranked'
          END, 'Unranked'
      ) || ' ' ||
      COALESCE(
          CASE
              WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
              WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
              WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
              WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
              WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
          END, ''
      ) AS "averageRank",
      COALESCE(FLOOR(AVG(highest_mmr.max_mmr)), 0) AS "mmr",
      TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
      COUNT(DISTINCT highest_mmr.playerid) AS "players"
      FROM 
          public.teams t
      LEFT JOIN 
          (
              SELECT 
                  tp.teamid,
                  tp.playerid,
                  MAX(r.mmr) AS max_mmr
              FROM 
                  public.teamplayers tp
              JOIN 
                  public.playerroles pr ON tp.playerid = pr.playerid AND tp.roleid = pr.roleid
              JOIN 
                  public.ranks r ON pr.rankid = r.rankid
              GROUP BY 
                  tp.teamid, tp.playerid
          ) AS highest_mmr ON t.teamid = highest_mmr.teamid
      LEFT JOIN 
          public.tournamentteams tt ON t.teamid = tt.teamid
      WHERE 
          tt.tournamentid = ? 
      GROUP BY 
          t.teamid
      ORDER BY 
          "mmr" DESC, "name";
      `,
    [id]
  );

  const getAvailableTeamsQuery = sqlstring.format(
    `
    SELECT 
    teamid AS id, 
    teamname AS name
    FROM 
        public.teams
    WHERE 
        teamid NOT IN (
            SELECT 
                teamid
            FROM 
                public.tournamentteams
            WHERE 
                tournamentid = ?
        );
    `,
    [eid]
  )

  try {

    let query;
    if (id) {
      query = getTournamentTeamsQuery;
    } else {
      query = getAvailableTeamsQuery;
    }

    const result = await pool.query(query);

    if (result.rowCount === 0) {

      if (eid) {
        return createResponse("getAvailableTeamsQuery returned nothing", 409);
      }
      return createResponse("No Teams Found", 400);
    }

    return new Response(JSON.stringify({ tournamentTeamsRows: result.rows }), {
      status: 200,
    });

  } catch (e) {
    console.error(e);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

const createTournamentTeamsSchema = zod
  .object({
    tournamentID: zod.string().max(64).min(1),
    teamID: zod.string().max(64).min(1),
  });

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/tournamentteams/' with a body containing 'id', 'role', 'rankName', and 'rankDivision' to create a new player role.
 */
async function createTournamentTeamsHandler(req: NextRequest) {
  const body = await extractbody(req);

  const { tournamentID, teamID } =
    createTournamentTeamsSchema.parse(body);

  const createTournamentTeamsQuery = sqlstring.format(
    `
    INSERT INTO public.tournamentteams (tournamentid, teamid)
    VALUES (?, ?); 
    `,
    [tournamentID, teamID]
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(createTournamentTeamsQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to add the team to the tournament.", 400);
    }

    return createResponse("Team added to the tournament successfully.", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}


/**
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/tournamentteams/' with a body containing 'tournamentID', 'teamID' to delete a player role.
 */
async function deleteTournamentTeamsHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { tournamentID, teamID } = createTournamentTeamsSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deleteTournamentTeamsQuery = sqlstring.format(
    `
    DELETE FROM public.tournamentteams
    WHERE tournamentid = ? AND teamid = ?;
    `,
    [tournamentID, teamID]
  );

  try {
    const result = await pool.query(deleteTournamentTeamsQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to remove the team from the tournament", 400);
    }

    return createResponse("Team removed from the tournament", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

export async function GET(req: NextRequest) {
  return readTournamentTeamsHandler(req);
}

export async function POST(req: NextRequest) {
  return createTournamentTeamsHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteTournamentTeamsHandler(req);
}


