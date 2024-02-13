import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';

export default class UnlikePostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const statusLike: any = await this.postRepository.readOne(data.postId);

    const alreadyLike = statusLike.like.find((like: any) => like.toString() == authUserId);

    if (!alreadyLike) {
      throw new ResponseError(400, "You don't like it yet");
    }

    await this.postRepository.update3(data.postId, authUserId);

    let post: any = await this.postRepository.readOne(data.postId);

    return {
      _id: data.postId,
      likeCount: post.likeCount,
    };
  }
}
