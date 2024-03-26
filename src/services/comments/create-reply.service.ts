import { CommentEntity } from '../../entities/comments.entity';
import { CommentRepository } from '../../repositories/comment.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import { PostRepository } from '../../repositories/post.repository';

export default class CreateReplyCommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor(commentRepository: CommentRepository, postRepository: PostRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, id: string) {
    const commentEntity = new CommentEntity({
      _id: new ObjectId(),
      userId: new ObjectId(id),
      postId: new ObjectId(data.postId),
      message: data.message,
      reply: [],
      replyCount: 0,
      type: 'reply',
      createdDate: new Date(),
      isUpdating: data.isUpdating || false,
    });

    await this.postRepository.addCommentCount(data.postId);

    let commentData: any = commentEntity.CheckData();

    let comment = await this.commentRepository.update(data.replyTo, commentData._id);

    await this.commentRepository.create(commentData);

    const dataComment = await this.commentRepository.readOne(data.replyTo);

    if (!dataComment) {
      throw new ResponseError(404, 'Comment not found');
    }

    let dataReply = dataComment.reply.find((reply: any) => reply.toString() === commentData._id.toString());

    dataReply = await this.commentRepository.readOne(dataReply);

    const userRepository = new UserRepository();
    const userDataReply = await userRepository.readOne(id);
    const userDataParentComment = await userRepository.readOne(dataComment.userId);

    if (!userDataReply) {
      throw new ResponseError(404, 'User reply not found');
    }

    if (!userDataParentComment) {
      throw new ResponseError(404, 'User parent comment not found');
    }

    return {
      comment: {
        _id: dataReply._id,
        postId: dataReply.postId,
        userId: dataReply.userId,
        userInfo: {
          _id: dataReply.userId,
          username: userDataReply.username,
          photo: userDataReply.photo,
        },
        message: dataReply.message,
        type: dataReply.type,
        replyCount: dataReply.replyCount,
        createdDate: dataReply.createdDate,
        updatedDate: dataReply.updatedDate,
      },
      parentComment: {
        _id: dataComment._id,
        postId: dataComment.postId,
        userId: dataComment.userId,
        userInfo: {
          _id: dataComment.userId,
          username: userDataParentComment.username,
          photo: userDataParentComment.photo,
        },
        message: dataComment.message,
        type: dataComment.type,
        replyCount: dataComment.replyCount,
        createdDate: dataComment.createdDate,
        updatedDate: dataComment.updatedDate,
      },
    };
  }
}
