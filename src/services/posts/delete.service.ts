import { ResponseError } from '../../middleware/error.middleware';
import { PostRepository } from '../../repositories/post.repository';
import { UserRepository } from '../../repositories/user.repository';

export default class DeletePostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(id: string, authUserId: string) {
    const post = await this.postRepository.readOne(id);

    if (!post || post?.userId?.toString() !== authUserId) {
      throw new ResponseError(400, 'Post not found');
    }
    if (post.type === 'resolutions') {
      const userRepository = new UserRepository();
      await userRepository.removeCategory(post.categoryResolutionId, authUserId);
    }

    return await this.postRepository.delete(id);
  }
}
