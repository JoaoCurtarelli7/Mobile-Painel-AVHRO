import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function donataryRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    dateRegistration: z.coerce.date(),
    cpf: z.string(),
  });

  app.get("/donatary", async () => {
    const donatary = await prisma.donatary.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        dateRegistration: true,
      },
    });

    return donatary;
  });

  app.get("/donatary/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donatary = await prisma.donatary.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return donatary;
  });

  app.post("/donatary", async (req, rep) => {
    const { name, dateRegistration, cpf } = bodySchema.parse(req.body);

    const donatary = await prisma.donatary.create({
      data: {
        name,
        dateRegistration,
        cpf,
      },
    });

    return rep.code(201).send(donatary);
  });
  
  app.delete("/donatary/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donatary = await prisma.donatary.delete({
      where: {
        id,
      },
    });

    return donatary;
  });

  app.put("/donatary/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { name, dateRegistration, cpf } = bodySchema.parse(req.body);
  
    try {
      await prisma.donatary.findUnique({
        where: {
          id,
        },
      });
  
      const updatedDonatary = await prisma.donatary.update({
        where: {
          id,
        },
        data: {
          name,
          dateRegistration,
          cpf,
        },
      });
  
      return rep.send(updatedDonatary);
    } catch (error) {
     
  
      console.error(error);
      return rep.code(500).send({ message: 'Erro interno do servidor' });
    }
  });
}
