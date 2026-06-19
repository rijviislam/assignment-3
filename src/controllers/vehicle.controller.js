const prisma = require('../utils/prisma');

const getAllVehicles = async (req, res) => {
  try {
    const { type, availability } = req.query;

    const where = {};
    if (type) where.type = type;
    if (availability) where.availability = availability;

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getNeverBookedVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        bookings: { none: {} },
      },
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMostBookedVehicles = async (req, res) => {
  try {
    const result = await prisma.vehicle.findMany({
      where: {
        bookings: { some: {} },
      },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    const filtered = result
      .filter((v) => v._count.bookings > 2)
      .map((v) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        model: v.model,
        registrationNumber: v.registrationNumber,
        pricePerDay: v.pricePerDay,
        availability: v.availability,
        totalBookings: v._count.bookings,
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings);

    return res.status(200).json({ success: true, data: filtered });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });

    return res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { name, type, model, registrationNumber, pricePerDay, availability } = req.body;

    if (!name || !type || !registrationNumber || !pricePerDay) {
      return res.status(400).json({ success: false, message: 'name, type, registrationNumber and pricePerDay are required.' });
    }

    const vehicle = await prisma.vehicle.create({
      data: { name, type, model, registrationNumber, pricePerDay: parseFloat(pricePerDay), availability: availability || 'available' },
    });

    return res.status(201).json({ success: true, message: 'Vehicle created.', data: vehicle });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Registration number already exists.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, model, registrationNumber, pricePerDay, availability } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(model && { model }),
        ...(registrationNumber && { registrationNumber }),
        ...(pricePerDay && { pricePerDay: parseFloat(pricePerDay) }),
        ...(availability && { availability }),
      },
    });

    return res.status(200).json({ success: true, message: 'Vehicle updated.', data: vehicle });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Registration number already exists.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.vehicle.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Vehicle deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllVehicles,
  getNeverBookedVehicles,
  getMostBookedVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
