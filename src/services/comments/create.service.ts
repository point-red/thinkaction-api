import { CommentEntity } from '../../entities/comments.entity';
import { CommentRepository } from '../../repositories/comment.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import { PostRepository } from '../../repositories/post.repository';

export default class CreateCommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor(commentRepository: CommentRepository, postRepository: PostRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, id: string) {
    const commentEntity = new CommentEntity({
      userId: new ObjectId(id),
      postId: new ObjectId(data.postId),
      message: data.message,
      reply: [],
      replyCount: 0,
      type: 'comment',
      createdDate: new Date(),
      isUpdating: data.isUpdating || false,
    });

    let commentData = commentEntity.CheckData();

    let comment = await this.commentRepository.create(commentData);

    await this.postRepository.addCommentCount(data.postId);

    const dataComment = await this.commentRepository.readOne(comment.insertedId.toString());
    if (!dataComment) {
      throw new ResponseError(404, 'Comment not found');
    }
    const userRepository = new UserRepository();
    const userData = await userRepository.readOne(id);

    if (!userData) {
      throw new ResponseError(404, 'User not found');
    }

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
      updatedDate: dataComment.updatedDate ? dataComment.updatedDate.toISOString() : null,
    };
  }
}
