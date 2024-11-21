import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function donationDeliveredRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    item: z.string(),
    date: z.coerce.date(),
    donataryId: z.number(),
  });

  app.get("/donation-delivered", async () => {
    const donationDelivered = await prisma.donationDelivered.findMany({
      select: {
        id: true,
        item: true,
        date: true,
        donatary: {
          select: {
            cpf: true,
            name: true,
            id: true,
          },
        },
      },
    });

    return donationDelivered;
  });

  app.get("/donation-delivered/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donationDelivered = await prisma.donationDelivered.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return donationDelivered;
  });

  app.post("/donation-delivered", async (req, rep) => {
    const { date, donataryId, item } = bodySchema.parse(req.body);

    const donationDelivered = await prisma.donationDelivered.create({
      data: {
        date,
        item,
        donataryId,
      },
    });

    return rep.code(201).send(donationDelivered);
  });

  app.delete("/donation-delivered/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donationDelivered = await prisma.donationDelivered.delete({
      where: {
        id,
      },
    });

    return donationDelivered;
  });

  app.put("/donation-delivered/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { date, donataryId, item } = bodySchema.parse(req.body);

    try {
      await prisma.donationDelivered.findUnique({
        where: {
          id,
        },
      });

      const updatedDoacaoEntregue = await prisma.donationDelivered.update({
        where: {
          id,
        },
        data: {
          date,
          item,
          donataryId,
        },
      });

      return rep.send(updatedDoacaoEntregue);
    } catch (error) {
      console.error(error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}
