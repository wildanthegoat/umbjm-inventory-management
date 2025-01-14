// pages/api/kategori.js
import prisma from '@/lib/prisma';
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const kategori = await prisma.kategori.findMany();
        res.status(200).json(kategori);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch kategori' });
      }
      break;
    case 'POST':
      try {
        const { nama_kategori } = req.body;
        const newKategori = await prisma.kategori.create({
          data: {
            nama_kategori,
          },
        });
        res.status(201).json(newKategori);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create kategori' });
      }
      break;
    case 'PATCH':
      try {
        const { id, nama_kategori } = req.body;
        const updatedKategori = await prisma.kategori.update({
          where: { id },
          data: {
            nama_kategori,
          },
        });
        res.status(200).json(updatedKategori);        
      } catch (error) {
        res.status(500).json({ error: 'Failed to update kategori' });
      }
      break;
      case "DELETE":
        try {
          const { id } = req.query;
  
          if (!id) {
            return res.status(400).json({ error: "Kategori ID is required" });
          }
  
          await prisma.kategori.delete({
            where: { id },
          });
  
          res.status(200).json({ message: "Kategori deleted successfully" });
        } catch (error) {
          console.error("Error deleting kategori:", error.message);
          res
            .status(500)
            .json({ error: "Failed to delete kategori", details: error.message });
        }
        break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
