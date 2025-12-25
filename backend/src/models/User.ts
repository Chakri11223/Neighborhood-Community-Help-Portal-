import { pool } from '../config/database';
import { User } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) return null;
      return rows[0] as User;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, email, contact_info, location, role, created_at FROM Users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) return null;
      return rows[0] as User;
    } catch (error) {
      throw error;
    }
  }

  static async create(user: Omit<User, 'id' | 'created_at'>): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO Users (name, email, password, contact_info, location, role) VALUES (?, ?, ?, ?, ?, ?)',
        [user.name, user.email, user.password, user.contact_info, user.location, user.role]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateRole(id: number, newRole: string): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'UPDATE Users SET role = ? WHERE id = ?',
        [newRole, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, user: Partial<User>): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (user.name) {
        fields.push('name = ?');
        values.push(user.name);
      }
      if (user.contact_info !== undefined) {
        fields.push('contact_info = ?');
        values.push(user.contact_info);
      }
      if (user.location !== undefined) {
        fields.push('location = ?');
        values.push(user.location);
      }
      if (user.password) {
        fields.push('password = ?');
        values.push(user.password);
      }

      if (fields.length === 0) return false;

      values.push(id);
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(): Promise<User[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, email, contact_info, location, role, created_at FROM Users'
      );

      return rows as User[];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM Users WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}