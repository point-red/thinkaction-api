import { NextFunction, Request, Response } from 'express';
import CreateResolutionService from '../services/posts/create-resolution.service';
import CreateWeeklyGoalsService from '../services/posts/create-weekly-goals.service';
import CreateCompleteGoalsService from '../services/posts/create-complete-goals.service';
import UpdateResolutionsService from '../services/posts/update-resolution.service';
import UpdateWeeklyGoalsService from '../services/posts/update-weekly-goals.service';
import UpdateCompleteGoalsService from '../services/posts/update-complete-goals.service';
import LikePostService from '../services/posts/like.service';
import UnlikePostService from '../services/posts/unlike.service';
import DeletePostService from '../services/posts/delete.service';
import GetAllPostService from '../services/posts/get-all.service';
import GetOnePostService from '../services/posts/get-one.service';
import GetAllLikePostService from '../services/posts/get-all-like.service';
import GetMonthlyReportService from '../services/posts/get-monthly-report.service';
import dotenv from 'dotenv';
import GetYearReportService from '../services/posts/get-year-report.service';

dotenv.config();

export default class PostController {
  private createResolutionService: CreateResolutionService;
  private createWeeklyGoalsService: CreateWeeklyGoalsService;
  private createCompleteGoalsService: CreateCompleteGoalsService;
  private updateResolutionsService: UpdateResolutionsService;
  private updateWeeklyGoalsService: UpdateWeeklyGoalsService;
  private updateCompleteGoalsService: UpdateCompleteGoalsService;
  private likePostService: LikePostService;
  private unlikePostService: UnlikePostService;
  private deletePostService: DeletePostService;
  private getAllPostService: GetAllPostService;
  private getOnePostService: GetOnePostService;
  private getAllLikePostService: GetAllLikePostService;
  private getMonthlyReportService: GetMonthlyReportService;
  private getYearReportService: GetYearReportService;

  constructor(
    getAllPostService: GetAllPostService,
    getOnePostService: GetOnePostService,
    getAllLikePostService: GetAllLikePostService,
    createResolutionService: CreateResolutionService,
    createWeeklyGoalsService: CreateWeeklyGoalsService,
    createCompleteGoalsService: CreateCompleteGoalsService,
    updateResolutionsService: UpdateResolutionsService,
    updateWeeklyGoalsService: UpdateWeeklyGoalsService,
    updateCompleteGoalsService: UpdateCompleteGoalsService,
    likePostService: LikePostService,
    unlikePostService: UnlikePostService,
    getMonthlyReportService: GetMonthlyReportService,
    getYearReportService: GetYearReportService,
    deletePostService: DeletePostService
  ) {
    this.createResolutionService = createResolutionService;
    this.createWeeklyGoalsService = createWeeklyGoalsService;
    this.createCompleteGoalsService = createCompleteGoalsService;
    this.updateResolutionsService = updateResolutionsService;
    this.updateWeeklyGoalsService = updateWeeklyGoalsService;
    this.updateCompleteGoalsService = updateCompleteGoalsService;
    this.likePostService = likePostService;
    this.unlikePostService = unlikePostService;
    this.deletePostService = deletePostService;
    this.getAllPostService = getAllPostService;
    this.getOnePostService = getOnePostService;
    this.getAllLikePostService = getAllLikePostService;
    this.getMonthlyReportService = getMonthlyReportService;
    this.getYearReportService = getYearReportService;
  }

  public async getAllPost(req: any, res: Response, next: NextFunction) {
    try {
      const result = await this.getAllPostService.handle(req.body);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async getOnePost(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.getOnePostService.handle(id);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async getAllLikePost(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authUserId = req.userData._id;

      const result = await this.getAllLikePostService.handle(id, authUserId);

      return res.status(200).json({ status: 'success', likeCount: result.length, data: result });
    } catch (e) {
      next(e);
    }
  }

  public async createResolution(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.createResolutionService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async createWeeklyGoals(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.createWeeklyGoalsService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async createCompleteGoals(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.createCompleteGoalsService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async updateResolutions(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;
      const { id } = req.params;

      const result = await this.updateResolutionsService.handle(req.body, authUserId, id);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async updateWeeklyGoals(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;
      const { id } = req.params;

      const result = await this.updateWeeklyGoalsService.handle(req.body, authUserId, id);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async updateCompleteGoals(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;
      const { id } = req.params;

      const result = await this.updateCompleteGoalsService.handle(req.body, authUserId, id);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async likePost(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.likePostService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', message: 'Post liked successfully.', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async unlikePost(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.unlikePostService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', message: 'Post unliked successfully.', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async getMonthlyReport(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.getMonthlyReportService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async getYearReport(req: any, res: Response, next: NextFunction) {
    try {
      const authUserId = req.userData._id;

      const result = await this.getYearReportService.handle(req.body, authUserId);

      return res.status(200).json({ status: 'success', data: result });
    } catch (e) {
      next(e);
    }
  }

  public async deletePost(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await this.deletePostService.handle(id);

      return res.status(200).json({});
    } catch (e) {
      next(e);
    }
  }
}
