import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function donorRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    dateRegistration: z.coerce.date(),
    name: z.coerce.string(),
    cpf: z.coerce.string(),
  });

  app.get("/donor", async () => {
    const donors = await prisma.donor.findMany();

    return donors;
  });

  app.get("/donor/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donor = await prisma.donor.findUniqueOrThrow({
      where: {
        id: +id,
      },
    });

    return donor;
  });

  app.post("/donor", async (req, rep) => {
    const { cpf, dateRegistration, name } = bodySchema.parse(req.body);

    const donor = await prisma.donor.create({
      data: { cpf, dateRegistration, name },
    });

    return rep.code(201).send(donor);
  });

  app.delete("/donor/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donor = await prisma.donor.delete({
      where: {
        id,
      },
    });

    return donor;
  });

  app.put("/donor/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { cpf, dateRegistration, name } = bodySchema.parse(req.body);

    const existingDonor = await prisma.donor.findUnique({
      where: { id },
    });

    if (!existingDonor) {
      return rep.code(404).send({ error: "donor not found" });
    }

      const updatedDonor = await prisma.donor.update({
      where: { id },
      data: { cpf, dateRegistration, name },
    });

    return updatedDonor;
  });
}