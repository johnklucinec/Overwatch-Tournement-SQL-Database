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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/teamplayers/?id=1' to retrieve all the players on the team with the ID 1.
 * Send a GET request to 'http://localhost:3000/api/teamplayers/?eid=1' to retrieve all the players NOT on the team with the ID 1.
 * Send a GET request to 'http://localhost:3000/api/teamplayers/?iid=1' to retrieve all the players ARE on the team with the ID 1.
 * Technically, you can use the first query, but this one is better performance wise.
 */
async function readTeamPlayersHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const eid = searchParams.get("eid");
  const iid = searchParams.get("iid");

  if (!id && !eid && !iid) {
    return createResponse("No Players found", 404);
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
     LIMIT 1) AS "highestRank",
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

  const getAvailablePlayersQuery = sqlstring.format(
    `
    SELECT
    p.playerid AS id,
    p.username AS name,
    ARRAY_AGG(DISTINCT ro.rolename ORDER BY ro.rolename) AS roles
    FROM
        players p
    JOIN playerroles pr ON p.playerid = pr.playerid
    JOIN roles ro ON pr.roleid = ro.roleid
    WHERE
        p.playerid NOT IN (
            SELECT
                tp.playerid
            FROM
                teamplayers tp
            WHERE
                tp.teamid = ?
        )
    GROUP BY
        p.playerid, p.username
    ORDER BY
        p.username;
    `,
    [eid]
  );

  const getCurrentPlayersQuery = sqlstring.format(
    `
    SELECT
    p.playerid AS id,
    p.username AS name,
    ARRAY_AGG(DISTINCT ro.rolename ORDER BY ro.rolename) AS roles
    FROM
        public.players p
    JOIN
        public.playerroles pr ON p.playerid = pr.playerid
    JOIN
        public.roles ro ON pr.roleid = ro.roleid
    JOIN
        public.teamplayers tp ON p.playerid = tp.playerid
    WHERE
        tp.teamid = ?
    GROUP BY
        p.playerid, p.username
    ORDER BY
        p.username;
    `,
    [iid]
  );

  try {
    let query;
    if (id) {
      query = getPlayerRolesQuery;
    } else if (eid) {
      query = getAvailablePlayersQuery;
    } else {
      query = getCurrentPlayersQuery;
    }

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      if (iid || eid) {
        return createResponse("No Players found", 409);
      }
      return createResponse("No Players found", 400);
    }

    return new Response(JSON.stringify({ playerRolesRows: result.rows }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

/**
 * Schema to check for valid entries into the database
 */
const createTeamPlayerSchema = zod.object({
  teamID: zod.string().max(255).min(1),
  playerID: zod.string().max(255).min(1),
  role: zod.enum(['TANK', 'DPS', 'SUPPORT']),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/teamplayers/' with a body containing 'teamID', 'playerID' and 'role' to add a player and thier role to a team. 
 */
async function createTeamPlayerHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { teamID, playerID, role } = createTeamPlayerSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createRoleQuery = sqlstring.format(
    `
    INSERT INTO TeamPlayers (playerID, roleID, teamID) 
    VALUES (?, (SELECT roleID FROM Roles WHERE roleName = ?), ?);
    `,
    [playerID, role, teamID]
  );

  try {
    const result = await pool.query(createRoleQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to create role", 400);
    }

    return createResponse("Role added successfully", 200);

  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);

  } finally {
    await pool.end();
  }
}

const deletePlayerRolesSchema = zod.object({
  teamID: zod.string().max(255).min(1),
  playerID: zod.string().max(255).min(1),
  role: zod.enum(['TANK', 'DPS', 'SUPPORT']).optional(),
});

/**
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/teamplayers/' with a body containing 'id', 'role' to delete a player role.
 */
async function deletePlayerRolesHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { teamID, playerID, role } = deletePlayerRolesSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deletePlayerRolesQuery = role ? sqlstring.format(
    `
    DELETE FROM TeamPlayers
    WHERE playerID = ?
      AND teamID = ?
      AND roleID = (SELECT roleID FROM Roles WHERE roleName = ?);
    `,
    [playerID, teamID, role]
  ) : sqlstring.format(
    `
    DELETE FROM TeamPlayers
    WHERE playerID = ?
      AND teamID = ?;
    `,
    [playerID, teamID]
  );

  try {
    const result = await pool.query(deletePlayerRolesQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to remove player's roles", 400);
    }

    return createResponse("Player's role removed", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}


export async function GET(req: NextRequest) {
  return readTeamPlayersHandler(req);
}

export async function POST(req: NextRequest) {
  return createTeamPlayerHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deletePlayerRolesHandler(req);
}
