import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
      break;
    case "POST":
      try {
        const { name, username, password, role, divisi } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            name,
            username,
            password: hashedPassword,
            role,
            divisi,
          },
        });
        res.status(201).json(newUser);
      } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
      }
      break;
    case "PATCH":
      try {
        const { id, name, username, password, role, divisi } = req.body;

        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const data = { name, username, role, divisi };

        if (password) {
          data.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data,
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error.message, error.stack);
        res
          .status(500)
          .json({ error: "Failed to update user", details: error.message });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        await prisma.user.delete({
          where: { id },
        });

        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error.message);
        res
          .status(500)
          .json({ error: "Failed to delete user", details: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
