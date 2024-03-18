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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/ranks/' to retrieve all the ranks.
 */
async function readRanksHandler() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getRanksQuery = sqlstring.format(
    `
    SELECT
      rankid AS "id",
      mmr AS "mmr",
      division AS "division",
      rankname AS "rankName"
    FROM
        ranks;
    `
  );

  try {
    const result = await pool.query(getRanksQuery);

    if (result.rowCount === 0) {
      return createResponse("No Ranks Found", 400);
    }

    return new Response(JSON.stringify({ ranksRows: result.rows }), {
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
 * Schema to check for valid entries into the database for the Ranks table
 */
const createRankSchema = zod.object({
  rankName: zod.enum([
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ]),
  division: zod.enum(["1", "2", "3", "4", "5"]),
  mmr: zod.number().int().min(0),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/ranks/' with a body containing 'username', and 'email' to create a new rank.
 */
async function createRankHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { rankName, division, mmr } = createRankSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createRankQuery = sqlstring.format(
    `
    INSERT INTO ranks (rankName, division, mmr)
    VALUES (?, ?, ?);
    `,
    [rankName, division, mmr]
  );

  try {
    const result = await pool.query(createRankQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to create rank", 400);
    }

    return createResponse("Rank added successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

export async function GET() {
  return readRanksHandler();
}

export async function POST(req: NextRequest) {
  return createRankHandler(req);
}
