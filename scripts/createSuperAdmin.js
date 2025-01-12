const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const username = 'superadmin'; // Ganti dengan username yang diinginkan
  const password = 'password123'; // Ganti dengan password yang diinginkan
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Super Admin', // Ganti dengan nama yang diinginkan
      username: username,
      password: hashedPassword,
      role: 'SUPER_ADMIN', // Set peran SUPER_ADMIN
      divisi: 'Management', // Ganti dengan divisi yang diinginkan
    },
  });

  console.log('Super admin user created:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
