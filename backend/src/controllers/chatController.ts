import { Request, Response } from 'express';
import { MessageModel } from '../models/Message';
import { Message } from '../types';

export class ChatController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.requestId);
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ error: 'Message content is required' });
        return;
      }

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      const messageId = await MessageModel.create({
        request_id: requestId,
        sender_id: req.user!.id,
        content
      });

      res.status(201).json({
        message: 'Message sent successfully',
        messageId
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.requestId);

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      const messages = await MessageModel.findByRequestId(requestId);
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
