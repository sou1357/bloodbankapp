import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organizationProfile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const bloodBankOnly = (req, res, next) => {
  if (req.user.role !== 'BLOOD_SERVICE' || req.user.organizationProfile?.organizationType !== 'BLOOD_BANK') {
    return res.status(403).json({ error: 'Access denied. Blood Bank only.' });
  }
  next();
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: { blood_group: 'asc' }
    });
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

router.post('/', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const { blood_group, quantity, expiry_date, status } = req.body;

    if (!blood_group || quantity === undefined) {
      return res.status(400).json({ error: 'Blood group and quantity are required' });
    }

    const existingInventory = await prisma.inventory.findUnique({
      where: { blood_group }
    });

    if (existingInventory) {
      return res.status(400).json({ error: 'Inventory for this blood group already exists. Use update instead.' });
    }

    const inventory = await prisma.inventory.create({
      data: {
        blood_group,
        quantity,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        status: status || 'AVAILABLE'
      }
    });

    res.status(201).json(inventory);
  } catch (error) {
    console.error('Error creating inventory:', error);
    res.status(500).json({ error: 'Failed to create inventory' });
  }
});

router.put('/:id', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const { quantity, expiry_date, status } = req.body;
    const id = parseInt(req.params.id);

    const existingInventory = await prisma.inventory.findUnique({
      where: { id }
    });

    if (!existingInventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: quantity !== undefined ? quantity : existingInventory.quantity,
        expiry_date: expiry_date ? new Date(expiry_date) : existingInventory.expiry_date,
        status: status || existingInventory.status
      }
    });

    res.json(inventory);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

router.delete('/:id', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.inventory.delete({
      where: { id }
    });

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;
