import { pool } from '../config/database';
import { HelpRequest } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class HelpRequestModel {
  static async create(request: Omit<HelpRequest, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO HelpRequests (resident_id, title, description, category, attachments) VALUES (?, ?, ?, ?, ?)',
        [request.resident_id, request.title, request.description, request.category, request.attachments]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: number): Promise<HelpRequest | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT hr.*, 
                u1.name as resident_name, 
                u2.name as helper_name 
         FROM HelpRequests hr
         LEFT JOIN Users u1 ON hr.resident_id = u1.id
         LEFT JOIN Users u2 ON hr.helper_id = u2.id
         WHERE hr.id = ?`,
        [id]
      );
      
      if (rows.length === 0) return null;
      return rows[0] as HelpRequest;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters?: { status?: string; category?: string; helper_id?: number }): Promise<HelpRequest[]> {
    try {
      let query = `
        SELECT hr.*, 
               u1.name as resident_name, 
               u2.name as helper_name 
        FROM HelpRequests hr
        LEFT JOIN Users u1 ON hr.resident_id = u1.id
        LEFT JOIN Users u2 ON hr.helper_id = u2.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (filters?.status) {
        query += ' AND hr.status = ?';
        params.push(filters.status);
      }

      if (filters?.category) {
        query += ' AND hr.category = ?';
        params.push(filters.category);
      }

      if (filters?.helper_id) {
        query += ' AND hr.helper_id = ?';
        params.push(filters.helper_id);
      }

      query += ' ORDER BY hr.created_at DESC';

      const [rows] = await pool.query<RowDataPacket[]>(query, params);
      return rows as HelpRequest[];
    } catch (error) {
      throw error;
    }
  }

  static async findByResidentId(residentId: number): Promise<HelpRequest[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT hr.*, 
                u1.name as resident_name, 
                u2.name as helper_name 
         FROM HelpRequests hr
         LEFT JOIN Users u1 ON hr.resident_id = u1.id
         LEFT JOIN Users u2 ON hr.helper_id = u2.id
         WHERE hr.resident_id = ?
         ORDER BY hr.created_at DESC`,
        [residentId]
      );
      
      return rows as HelpRequest[];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id: number, status: string, helperId?: number): Promise<boolean> {
    try {
      const allowedTransitions: { [key: string]: string[] } = {
        'Pending': ['Accepted'],
        'Accepted': ['In-progress'],
        'In-progress': ['Completed']
      };

      const [currentRows] = await pool.query<RowDataPacket[]>(
        'SELECT status FROM HelpRequests WHERE id = ?',
        [id]
      );

      if (currentRows.length === 0) {
        throw new Error('Request not found');
      }

      const currentStatus = currentRows[0].status;

      if (currentStatus === 'Completed') {
        throw new Error('Cannot update a completed request');
      }

      if (!allowedTransitions[currentStatus]?.includes(status)) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
      }

      let query = 'UPDATE HelpRequests SET status = ?';
      const params: any[] = [status];

      if (status === 'Accepted' && helperId) {
        query += ', helper_id = ?';
        params.push(helperId);
      }

      query += ' WHERE id = ?';
      params.push(id);

      const [result] = await pool.query<ResultSetHeader>(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, updates: Partial<HelpRequest>): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.category) {
        fields.push('category = ?');
        values.push(updates.category);
      }
      if (updates.attachments !== undefined) {
        fields.push('attachments = ?');
        values.push(updates.attachments);
      }

      if (fields.length === 0) return false;

      values.push(id);
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE HelpRequests SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'DELETE FROM HelpRequests WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}