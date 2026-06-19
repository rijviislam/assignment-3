require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  await prisma.booking.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      name: 'Carol Admin',
      email: 'admin@rental.com',
      password: hashedPassword,
      phone: '01711000003',
      role: 'admin',
    },
  })

  await prisma.user.create({
    data: {
      name: 'Alice Rahman',
      email: 'alice@example.com',
      password: hashedPassword,
      phone: '01711000001',
      role: 'customer',
    },
  })

  await prisma.vehicle.create({
    data: {
      name: 'Toyota Corolla',
      type: 'car',
      model: '2022',
      registrationNumber: 'DHK-CA-1001',
      pricePerDay: 2500.0,
      availability: 'available',
    },
  })

  await prisma.vehicle.create({
    data: {
      name: 'Honda CB500',
      type: 'bike',
      model: '2021',
      registrationNumber: 'DHK-BK-2001',
      pricePerDay: 800.0,
      availability: 'available',
    },
  })

  await prisma.vehicle.create({
    data: {
      name: 'Isuzu NLR',
      type: 'truck',
      model: '2020',
      registrationNumber: 'DHK-TR-3001',
      pricePerDay: 5000.0,
      availability: 'available',
    },
  })

  await prisma.vehicle.create({
    data: {
      name: 'Nissan Sunny',
      type: 'car',
      model: '2023',
      registrationNumber: 'DHK-CA-1002',
      pricePerDay: 2200.0,
      availability: 'available',
    },
  })

  await prisma.vehicle.create({
    data: {
      name: 'Toyota Hiace',
      type: 'truck',
      model: '2019',
      registrationNumber: 'DHK-TR-3002',
      pricePerDay: 4500.0,
      availability: 'available',
    },
  })

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => { console.error('Seed error:', e.message) })
  .finally(async () => { await prisma.$disconnect() })