import { ResponseError } from '../../middleware/error.middleware';
import { PostRepository } from '../../repositories/post.repository';

export default class DeletePostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(id: string) {
    const post = await this.postRepository.readOne(id);

    if (!post) {
      throw new ResponseError(400, 'Post not found');
    }

    return await this.postRepository.delete(id);
  }
}
