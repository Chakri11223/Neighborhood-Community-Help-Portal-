import { pool } from '../config/database';
import { Message } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MessageModel {
  static async create(message: Omit<Message, 'id' | 'timestamp'>): Promise<number> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO Messages (request_id, sender_id, content) VALUES (?, ?, ?)',
        [message.request_id, message.sender_id, message.content]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByRequestId(requestId: number): Promise<Message[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT m.*, u.name as sender_name 
         FROM Messages m
         JOIN Users u ON m.sender_id = u.id
         WHERE m.request_id = ?
         ORDER BY m.timestamp ASC`,
        [requestId]
      );
      
      return rows as Message[];
    } catch (error) {
      throw error;
    }
  }
}
