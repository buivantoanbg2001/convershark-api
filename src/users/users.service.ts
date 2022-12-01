import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUserInfo, User, UserDocument } from 'src/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { gen_user_id } from 'src/utils/func.backup';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findAll(name?: string): Promise<User[]> {
    const users = await this.userModel
      .find()
      .lean()
      .populate('friends', ['_uid', 'name', 'avatar'])
      .exec();

    if (name) {
      return users.filter((user) => user.name === name);
    }
    return users;
  }

  async findUserByObjID(id: string): Promise<ShortUserInfo> {
    const user = await this.userModel.findOne({ _id: id }).lean().exec();
    return {
      _id: user._id,
      _uid: user._uid,
      name: user.name,
      avatar: user.avatar,
      status: user.status,
      bio: user.bio,
      wallpaper: user.wallpaper,
    };
  }

  async findUserByNameID(uid: string): Promise<User> {
    const user = await this.userModel.findOne({ uid: uid }).lean().exec();
    return user;
  }

  async getFullUserInfoById(_id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id })
      .lean()
      .populate('friends', ['_id', '_uid', 'avatar', 'wallpaper', 'bio'])
      .populate('servers')
      .exec();

    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ _id }).lean().exec();

    // if name changed, must change _uid
    if (updateUserDto.name) {
      // create new uid
      let uid = gen_user_id(updateUserDto.name);
      // if duplication, create new uid
      while (await this.userModel.findOne({ _uid: uid })) {
        uid = gen_user_id(updateUserDto.name);
      }
      updateUserDto._uid = uid;
    }

    // add new friend
    if (updateUserDto.friends) {
      updateUserDto.friends = updateUserDto.friends.concat(
        (await user).friends,
      );
    }

    // add new server
    if (updateUserDto.servers) {
      updateUserDto.servers = updateUserDto.servers.concat(
        (await user).servers,
      );
    }

    return this.userModel.updateOne({ _id }, updateUserDto);
  }

  async updateFriendListById(_id: string, friend: string) {
    const user = await this.userModel.findOne({ _id }).lean().exec();
    let newFriends = [friend].concat(user.friends);
    const tmp = [];
    newFriends = newFriends.reduce((friendListNotDuplicate, element) => {
      if (!tmp.includes(element.toString())) {
        friendListNotDuplicate.push(element);
        tmp.push(element.toString());
      }
      return friendListNotDuplicate;
    }, []);

    return this.userModel.updateOne({ _id }, { friends: newFriends });
  }
}
