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

const hospitalOnly = (req, res, next) => {
  if (req.user.role !== 'BLOOD_SERVICE' || req.user.organizationProfile?.organizationType !== 'HOSPITAL') {
    return res.status(403).json({ error: 'Access denied. Hospital only.' });
  }
  next();
};

const bloodBankOnly = (req, res, next) => {
  if (req.user.role !== 'BLOOD_SERVICE' || req.user.organizationProfile?.organizationType !== 'BLOOD_BANK') {
    return res.status(403).json({ error: 'Access denied. Blood Bank only.' });
  }
  next();
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    let requests;

    if (req.user.role === 'BLOOD_SERVICE' && req.user.organizationProfile?.organizationType === 'HOSPITAL') {
      requests = await prisma.bloodRequest.findMany({
        where: { hospital_id: req.user.id },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (req.user.role === 'BLOOD_SERVICE' && req.user.organizationProfile?.organizationType === 'BLOOD_BANK') {
      requests = await prisma.bloodRequest.findMany({
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true,
              organizationProfile: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ error: 'Failed to fetch blood requests' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await prisma.bloodRequest.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            email: true,
            organizationProfile: true
          }
        }
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    if (req.user.role === 'BLOOD_SERVICE' &&
        req.user.organizationProfile?.organizationType === 'HOSPITAL' &&
        request.hospital_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching blood request:', error);
    res.status(500).json({ error: 'Failed to fetch blood request' });
  }
});

router.post('/', authMiddleware, hospitalOnly, async (req, res) => {
  try {
    const { patient_name, blood_group, units_needed, urgency } = req.body;

    if (!patient_name || !blood_group || !units_needed) {
      return res.status(400).json({ error: 'Patient name, blood group, and units needed are required' });
    }

    const request = await prisma.bloodRequest.create({
      data: {
        hospital_id: req.user.id,
        patient_name,
        blood_group,
        units_needed,
        urgency: urgency || 'NORMAL',
        status: 'PENDING'
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ error: 'Failed to create blood request' });
  }
});

router.put('/:id/approve', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const request = await prisma.bloodRequest.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request is not pending' });
    }

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error approving blood request:', error);
    res.status(500).json({ error: 'Failed to approve blood request' });
  }
});

router.put('/:id/reject', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const request = await prisma.bloodRequest.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request is not pending' });
    }

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error rejecting blood request:', error);
    res.status(500).json({ error: 'Failed to reject blood request' });
  }
});

router.put('/:id/issue', authMiddleware, bloodBankOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const request = await prisma.bloodRequest.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    if (request.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Request must be approved before issuing' });
    }

    const inventory = await prisma.inventory.findUnique({
      where: { blood_group: request.blood_group }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Blood group not found in inventory' });
    }

    if (inventory.quantity < request.units_needed) {
      return res.status(400).json({
        error: 'Insufficient blood units in inventory',
        available: inventory.quantity,
        needed: request.units_needed
      });
    }

    const [updatedRequest, updatedInventory] = await prisma.$transaction([
      prisma.bloodRequest.update({
        where: { id },
        data: { status: 'ISSUED' },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.inventory.update({
        where: { blood_group: request.blood_group },
        data: { quantity: inventory.quantity - request.units_needed }
      })
    ]);

    res.json({
      request: updatedRequest,
      inventory: updatedInventory
    });
  } catch (error) {
    console.error('Error issuing blood request:', error);
    res.status(500).json({ error: 'Failed to issue blood request' });
  }
});

export default router;
