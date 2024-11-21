import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function itemRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    quantity: z.number().min(1),
    dateAdded: z.coerce.date(),
  });

  app.get("/items", async () => {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        dateAdded: true,
      },
    });

    return items;
  });

  app.get("/items/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const item = await prisma.item.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return item;
  });

  app.post("/items", async (req, rep) => {
    const { name, description, quantity, dateAdded } = bodySchema.parse(req.body);

    const item = await prisma.item.create({
      data: {
        name,
        description,
        quantity,
        dateAdded,
      },
    });

    return rep.code(201).send(item);
  });

  app.delete("/items/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const item = await prisma.item.delete({
      where: {
        id,
      },
    });

    return item;
  });

  app.put("/items/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { name, description, quantity, dateAdded } = bodySchema.parse(req.body);

    const updatedItem = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        quantity,
        dateAdded,
      },
    });

    return rep.send(updatedItem);
  });
}
