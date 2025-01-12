// pages/api/lokasi.js
import prisma from '@/lib/prisma';
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const lokasi = await prisma.lokasi.findMany();
        res.status(200).json(lokasi);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lokasi' });
      }
      break;
    case 'POST':
      try {
        const { kampus, gedung, ruangan } = req.body;
        const newLokasi = await prisma.lokasi.create({
          data: {
            kampus,
            gedung,
            ruangan,
          },
        });
        res.status(201).json(newLokasi);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create lokasi' });
      }
      break;
    case 'PATCH':
      try {
        const { id, kampus, gedung, ruangan } = req.body;
        const updatedLokasi = await prisma.lokasi.update({
          where: { id },
          data: {
            kampus,
            gedung,
            ruangan,
          },
        });
        res.status(201).json(updatedLokasi);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update lokasi' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
