import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function familyRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    dateRegistration: z.coerce.date(),
    bairro: z.string(),
    numberMembers: z.number(),
  });

  app.get("/family", async () => {
    const family = await prisma.family.findMany();

    return family;
  });

  app.get("/family/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const family = await prisma.family.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return family;
  });

  app.post("/family", async (req, rep) => {
    const dataBody = bodySchema.parse(req.body);

    const family = await prisma.family.create({
      data: dataBody,
    });

    return rep.code(201).send(family);
  });

  app.put("/family/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const dataBody = bodySchema.parse(req.body);

    const family = await prisma.family.update({
      where: {
        id,
      },
      data: dataBody,
    });

    return family;
  });

  app.delete("/family/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const family = await prisma.family.delete({
      where: {
        id,
      },
    });

    return family;
  });
}