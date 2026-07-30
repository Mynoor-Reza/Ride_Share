import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { phone: '01700000000' },
    update: {},
    create: {
      phone: '01700000000',
      password,
      name: 'Admin',
      role: 'SUPER_ADMIN',
      verificationStatus: 'APPROVED',
    },
  });

  console.log('Admin created:', { id: admin.id, phone: admin.phone, password: 'admin123' });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
