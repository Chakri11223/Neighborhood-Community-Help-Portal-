import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { RegisterRequest, LoginRequest } from '../types';

const VALID_ROLES = ['Resident', 'Helper', 'Admin'];
const JWT_EXPIRES_IN = '7d';

export class AuthController {
  static async register(req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> {
    try {
      const { name, email, password, contact_info, location, role } = req.body;

      if (!name || !email || !password || !role) {
        res.status(400).json({ error: 'Name, email, password, and role are required' });
        return;
      }

      if (!VALID_ROLES.includes(role)) {
        res.status(400).json({ error: 'Invalid role. Must be Resident, Helper, or Admin' });
        return;
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        contact_info,
        location,
        role
      });

      const token = jwt.sign(
        { id: userId, email, role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          name,
          email,
          contact_info,
          location,
          role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  }

  static async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'User not found. Please register an account.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password || '');
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          contact_info: user.contact_info,
          location: user.location,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async switchRole(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { role } = req.body;
      if (!VALID_ROLES.includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const result = await UserModel.updateRole(req.user.id, role);
      if (!result) {
        res.status(404).json({ error: 'User not found or update failed' });
        return;
      }

      const token = jwt.sign(
        { id: req.user.id, email: req.user.email, role: role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: JWT_EXPIRES_IN }
      );

      const updatedUser = await UserModel.findById(req.user.id);

      res.status(200).json({
        message: 'Role updated successfully',
        token,
        user: updatedUser
      });

    } catch (error) {
      console.error('Switch role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
