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

/** Usage Example: Send a GET request to 'http://localhost:3000/api/roles/' to retrieve all the roles.
 */
async function readRolesHandler() {

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getRolesQuery = sqlstring.format(
    `
    SELECT
        roleid AS "id",
        rolename AS "roleName"
    FROM
        roles;
    `
  );

  try {
    const result = await pool.query(getRolesQuery);

    if (result.rowCount === 0) {
      return createResponse("No Roles Found", 400);
    }

    return new Response(JSON.stringify({ rolesRows: result.rows }), {
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
const createRoleschema = zod.object({
  role: zod.string().max(20).min(1),
});

/**
 * Usage Example: Send a POST request to 'http://localhost:3000/api/roles/' with a body containing 'username', and 'email' to create a new role.
 */
async function createRoleHandler(req: NextRequest) {
  const body = await extractbody(req);
  const { role } = createRoleschema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const createRoleQuery = sqlstring.format(
    `
    INSERT INTO roles (rolename)
    VALUES (?);
    `,
    [role]
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

export async function GET() {
   return readRolesHandler();
}

export async function POST(req: NextRequest) {
  return createRoleHandler(req);
}
