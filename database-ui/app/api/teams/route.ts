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


/** Usage Example: Send a GET request to 'http://localhost:3000/api/teams/?id=1' to retrieve the team role with ID 1.
 * Usage Example: Send a GET request to 'http://localhost:3000/api/teams/' to retrieve all the teams.
 */
async function readPlayersHandler(req: NextRequest) {
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
        END || ' ' ||
        CASE
            WHEN AVG(highest_mmr.max_mmr) % 500 < 100 THEN '5'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 200 THEN '4'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 300 THEN '3'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 400 THEN '2'
            WHEN AVG(highest_mmr.max_mmr) % 500 < 500 THEN '1'
        END AS "averageRank",
        FLOOR(AVG(highest_mmr.max_mmr)) AS "mmr",
        TO_CHAR(t.formationdate, 'YYYY-MM-DD') AS "formationDate",
        COUNT(DISTINCT highest_mmr.playerid) AS "players"
        FROM 
            public.teams t
        JOIN 
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



export async function GET(req: NextRequest) {
  return readPlayersHandler(req);
}
