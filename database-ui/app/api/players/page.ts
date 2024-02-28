/*
Citation for the following code:
Date: 2/27/2024
Adapted from Build & Deploy a Next.js Project with Neon & Vercel:
Source URL: https://youtu.be/_LF-IvJsr5Y
*/

import { extractbody } from "@/utils/extractBody";
import { NextRequest, NextFetchEvent } from "next/server";
import zod from "zod";
import sqlstring from "sqlstring";
import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

const schema = zod.object({
  username: zod.string().max(255).min(1),
  email: zod.string().email(),
  id: zod.string().max(64).min(1),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/players/' with a body containing 'username', and 'email' to create a new player.
 */
async function createPlayerHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractbody(req);

  const { username, email } = schema.parse(body);

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
    const { rows: userRows } = await pool.query(createPlayerQuery);

    return new Response(JSON.stringify({ userRows }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Page not found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

/** Usage Example: Send a GET request to 'http://localhost:3000/api/players/?id=1' to retrieve the player role with ID 1.
 * Usage Example: Send a GET request to 'http://localhost:3000/api/players/' to retrieve all the players.
 */
async function readPlayersHandler(req: NextRequest, event: NextFetchEvent) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getPlayerQuery = id ? sqlstring.format(
    `
    SELECT
    p.username AS "Player Name",
    r.rankname AS "Highest Rank",
    to_char(p.createdat, 'YYYY-MM-DD') AS "Date Added",
    p.email AS "Email"
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
  ) : null;

  const getPlayersQuery = sqlstring.format(
    `
    SELECT
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
        p.username, r.rankname, r.division, r.mmr, p.email, p.createdat
    ORDER BY
        MMR DESC;
    `
  );

  try {
    const query = id ? getPlayerQuery : getPlayersQuery;
    const { rows: playersRows } = await pool.query(query || '');

    return new Response(JSON.stringify({ playersRows }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return (
      new Response("Page not found"),
      {
        status: 404,
      }
    );
  } finally {
    event.waitUntil(pool.end());
  }
}

async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method === "POST") {
    return createPlayerHandler(req, event);
  }

  if (req.method === "GET") {
    return readPlayersHandler(req, event);
  }

  return new Response("Invalid Method", {
    status: 405,
  });
}

export default handler;
