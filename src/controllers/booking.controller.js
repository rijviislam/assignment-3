const prisma = require('../utils/prisma');

const bookingSelect = {
  id: true,
  startDate: true,
  endDate: true,
  totalCost: true,
  status: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
  vehicle: { select: { id: true, name: true, type: true, registrationNumber: true, pricePerDay: true } },
};

const calcDays = (start, end) => {
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getAllBookings = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const bookings = await prisma.booking.findMany({
      where,
      select: bookingSelect,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id }, select: bookingSelect });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (req.user.role !== 'admin' && booking.user.id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'vehicleId, startDate and endDate are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ success: false, message: 'endDate must be after startDate.' });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    if (vehicle.availability !== 'available') {
      return res.status(400).json({ success: false, message: `Vehicle is currently ${vehicle.availability}.` });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        vehicleId: parseInt(vehicleId),
        status: { in: ['pending', 'confirmed'] },
        AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
      },
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'Vehicle is already booked for those dates.' });
    }

    const days = calcDays(start, end);
    const totalCost = parseFloat(vehicle.pricePerDay) * days;

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId: req.user.id,
          vehicleId: parseInt(vehicleId),
          startDate: start,
          endDate: end,
          totalCost,
          status: 'pending',
        },
        select: bookingSelect,
      }),
      prisma.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: { availability: 'rented' },
      }),
    ]);

    return res.status(201).json({ success: true, message: 'Booking created.', data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}.` });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    let vehicleUpdate = null;
    if (status === 'cancelled' || status === 'completed') {
      vehicleUpdate = prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: { availability: 'available' },
      });
    }

    const ops = [
      prisma.booking.update({
        where: { id },
        data: { status },
        select: bookingSelect,
      }),
    ];
    if (vehicleUpdate) ops.push(vehicleUpdate);

    const [updated] = await prisma.$transaction(ops);

    return res.status(200).json({ success: true, message: 'Booking status updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.booking.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Booking deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Booking not found.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBookings, getBookingById, createBooking, updateBookingStatus, deleteBooking };
