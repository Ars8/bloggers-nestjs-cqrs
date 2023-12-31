import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from 'src/blogs/domain/entities/blog.entity';
import { User, UserDocument } from 'src/users/domain/entities/user.entity';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/posts/domain/entities/post.entity';
import { Comment, CommentDocument } from 'src/comments/domain/entities/comment.entity';
import {
  LikePost,
  LikePostDocument,
} from 'src/posts/domain/entities/like-post.entity';
import {
  LikeComment,
  LikeCommentDocument,
} from 'src/comments/domain/entities/like-comment.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(Post.name) private postsModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentsModel: Model<CommentDocument>,
    @InjectModel(LikePost.name) private likePostModel: Model<LikePostDocument>,
    @InjectModel(LikeComment.name)
    private likeCommentModel: Model<LikeCommentDocument>,
  ) {}

  async removeAll() {
    await this.blogsModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.likePostModel.deleteMany({});
    await this.likeCommentModel.deleteMany({});
  }
}
