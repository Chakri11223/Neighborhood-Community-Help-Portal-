import { Request, Response } from 'express';
import { HelpRequestModel } from '../models/HelpRequest';
import { CreateHelpRequest, UpdateRequestStatus } from '../types';

export class RequestController {
  static async createRequest(req: Request<{}, {}, CreateHelpRequest>, res: Response): Promise<void> {
    try {
      if (req.user?.role !== 'Resident') {
        res.status(403).json({ error: 'Only residents can create help requests' });
        return;
      }

      const { title, description, category, attachments } = req.body;

      if (!title || !description || !category) {
        res.status(400).json({ error: 'Title, description, and category are required' });
        return;
      }

      const requestId = await HelpRequestModel.create({
        resident_id: req.user!.id,
        title,
        description,
        category,
        attachments
      });

      const newRequest = await HelpRequestModel.findById(requestId);
      res.status(201).json({
        message: 'Help request created successfully',
        request: newRequest
      });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllRequests(req: Request, res: Response): Promise<void> {
    try {
      const { status, category, helper_id } = req.query;

      const filters: any = {};
      if (status) filters.status = status as string;
      if (category) filters.category = category as string;
      if (helper_id) filters.helper_id = parseInt(helper_id as string);

      const requests = await HelpRequestModel.findAll(filters);
      res.status(200).json({ requests });
    } catch (error) {
      console.error('Get all requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRequestById(req: Request, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      const request = await HelpRequestModel.findById(requestId);
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      res.status(200).json({ request });
    } catch (error) {
      console.error('Get request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMyRequests(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      let requests;
      if (req.user.role === 'Resident') {
        requests = await HelpRequestModel.findByResidentId(req.user.id);
      } else if (req.user.role === 'Helper') {
        requests = await HelpRequestModel.findAll({ helper_id: req.user.id });
      } else {
        requests = await HelpRequestModel.findAll();
      }

      res.status(200).json({ requests });
    } catch (error) {
      console.error('Get my requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateRequestStatus(req: Request<{ id: string }, {}, UpdateRequestStatus>, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);
      const { status, helper_id } = req.body;

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const request = await HelpRequestModel.findById(requestId);
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      if (status === 'Accepted') {
        if (req.user?.role !== 'Helper') {
          res.status(403).json({ error: 'Only helpers can accept requests' });
          return;
        }
        
        if (request.status !== 'Pending') {
          res.status(400).json({ error: 'Can only accept pending requests' });
          return;
        }
      } else if (status === 'In-progress' || status === 'Completed') {
        if (req.user?.role !== 'Helper' || request.helper_id !== req.user?.id) {
          res.status(403).json({ error: 'Only the assigned helper can update this request' });
          return;
        }
      }

      const useHelperId = status === 'Accepted' ? req.user!.id : helper_id;
      const success = await HelpRequestModel.updateStatus(requestId, status, useHelperId);

      if (!success) {
        res.status(400).json({ error: 'Failed to update request status' });
        return;
      }

      const updatedRequest = await HelpRequestModel.findById(requestId);
      res.status(200).json({
        message: 'Request status updated successfully',
        request: updatedRequest
      });
    } catch (error: any) {
      console.error('Update request status error:', error);
      if (error.message) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async updateRequest(req: Request, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      const request = await HelpRequestModel.findById(requestId);
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      if (req.user?.id !== request.resident_id && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'You can only update your own requests' });
        return;
      }

      const { title, description, category, attachments } = req.body;

      const updates: any = {};
      if (title) updates.title = title;
      if (description) updates.description = description;
      if (category) updates.category = category;
      if (attachments !== undefined) updates.attachments = attachments;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No valid fields to update' });
        return;
      }

      const success = await HelpRequestModel.update(requestId, updates);
      if (!success) {
        res.status(400).json({ error: 'Failed to update request' });
        return;
      }

      const updatedRequest = await HelpRequestModel.findById(requestId);
      res.status(200).json({
        message: 'Request updated successfully',
        request: updatedRequest
      });
    } catch (error) {
      console.error('Update request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteRequest(req: Request, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);

      if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
      }

      const request = await HelpRequestModel.findById(requestId);
      if (!request) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      if (req.user?.id !== request.resident_id && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'You can only delete your own requests' });
        return;
      }

      const success = await HelpRequestModel.delete(requestId);
      if (!success) {
        res.status(400).json({ error: 'Failed to delete request' });
        return;
      }

      res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Delete request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}