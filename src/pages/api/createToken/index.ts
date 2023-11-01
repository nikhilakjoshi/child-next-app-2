import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { z } from "zod";
import { db } from "~/server/db";
type ResponseData = {
  token?: string;
  message?: string;
};

const schemaValidation = z.object({
  key: z.string(),
});

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: "https://parent-next-app.vercel.app",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: typeof cors,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });
  try {
    schemaValidation.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: "Bad Request" });
  }
  const { key } = schemaValidation.parse(req.body);
  await runMiddleware(req, res, cors);
  await db.token.create({
    data: {
      key,
      createdAt: new Date(),
      updatedAt: new Date(),
      value: new Date().getTime().toString(36),
    },
  });
  return res.status(200).send({ message: "Token set" });
}
