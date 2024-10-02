import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetOneUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const isAuthenticatedUser = authUserId == id;
    const project: Record<string, number> = {
      _id: 1,
      fullname: 1,
      username: 1,
      email: 1,
      bio: 1,
      photo: 1,
      categoryResolution: 1,
      isPublic: 1,
      supporterCount: 1,
      supportingCount: 1,
      goalsPerformance: 1,
      isAuthenticatedUser: 1,
      isSupporting: 1,
      isRequesting: 1,
    }

    if (isAuthenticatedUser) {
      project.notificationCount = 1;
      project.requestCount = 1;
      project.password = 1;
    }

    const pipeline: any[] = [
      { $match: { _id: new ObjectId(id) } },
      {
        $addFields: {
          isAuthenticatedUser,
          ...(isAuthenticatedUser
            ? {}
            : {
              isSupporting: {
                $in: [new ObjectId(authUserId), '$supporter'],
              },
              isRequesting: {
                $in: [new ObjectId(authUserId), '$request'],
              }
            }),
        },
      },
    ];

    if (isAuthenticatedUser) {
      const lookup = {
        from: "posts",
        localField: "categoryResolution._id",
        foreignField: "categoryResolutionId",
        as: "posts"
      }
      const addFields = {
        categoryResolution: {
          $map: {
            input: "$categoryResolution",
            as: "category",
            in: {
              $mergeObjects: [
                "$$category",
                {
                  postCount: {
                    $size: {
                      $filter: {
                        input: "$posts",
                        as: "post",
                        cond: {
                          $and: [
                            {
                              $eq: ["$$post.categoryResolutionId", "$$category._id"]
                            },
                            {
                              $eq: ["$$post.type", "weeklyGoals"]
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
      pipeline.push({ $lookup: lookup }, { $addFields: addFields })
    }

    pipeline.push(
      {
        $project: project,
      }
    );

    const result = await this.userRepository.aggregate(pipeline);
    if (isAuthenticatedUser) {
      result[0].needsPassword = !result[0].password.length;
      delete result[0].password;
    }

    return result[0];
  }
}
