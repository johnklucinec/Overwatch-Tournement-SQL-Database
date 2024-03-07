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
const createPlayerschema = zod.object({
  username: zod.string().max(255).min(1),
  email: zod.string().email(),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/players/' with a body containing 'username', and 'email' to create a new player.
 */
async function createPlayerHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { username, email } = createPlayerschema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createPlayerQuery = sqlstring.format(
    `
    INSERT INTO players (username, email, createdat)
    VALUES (?, ?, NOW());
    `,
    [username, email]
  );

  try {
    const result = await pool.query(createPlayerQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to create player", 400);
    }

    return createResponse("Player added successfully", 200);

  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);

  } finally {
    await pool.end();
  }
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/players/?id=1' to retrieve the player role with ID 1.
 * Usage Example: Send a GET request to 'http://localhost:3000/api/players/' to retrieve all the players.
 */
async function readPlayersHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getPlayerQuery = id
    ? sqlstring.format(
        `
        SELECT
        p.username AS "name",
        r.rankname || ' ' || r.division AS "highestRank",
        to_char(p.createdat, 'YYYY-MM-DD') AS "createdAt",
        p.email AS "email"
        FROM
            players p
        JOIN
            playerroles pr ON p.playerid = pr.playerid
        JOIN
            ranks r ON pr.rankid = r.rankid
        WHERE
            p.playerid = ?
        ORDER BY
            r.mmr DESC
        LIMIT 1;
    `,
        [id]
      )
    : null;

  const getPlayersQuery = sqlstring.format(
    `
    SELECT
    p.playerid AS id,
    p.username AS Name,
    r.rankname || ' ' || CAST(r.division AS VARCHAR) AS HighestRank,
    r.mmr AS MMR,
    p.email AS Email,
    TO_CHAR(p.createdat, 'YYYY-MM-DD') AS CreatedAt,
    ARRAY_AGG(ro.rolename ORDER BY ro.rolename) AS Roles
    FROM
        players p
    JOIN
        (SELECT
            pr.playerid,
            MAX(rk.mmr) AS max_mmr
        FROM
            playerroles pr
        JOIN ranks rk ON pr.rankid = rk.rankid
        GROUP BY pr.playerid) AS highest_rank
    ON
        p.playerid = highest_rank.playerid
    JOIN
        ranks r ON highest_rank.max_mmr = r.mmr
    JOIN
        playerroles pr ON p.playerid = pr.playerid
    JOIN
        roles ro ON pr.roleid = ro.roleid
    GROUP BY
        p.playerid, p.username, r.rankname, r.division, r.mmr, p.email, p.createdat
    ORDER BY
        MMR DESC;
    `
  );

  try {
    const query = id ? getPlayerQuery : getPlayersQuery;
    const result = await pool.query(query || "");

    if (result.rowCount === 0) {
      return createResponse("No Player found with this ID", 400);
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
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/players/?id=1' to delete the player with ID 1.
 */
async function deletePlayerHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return createResponse("Missing Player ID", 400);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deletePlayerQuery = sqlstring.format(
    `
    DELETE FROM players
    WHERE playerid = ?;
    `,
    [id]
  );

  try {
    const result = await pool.query(deletePlayerQuery);

    if (result.rowCount === 0) {
      return createResponse("No Player found with that ID", 400);
    }

    return createResponse("Player deleted successfully", 200);

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
const updatePlayerSchema = zod.object({
  id: zod.string().max(255).min(1),
  username: zod.string().max(255).min(1).optional(),
  email: zod.string().email().optional(),
});

/**
 * Usage Example: Send a PATCH request to 'http://localhost:3000/api/players/' to update the player with a body containing 'id', 'username', and 'email'
 */
async function updatePlayerHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { id, username, email } = updatePlayerSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // username or email can be optional if left blank
  const updatePlayerQuery = sqlstring.format(
    `
    UPDATE public.players
    SET
      username = COALESCE(NULLIF(?, ''), username),
      email = COALESCE(NULLIF(?, ''), email)
    WHERE playerid = ?;
    `,
    [username, email, id]
  );

  try {
    const result = await pool.query(updatePlayerQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to update player", 400);
    }

    return createResponse("Player updated successfully", 200);

  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
    
  } finally {
    await pool.end();
  }
}

export async function PATCH(req: NextRequest) {
  return updatePlayerHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deletePlayerHandler(req);
}

export async function POST(req: NextRequest) {
  return createPlayerHandler(req);
}

export async function GET(req: NextRequest) {
  return readPlayersHandler(req);
}
