import { CommentEntity } from '../../entities/comments.entity';
import { CommentRepository } from '../../repositories/comment.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class UpdateCommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  public async handle(data: DocInterface, id: string, authUserId: string) {
    const comment = await this.commentRepository.readOne(id);

    if (!comment) {
      throw new ResponseError(400, 'Comment not found');
    }

    if (comment.userId.toString() !== authUserId) {
      throw new ResponseError(400, 'Cannot update comment, This is not your comment.');
    }

    const commentEntity = new CommentEntity({
      _id: comment._id,
      userId: comment.userId,
      postId: comment.postId,
      message: data.message,
      reply: comment.reply,
      replyCount: comment.replyCount,
      type: comment.type,
      createdDate: comment.createdDate,
      updatedDate: new Date(),
      isUpdating: true,
    });

    let commentData = commentEntity.CheckData();

    await this.commentRepository.update2(id, commentData);

    const dataComment: any = await this.commentRepository.readOne(id);

    const userRepository = new UserRepository();
    const userData: any = await userRepository.readOne(comment.userId);

    return {
      _id: dataComment._id,
      postId: dataComment.postId,
      userId: dataComment.userId,
      userInfo: {
        _id: id,
        username: userData.username,
        photo: userData.photo,
      },
      message: dataComment.message,
      type: dataComment.type,
      replyCount: dataComment.replyCount,
      createdDate: dataComment.createdDate.toISOString(),
      updatedDate: dataComment.updatedDate.toISOString(),
    };
  }
}
