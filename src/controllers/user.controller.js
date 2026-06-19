const prisma = require('../utils/prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return res.status(200).json({ success: true, message: 'User updated.', data: user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
