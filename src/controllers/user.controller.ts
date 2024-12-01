import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Activity } from '../models/activities.model';
import { AppError } from '../middleware/error';

export class UserController {
  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const { discordId } = req.user!;

      const user = await User.findOne({ discordId }).select('-__v');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to get profile'
        });
      }
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const { discordId } = req.user!;
      const { mintWallets, email } = req.body;

      const user = await User.findOneAndUpdate(
        { discordId },
        { 
          $set: {
            mintWallets,
            email,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }

  // Get user points across all servers
  static async getPoints(req: Request, res: Response) {
    try {
      const { discordId } = req.user!;

      const user = await User.findOne({ discordId })
        .select('hyperBlockPoints serverMemberships');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: {
          hyperBlockPoints: user.hyperBlockPoints,
          serverPoints: user.serverMemberships.map(membership => ({
            serverId: membership.serverId,
            points: membership.points
          }))
        }
      });
    } catch (error) {
      console.error('Get points error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get points'
      });
    }
  }

  // Get user activities
  // Get user activities
    static async getActivities(req: Request, res: Response) {
      try {
        const { discordId } = req.user!;
        const { page = 1, limit = 10, type } = req.query;
  
        const query: any = { discordId };
        if (type) {
          query.type = type;
        }
  
        const activities = await Activity.find(query)
          .sort({ timestamp: -1 })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit));
  
        const total = await Activity.countDocuments(query);
  
        res.json({
          success: true,
          data: {
            activities,
            metadata: {
              page: Number(page),
              limit: Number(limit),
              total
            }
          }
        });
      } catch (error) {
        console.error('Get activities error:', error);
        res.status(error instanceof AppError ? error.statusCode : 500).json({
          success: false,
          error: error instanceof AppError ? error.message : 'Failed to get activities'
        });
      }
    }

  // Get user's server memberships
  static async getServers(req: Request, res: Response) {
    try {
      const { discordId } = req.user!;

      const user = await User.findOne({ discordId })
        .select('serverMemberships');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: user.serverMemberships
      });
    } catch (error) {
      console.error('Get servers error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get servers'
      });
    }
  }
  
  // Get user's active raids
    static async getActiveRaids(req: Request, res: Response) {
      try {
        const { discordId } = req.user!;
  
        const activeRaids = await Activity.find({
          discordId,
          type: 'raid',
          'metadata.status': 'active'
        }).sort({ timestamp: -1 });
  
        res.json({
          success: true,
          data: {
            raids: activeRaids
          }
        });
      } catch (error) {
        console.error('Get active raids error:', error);
        res.status(error instanceof AppError ? error.statusCode : 500).json({
          success: false,
          error: error instanceof AppError ? error.message : 'Failed to get active raids'
        });
      }
    }
}