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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/tournaments/?id=1' to get all the info about the tournament with the ID 1
 * Usage Example: Send a GET request to 'http://localhost:3000/api/tournaments/' to retrieve all the tournaments
 */
async function readTournamentsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getTournamentQuery = id
    ? sqlstring.format(
        `
        SELECT 
        t.tournamentid AS "id",
        t.tournamentstatus AS "status",
        t.tournamentname AS "name",
        TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "startDate",
        TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "endDate",
        COALESCE(COUNT(tt.teamid), 0) AS "teams"
        FROM 
            public.tournaments t
        LEFT JOIN 
            public.tournamentteams tt ON t.tournamentid = tt.tournamentid
        WHERE 
            t.tournamentid = ?
        GROUP BY 
            t.tournamentid;
    `,
        [id]
      )
    : null;

  const getTournamentsQuery = sqlstring.format(
    `
    SELECT 
    t.tournamentid AS "id",
    t.tournamentstatus AS "status",
    t.tournamentname AS "name",
    TO_CHAR(t.startdate, 'YYYY-MM-DD') AS "startDate",
    TO_CHAR(t.enddate, 'YYYY-MM-DD') AS "endDate",
    COUNT(tt.teamid) AS "teams"
    FROM 
        public.tournaments t
    LEFT JOIN 
        public.tournamentteams tt ON t.tournamentid = tt.tournamentid
    GROUP BY 
        t.tournamentid
    ORDER BY 
        t.startdate DESC;
    `
  );

  try {
    const query = id ? getTournamentQuery : getTournamentsQuery;
    const result = await pool.query(query || "");

    if (result.rowCount === 0) {
      return createResponse("No Tournament found with this ID", 400);
    }

    return new Response(JSON.stringify({ tournamentsRows: result.rows }), {
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
const createTournamentSchema = zod.object({
  name: zod.string().max(25).min(1),
  status: zod.string().max(25).min(1),
  startDate: zod
    .string()
    .max(25)
    .min(1)
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Date must be in the format YYYY-MM-DD",
    }),
  endDate: zod
    .string()
    .max(25)
    .min(1)
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Date must be in the format YYYY-MM-DD",
    }),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/tournaments/' with a body containing 'name', 'status', 'startDate', and 'endDate' to create a new tournament.
 */
async function createTournamentHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { name, status, startDate, endDate } =
    createTournamentSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createTournamentQuery = sqlstring.format(
    `
    INSERT INTO public.tournaments (tournamentname, tournamentstatus, startdate, enddate)
    VALUES (?, ?, ?, ?);
    `,
    [name, status, startDate, endDate]
  );

  try {
    const result = await pool.query(createTournamentQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to create tournament", 400);
    }

    return createResponse("Tournament added successfully", 200);
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
const deleteTournamentSchema = zod.object({
  tournamentID: zod.string().max(25).min(1),
});

/**
 * Usage Example: Send a DELETE request to 'http://localhost:3000/api/tournaments/' with a body containing 'tournamentID' to delete a tournament.
 */
async function deleteTournamentHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { tournamentID } = deleteTournamentSchema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const deleteTournamentsQuery = sqlstring.format(
    `
    DELETE FROM public.tournaments
    WHERE tournamentid = ?;
    `,
    [tournamentID]
  );

  try {
    const result = await pool.query(deleteTournamentsQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to remove the tournament", 400);
    }

    return createResponse("Tournament Deleted", 200);
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
const updateTournamentSchema = zod.object({
  id: zod.string().max(255).min(1),
  name: zod.string().max(25).min(1).optional(),
  startDate: zod.string().max(25).min(1).optional(),
  endDate: zod.string().max(25).min(1).optional(),
  status: zod.string().max(255).min(1).optional(),
});

/**
 * Usage Example: Send a PATCH request to 'http://localhost:3000/api/tournaments/' to update the tournament with a body containing 'id', 'name', 'startDate', 'endDate' and or 'status'
 */
async function updateTournamentHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { id, name, startDate, endDate, status } = updateTournamentSchema.parse(body);

  // Convert empty strings to null for the dates
  const isValidStartDate = startDate ? !isNaN(Date.parse(startDate)) : false;
  const formattedStartDate = isValidStartDate ? startDate : null;
  const isValidEndDate = endDate ? !isNaN(Date.parse(endDate)) : false;
  const formattedEndDate = isValidEndDate ? endDate : null;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // name, startDate or endDate can be optional if left blank
  const updateTournamentQuery = sqlstring.format(
    `
    UPDATE public.tournaments
    SET
        tournamentname = COALESCE(NULLIF(?, ''), tournamentname),
        startdate = COALESCE(NULLIF(?, ''), startdate::text)::timestamp,
        enddate = COALESCE(NULLIF(?, ''), enddate::text)::timestamp,
        tournamentstatus = COALESCE(NULLIF(?, ''), tournamentstatus::text)::tournamentstatust
    WHERE tournamentid = ?;
    `,
    [name, formattedStartDate, formattedEndDate, status, id]
  );

  try {
    const result = await pool.query(updateTournamentQuery);

    if (result.rowCount === 0) {
      return createResponse("Failed to update tournament", 400);
    }

    return createResponse("Tournament updated successfully", 200);
  } catch (e) {
    console.error((e as Error).message);
    return createResponse((e as Error).message, 500);
  } finally {
    await pool.end();
  }
}

export async function GET(req: NextRequest) {
  return readTournamentsHandler(req);
}

export async function POST(req: NextRequest) {
  return createTournamentHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteTournamentHandler(req);
}

export async function PATCH(req: NextRequest) {
  return updateTournamentHandler(req);
}
