import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsModule } from './blogs/blogs.module';
import { Blog, BlogSchema } from './blogs/domain/entities/blog.entity';
import { PostsModule } from './posts/posts.module';
import { Post, PostSchema } from './posts/domain/entities/post.entity';
import configuration from './config/configuration';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/domain/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BlogExistsValidator } from './validators/blog-exists-validator';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exeption.filter';
import {
  LikePost,
  LikePostSchema,
} from './posts/domain/entities/like-post.entity';
import {
  LikeComment,
  LikeCommentSchema,
} from './comments/domain/entities/like-comment.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.MONGOOSE_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get<string>('smtp.service'),
          host: config.get<string>('smtp.host'),
          secure: false,
          port: config.get<number>('smtp.port'),
          auth: {
            user: config.get<string>('smtp.user'),
            pass: config.get<string>('smtp.password'),
          },
        },
        defaults: {
          from: `"Bloggers" <noreply.notifycations@gmail.com>`,
        },
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: LikePost.name,
        schema: LikePostSchema,
      },
      {
        name: LikeComment.name,
        schema: LikeCommentSchema,
      },
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL, 10),
        limit: parseInt(process.env.THROTTLE_LIMIT, 10),
      },
    ]),
    AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    TestingModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    BlogExistsValidator,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: 'IBlogsRepository', useClass: BlogsRepository },
  ],
})
export class AppModule {}
