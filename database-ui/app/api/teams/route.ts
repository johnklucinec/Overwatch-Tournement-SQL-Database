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

/**
 * Schema to check for valid entries into the database
 */
<<<<<<< HEAD
const createTeamSchema = zod.object({
=======
const createTeamschema = zod.object({
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
  name: zod.string().max(25).min(1),
  date: zod
    .string()
    .max(25)
    .min(1)
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Date must be in the format YYYY-MM-DD",
    }),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/teams/' with a body containing 'name', and 'date' to create a new team.
 */
async function createTeamHandler(req: NextRequest) {
  const body = await extractbody(req);
<<<<<<< HEAD
  const { name, date } = createTeamSchema.parse(body);
=======
  const { name, date } = createTeamschema.parse(body);
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createTeamQuery = sqlstring.format(
    `
    INSERT INTO teams (teamname, formationdate)
    VALUES (?, ?);
    `,
    [name, date]
  );

  try {
    const result = await pool.query(createTeamQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to create team", 400);
    }

    return createResponse("Team added successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/teams/?id=1' to retrieve the team role with ID 1.
 * Usage Example: Send a GET request to 'http://localhost:3000/api/teams/' to retrieve all the teams.
 */
async function readTeamsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getTeamQuery = id
    ? sqlstring.format(
        `
        SELECT 
        t.teamid AS "id",
        t.teamname AS "name",
        TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
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
    WHERE 
        t.teamid = ?
    GROUP BY 
        t.teamid
    ORDER BY 
        "mmr" DESC, "name";
    `,
        [id]
      )
    : null;

  const getTeamsQuery = sqlstring.format(
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
    GROUP BY 
        t.teamid
    ORDER BY 
        "mmr" DESC, "name";
    `
  );

  try {
    const query = id ? getTeamQuery : getTeamsQuery;
    const result = await pool.query(query || "");

    if (result.rowCount === 0) {
      return createResponse("No Team found with this ID", 400);
    }

    return new Response(JSON.stringify({ playersRows: result.rows }), {
      status: 200,
    });
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

/**
 * Schema to check for valid entries into the database
 */
const deleteTeamSchema = zod.object({
  teamID: zod.string().max(25).min(1),
});

/**
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/teams/' with a body containing 'teamID' to delete a team.
 */
async function deleteTeamHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { teamID } = deleteTeamSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deleteTeamsQuery = sqlstring.format(
    `
    DELETE FROM public.teams
    WHERE teamid = ?;
    `,
    [teamID]
  );

  try {
    const result = await pool.query(deleteTeamsQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to remove the team from the team", 400);
    }

    return createResponse("Team Deleted", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

/**
 * Schema to check for valid entries into the database
 * Needs optional()
 */
const updateTeamSchema = zod.object({
  id: zod.string().max(255).min(1),
  name: zod.string().max(255).min(1).optional(),
  date: zod.string().max(25).min(1).optional(),
});

/**
 * Usage Example: Send a PATCH request to 'http://localhost:3000/api/players/' to update the player with a body containing 'id', 'username', and 'email'
 */
async function updateTeamHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { id, name, date } = updateTeamSchema.parse(body);

  // Convert empty strings to null for the date
  const isValidDate = date ? !isNaN(Date.parse(date)) : false;
  const formattedDate = isValidDate ? date : null;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // name or date can be optional if left blank
  const updateTeamQuery = sqlstring.format(
    `
    UPDATE public.teams
    SET
       teamname = COALESCE(NULLIF(?, ''), teamname),
       formationdate = COALESCE(NULLIF(?, ''), formationdate::text)::timestamp
    WHERE teamid = ?;
    `,
    [name, formattedDate, id]
  );

  try {
    const result = await pool.query(updateTeamQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to update team", 400);
    }

    return createResponse("Team updated successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

export async function GET(req: NextRequest) {
  return readTeamsHandler(req);
}

export async function PATCH(req: NextRequest) {
  return updateTeamHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteTeamHandler(req);
}

export async function POST(req: NextRequest) {
  return createTeamHandler(req);
}
