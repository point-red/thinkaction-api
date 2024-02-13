import { NextFunction, Request, Response } from 'express';
import GetAllNotificationService from '../services/notifications/get-all.service';
import GetOneNotificationService from '../services/notifications/get-one.service';
import DeleteNotificationService from '../services/notifications/delete.service';
import dotenv from 'dotenv';

dotenv.config();

export default class NotificationController {
  private getAllNotificationService: GetAllNotificationService;
  private getOneNotificationService: GetOneNotificationService;
  private deleteNotificationService: DeleteNotificationService;

  constructor(getAllNotificationService: GetAllNotificationService, getOneNotificationService: GetOneNotificationService, deleteNotificationService: DeleteNotificationService) {
    this.getAllNotificationService = getAllNotificationService;
    this.getOneNotificationService = getOneNotificationService;
    this.deleteNotificationService = deleteNotificationService;
  }

  public async getAllNotification(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.getAllNotificationService.handle(authUserId);

      return res.status(200).json({ status: 'success', limit: 10, page: 1, data: result });
    } catch (e) {
      next(e);
    }
  }

  public async getOneNotification(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await this.getOneNotificationService.handle(id);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async deleteNotification(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await this.deleteNotificationService.handle(id);

      return res.status(200).json({});
    } catch (e) {
      next(e);
    }
  }
}
