import { ObjectId } from 'mongodb';
import { ResponseError } from '../../middleware/error.middleware';
import { CommentRepository } from '../../repositories/comment.repository';

export default class DeleteCommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  public async handle(id: string, authUserId: string) {
    const comment = await this.commentRepository.readOne(id);

    if (!comment) {
      throw new ResponseError(404, 'Comment is not found');
    }

    if (comment.userId.toString() !== authUserId) {
      throw new ResponseError(400, 'Cannot delete comment, This is not your comment.');
    }

    if (comment.type === 'reply') {
      const pipeline = [
        {
          $match: {
            reply: {
              $elemMatch: {
                $eq: new ObjectId(id),
              },
            },
          },
        },
      ];

      let parentId: any = await this.commentRepository.aggregate(pipeline);

      parentId = parentId[0]._id.toString();

      await this.commentRepository.update3(parentId, id);
    } else if (comment.type === 'comment') {
      comment.reply.forEach(async (data: any) => {
        await this.commentRepository.delete(data.toString());
      });
    }

    return await this.commentRepository.delete(id);
  }
}
