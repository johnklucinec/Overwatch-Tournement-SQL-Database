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

const createPlayerRolesSchema = zod
  .object({
    id: zod.string().max(64).min(1).optional(),
    username: zod.string().max(255).min(1).optional(),
    role: zod.string().max(255).min(1),
    rankName: zod.string().max(255),
    rankDivision: zod.string().max(64).min(1),
  })
  .refine((data) => data.id || data.username, {
    message: "Either 'id' or 'username' must be provided",
  });

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/playerroles/' with a body containing 'id', 'role', 'rankName', and 'rankDivision' to create a new player role.
 */
async function createPlayerRolesHandler(req: NextRequest) {
  const body = await extractbody(req);

  const { id, username, role, rankName, rankDivision } =
    createPlayerRolesSchema.parse(body);

  const createPlayerRolesQuery = sqlstring.format(
    `INSERT INTO playerroles (playerid, roleid, rankid) 
    SELECT p.playerid, r.roleid, rk.rankid 
    FROM players p, roles r, ranks rk 
    WHERE (p.playerid = ? OR p.username = ?)
      AND r.rolename = ? 
      AND rk.rankname = ? 
      AND rk.division = ?;`,
    [id, username, role, rankName, rankDivision]
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(createPlayerRolesQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to add the player's roles", 400);
    }

    return createResponse("Player's roles add successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/playerroles/?id=1' to retrieve the player role with ID 1.
 */
async function readPlayerRolesHandler(req: NextRequest) {
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
    SELECT pr.roleid AS "id",
      r.rolename AS "role",
      rk.rankname || ' ' || rk.division AS "rank",
      rk.mmr AS "mmr"
    FROM playerroles pr
    JOIN roles r ON pr.roleid = r.roleid
    JOIN ranks rk ON pr.rankid = rk.rankid
    WHERE pr.playerid = ?
    ORDER BY pr.roleid ASC;
  `,
    [id]
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

const updatePlayerRolesSchema = zod.object({
  id: zod.string().max(64).min(1),
  role: zod.string().max(255).min(1),
  rankName: zod.string().max(255).min(1),
  rankDivision: zod.string().max(64).min(1),
});

/**
 * Usage Example: Send a PATCH request to 'http://localhost:3000/api/playerroles/' with a body containing 'id', 'role', 'rankName', and 'rankDivision' to edit a player role.
 */
async function updatePlayerRolesHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { id, role, rankName, rankDivision } =
    updatePlayerRolesSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const updatePlayerRolesQuery = sqlstring.format(
    `
    INSERT INTO playerroles (playerid, roleid, rankid)
    VALUES (
      ?,
      (SELECT roleid FROM roles WHERE rolename = ?),
      (SELECT rankid FROM ranks WHERE rankname = ? AND division = ?)
    )
    ON CONFLICT (playerid, roleid) DO UPDATE
    SET
      rankid = EXCLUDED.rankid
    `,
    [id, role, rankName, rankDivision]
  );

  try {
    const result = await pool.query(updatePlayerRolesQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to update player's roles", 400);
    }

    return createResponse("Player's roles updated successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

const deletePlayerRolesSchema = zod.object({
  id: zod.string().max(64).min(1),
  role: zod.string().max(255).min(1),
});

/**
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/playerroles/' with a body containing 'id', 'role' to delete a player role.
 */
async function deletePlayerRolesHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { id, role } = deletePlayerRolesSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deletePlayerRolesQuery = sqlstring.format(
    `
    DELETE FROM playerroles
    WHERE playerid = ? AND roleid = (
      SELECT roleid FROM roles WHERE rolename = ?
    );
    `,
    [id, role]
  );

  try {
    const result = await pool.query(deletePlayerRolesQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to delete player's roles", 400);
    }

    return createResponse("Player's role deleted", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

export async function POST(req: NextRequest) {
  return createPlayerRolesHandler(req);
}

export async function GET(req: NextRequest) {
  return readPlayerRolesHandler(req);
}

export async function PATCH(req: NextRequest) {
  return updatePlayerRolesHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deletePlayerRolesHandler(req);
}
