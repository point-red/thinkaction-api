import { ObjectId } from 'mongodb';
import { ResponseError } from '../../middleware/error.middleware';
import { CommentRepository } from '../../repositories/comment.repository';
import { PostRepository } from '../../repositories/post.repository';

export default class DeleteCommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor(commentRepository: CommentRepository, postRepository: PostRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
  }

  public async handle(id: string, authUserId: string) {
    const comment = await this.commentRepository.readOne(id);

    if (!comment) {
      throw new ResponseError(404, 'Comment not found');
    }

    if (comment.postId) {
      const post = await this.postRepository.readOne(comment.postId);
      if (!post) {
        throw new ResponseError(404, 'Post not found');
      }
      if (post.userId.toString() !== authUserId) {
        if (comment.userId.toString() !== authUserId) {
          throw new ResponseError(400, 'Cannot delete comment, This is not your comment.');
        }
      }
    } else {
      throw new ResponseError(404, 'Post not found');
    }

    const length = comment.type === 'reply' ? 1 : 1 + (comment.reply?.length ?? 0);
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

      if (parentId.length) {
        parentId = parentId[0]._id.toString();
        await this.commentRepository.update3(parentId, id);
      }

    } else if (comment.type === 'comment') {
      comment.reply.forEach(async (data: any) => {
        await this.commentRepository.delete(data.toString());
      });
    }

    await this.postRepository.deleteCommentCount(comment.postId, length);

    return await this.commentRepository.delete(id);
  }
}
