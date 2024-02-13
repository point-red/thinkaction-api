import { CommentRepository } from '../src/repositories/comment.repository';
import { PostRepository } from '../src/repositories/post.repository';

export async function deleteAllComments() {
  const commentRepository = new CommentRepository();
  await commentRepository.deleteMany();
}

export async function deleteAllPosts() {
  const postRepository = new PostRepository();
  await postRepository.deleteMany();
}
