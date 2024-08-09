import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firstUser = await prisma.certificateTokens.create({
    data: {
      user: {
        connectOrCreate: {
          where: {
            id: 1,
          },
          create: {
            id: 1,
          },
        },
      },
      higienizacao: 40,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
      higienizacao: true,
    }
  });

  console.log(firstUser);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
