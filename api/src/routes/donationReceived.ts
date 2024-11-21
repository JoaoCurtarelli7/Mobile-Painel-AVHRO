import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function donationReceivedRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    item: z.string(),
    date: z.coerce.date(),
    donorId: z.number(),
  });

 
  app.get("/donation-received", async () => {
    const donationReceived = await prisma.donationReceived.findMany({
      select: {
        id: true,
        item: true,
        date: true,
        donor: {
          select: {
            name: true,
            id: true,         
            cpf: true,
          },
        },
      },
    });

   
    return donationReceived;
  });

  app.get("/donation-received/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donationReceived = await prisma.donationReceived.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return donationReceived;
  });

  app.post("/donation-received", async (req, rep) => {
    const { date, donorId, item } = bodySchema.parse(req.body);

    const donationReceived = await prisma.donationReceived.create({
      data: {
        date,
        donorId,
        item,
      },
    });

    return rep.code(201).send(donationReceived);
  });


  app.put("/donation-received/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { date, donorId, item  } = bodySchema.parse(req.body);
  
    try {
      await prisma.donationReceived.findUnique({
        where: {
          id,
        },
      });
  
      const updatedDonatary = await prisma.donationReceived.update({
        where: {
          id,
        },
        data: {
          date,
          donorId,
          item,
        },
      });
  
      return rep.send(updatedDonatary);
    } catch (error) {
     
  
      console.error(error);
      return rep.code(500).send({ message: 'Erro interno do servidor' });
    }
  });

  app.delete("/donation-received/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const donationReceived = await prisma.donationReceived.delete({
      where: {
        id,
      },
    });

    return donationReceived;
  });
}
