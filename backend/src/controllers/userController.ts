import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';

export class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'Access denied. Admin role required.' });
        return;
      }

      const users = await UserModel.findAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      if (req.user?.id !== userId && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'Access denied. You can only update your own profile.' });
        return;
      }

      const { name, contact_info, location, password } = req.body;

      const updates: any = {};
      if (name) updates.name = name;
      if (contact_info !== undefined) updates.contact_info = contact_info;
      if (location !== undefined) updates.location = location;

      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No valid fields to update' });
        return;
      }

      const success = await UserModel.update(userId, updates);
      if (!success) {
        res.status(404).json({ error: 'User not found or no changes made' });
        return;
      }

      const updatedUser = await UserModel.findById(userId);
      res.status(200).json({ 
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      if (req.user?.id !== userId && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const success = await UserModel.delete(userId);
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}