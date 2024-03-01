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

const createPlayerRolesSchema = zod.object({
  id: zod.string().max(64).min(1).optional(),
  username: zod.string().max(255).min(1).optional(),
  role: zod.string().max(255).min(1),
  rankName: zod.string().max(255),
  rankDivision: zod.string().max(64).min(1),
}).refine(data => data.id || data.username, {
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
    await pool.query(createPlayerRolesQuery);

    return new Response(JSON.stringify({ id }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Page not found", {
      status: 404,
    });
  } finally {
    await pool.end();
  }
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/playerroles/?id=1' to retrieve the player role with ID 1.
 */
async function readPlayerRolessHandler(req: NextRequest) {
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
    SELECT pr.roleid AS "Role ID",
           r.rolename AS "Role",
           rk.rankname || ' ' || rk.division AS "Rank"
    FROM playerroles pr
    JOIN roles r ON pr.roleid = r.roleid
    JOIN ranks rk ON pr.rankid = rk.rankid
    WHERE pr.playerid = ?;
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
    return new Response("Page not found", {
      status: 404,
    });
  } finally {
    await pool.end();
  }
}

export async function POST(req: NextRequest) {
  return createPlayerRolesHandler(req);
}

export async function GET(req: NextRequest) {
  return readPlayerRolessHandler(req);
}
