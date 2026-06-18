const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Carol Admin',
      email: 'admin@rental.com',
      password: hashedPassword,
      phone: '01711000003',
      role: 'admin',
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Rahman',
      email: 'alice@example.com',
      password: hashedPassword,
      phone: '01711000001',
      role: 'customer',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Hossain',
      email: 'bob@example.com',
      password: hashedPassword,
      phone: '01711000002',
      role: 'customer',
    },
  });

  const david = await prisma.user.create({
    data: {
      name: 'David Islam',
      email: 'david@example.com',
      password: hashedPassword,
      phone: '01711000004',
      role: 'customer',
    },
  });

  const eva = await prisma.user.create({
    data: {
      name: 'Eva Begum',
      email: 'eva@example.com',
      password: hashedPassword,
      phone: '01711000005',
      role: 'customer',
    },
  });

  // Create vehicles
  const corolla = await prisma.vehicle.create({
    data: {
      name: 'Toyota Corolla',
      type: 'car',
      model: '2022',
      registrationNumber: 'DHK-CA-1001',
      pricePerDay: 2500.0,
      availability: 'available',
    },
  });

  const cb500 = await prisma.vehicle.create({
    data: {
      name: 'Honda CB500',
      type: 'bike',
      model: '2021',
      registrationNumber: 'DHK-BK-2001',
      pricePerDay: 800.0,
      availability: 'available',
    },
  });

  const isuzu = await prisma.vehicle.create({
    data: {
      name: 'Isuzu NLR',
      type: 'truck',
      model: '2020',
      registrationNumber: 'DHK-TR-3001',
      pricePerDay: 5000.0,
      availability: 'rented',
    },
  });

  const sunny = await prisma.vehicle.create({
    data: {
      name: 'Nissan Sunny',
      type: 'car',
      model: '2023',
      registrationNumber: 'DHK-CA-1002',
      pricePerDay: 2200.0,
      availability: 'available',
    },
  });

  await prisma.vehicle.create({
    data: {
      name: 'Yamaha FZS',
      type: 'bike',
      model: '2022',
      registrationNumber: 'DHK-BK-2002',
      pricePerDay: 700.0,
      availability: 'maintenance',
    },
  });

  const hiace = await prisma.vehicle.create({
    data: {
      name: 'Toyota Hiace',
      type: 'truck',
      model: '2019',
      registrationNumber: 'DHK-TR-3002',
      pricePerDay: 4500.0,
      availability: 'available',
    },
  });

  await prisma.vehicle.create({
    data: {
      name: 'Suzuki Swift',
      type: 'car',
      model: '2021',
      registrationNumber: 'DHK-CA-1003',
      pricePerDay: 1800.0,
      availability: 'available',
    },
  });

  // Create bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: alice.id,
        vehicleId: corolla.id,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-04'),
        totalCost: 7500.0,
        status: 'completed',
      },
      {
        userId: bob.id,
        vehicleId: corolla.id,
        startDate: new Date('2025-06-10'),
        endDate: new Date('2025-06-13'),
        totalCost: 7500.0,
        status: 'completed',
      },
      {
        userId: david.id,
        vehicleId: corolla.id,
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-05'),
        totalCost: 10000.0,
        status: 'confirmed',
      },
      {
        userId: alice.id,
        vehicleId: isuzu.id,
        startDate: new Date('2025-06-05'),
        endDate: new Date('2025-06-08'),
        totalCost: 15000.0,
        status: 'completed',
      },
      {
        userId: eva.id,
        vehicleId: sunny.id,
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-06-17'),
        totalCost: 4400.0,
        status: 'confirmed',
      },
      {
        userId: bob.id,
        vehicleId: hiace.id,
        startDate: new Date('2025-06-20'),
        endDate: new Date('2025-06-23'),
        totalCost: 13500.0,
        status: 'pending',
      },
      {
        userId: david.id,
        vehicleId: cb500.id,
        startDate: new Date('2025-07-10'),
        endDate: new Date('2025-07-12'),
        totalCost: 1600.0,
        status: 'pending',
      },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('Admin login → email: admin@rental.com | password: password123');
  console.log('User login  → email: alice@example.com | password: password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
