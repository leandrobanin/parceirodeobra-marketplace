import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getSeedPassword(): string {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error('Set SEED_PASSWORD with at least 12 characters before running prisma seed.');
  }

  return password;
}

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.portfolioPhoto.deleteMany();
  await prisma.professionalCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  const categoriesData = [
    { name: 'Pedreiro', slug: 'pedreiro', icon: 'Construction' },
    { name: 'Eletricista', slug: 'eletricista', icon: 'Zap' },
    { name: 'Encanador', slug: 'encanador', icon: 'Wrench' },
    { name: 'Pintor', slug: 'pintor', icon: 'Paintbrush' },
    { name: 'Gesseiro', slug: 'gesseiro', icon: 'Grid' },
    { name: 'Técnico', slug: 'tecnico', icon: 'Tool' },
    { name: 'Empreiteiro', slug: 'empreiteiro', icon: 'Briefcase' },
    { name: 'Instalador', slug: 'instalador', icon: 'Settings' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: cat,
    });
    categories.push(category);
  }

  // Create Users and Professionals
  const hashedPassword = await bcrypt.hash(getSeedPassword(), 12);

  // Professional 1: Pedreiro
  const user1 = await prisma.user.create({
    data: {
      email: 'joao.pedreiro@example.com',
      password: hashedPassword,
      role: "PROFESSIONAL",
      professional: {
        create: {
          name: 'João Silva',
          slug: 'joao-silva-pedreiro',
          city: 'São Paulo',
          state: 'SP',
          specialties: JSON.stringify(['Alvenaria', 'Reboco', 'Piso']),
          description: 'Pedreiro com mais de 10 anos de experiência em reformas e construções do zero.',
          whatsapp: '11999999999',
          categories: {
            create: [
              { categoryId: categories.find(c => c.slug === 'pedreiro')!.id }
            ]
          }
        }
      }
    }
  });

  // Professional 2: Eletricista & Encanador
  const user2 = await prisma.user.create({
    data: {
      email: 'carlos.eletrica@example.com',
      password: hashedPassword,
      role: "PROFESSIONAL",
      professional: {
        create: {
          name: 'Carlos Santos',
          slug: 'carlos-santos-eletricista',
          city: 'Rio de Janeiro',
          state: 'RJ',
          specialties: JSON.stringify(['Instalação Elétrica', 'Manutenção', 'Hidráulica']),
          description: 'Especialista em elétrica e hidráulica residencial e comercial.',
          whatsapp: '21988888888',
          categories: {
            create: [
              { categoryId: categories.find(c => c.slug === 'eletricista')!.id },
              { categoryId: categories.find(c => c.slug === 'encanador')!.id }
            ]
          }
        }
      }
    }
  });

  // Create Admin User
  await prisma.user.create({
    data: {
      email: 'admin@parceirodeobra.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    }
  });

  // Create Customer
  const customerUser = await prisma.user.create({
    data: {
      email: 'cliente@example.com',
      password: hashedPassword,
      role: "CUSTOMER",
      customer: {
        create: {
          name: 'Maria Oliveira',
          city: 'São Paulo'
        }
      }
    },
    include: { customer: true }
  });

  // Create Reviews
  const pro1 = await prisma.professional.findUnique({ where: { slug: 'joao-silva-pedreiro' } });
  const pro2 = await prisma.professional.findUnique({ where: { slug: 'carlos-santos-eletricista' } });

  if (pro1 && customerUser.customer) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excelente profissional, muito pontual e serviço de qualidade.',
        customerId: customerUser.customer.id,
        professionalId: pro1.id
      }
    });
  }

  if (pro2 && customerUser.customer) {
    await prisma.review.create({
      data: {
        rating: 4,
        comment: 'Bom serviço, resolveu o problema rapidamente.',
        customerId: customerUser.customer.id,
        professionalId: pro2.id
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
