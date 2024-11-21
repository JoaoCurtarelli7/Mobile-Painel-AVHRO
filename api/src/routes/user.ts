import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export async function userRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    isAdmin: z.boolean(),
  });

  app.get("/users", async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true, 
        dateRegistration: true,
      },
    });

    return users;
  });

  app.get("/users/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true, // Incluído no retorno do usuário individual
        dateRegistration: true,
      },
    });

    return user;
  });

  app.post("/users", async (req, rep) => {
    const { name, email, password, isAdmin } = bodySchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return rep.code(400).send({ error: "E-mail já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
        dateRegistration: new Date(),
      },
    });

    return rep.code(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      dateRegistration: user.dateRegistration,
    });
  });

  app.put("/users/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);
    const { name, email, password, isAdmin } = bodySchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    return rep.send({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      dateRegistration: updatedUser.dateRegistration,
    });
  });

  app.delete("/users/:id", async (req, rep) => {
    const { id } = paramsSchema.parse(req.params);

    await prisma.user.delete({
      where: { id },
    });

    return rep.code(204).send();
  });
}
