import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatChannel,
  ChatChannelDocument,
} from 'src/schemas/chat_channels.schema';
import { ServersService } from 'src/servers/servers.service';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';

@Injectable()
export class ChatChannelsService {
  constructor(
    @InjectModel(ChatChannel.name)
    private chatChannelModel: Model<ChatChannelDocument>,
    private serversService: ServersService,
  ) {}

  async create(createChatChannelDto: CreateChatChannelDto) {
    const { hostId, serverId } = createChatChannelDto;
    const server = await this.serversService.findOne(serverId, hostId);

    if (!server) {
      return null;
    }

    const chatChannel = new this.chatChannelModel(createChatChannelDto);
    chatChannel.members.push(hostId);
    await chatChannel.save();

    const newChatChannelList = [chatChannel._id].concat(server.chatChannels);
    return this.serversService.updateFromChannel(serverId, {
      chatChannels: newChatChannelList,
    });
  }

  // async findAll(): Promise<any> {
  //   const chat_channels = await this.chatChannelModel
  //     .find()
  //     .lean()
  //     .populate('members', ['_uid', 'name', 'avatar'])
  //     .populate('messages')
  //     .exec();

  //   return chat_channels;
  // }

  // async findOne(id: string) {
  //   const chat_channel = await this.chatChannelModel
  //     .findOne({ id })
  //     .lean()
  //     .populate('members', ['_uid', 'name', 'avatar'])
  //     .populate('messages')
  //     .exec();

  //   return chat_channel;
  // }

  // async update(id: string, updateChatChannelDto: UpdateChatChannelDto) {
  //   const cc = this.chatChannelModel.findOne({ _id: id }).lean().exec();

  //   // add new member to group chat
  //   if (updateChatChannelDto.members) {
  //     updateChatChannelDto.members = updateChatChannelDto.members.concat(
  //       (await cc).members,
  //     );
  //   }

  //   // add new message
  //   if (updateChatChannelDto.messages) {
  //     updateChatChannelDto.messages = updateChatChannelDto.messages.concat(
  //       (await cc).messages,
  //     );
  //   }

  //   return this.chatChannelModel
  //     .findOneAndUpdate({ _id: id }, updateChatChannelDto)
  //     .lean();
  // }

  async update(
    _id: string,
    hostId: string,
    updateChatChannelDto: UpdateChatChannelDto,
  ) {
    const channel = await this.chatChannelModel.findOne({ _id, hostId }).lean();

    if (!channel) {
      return null;
    }

    if (updateChatChannelDto.members) {
      let newFriends = updateChatChannelDto.members.concat(channel.members);
      const tmp = [];
      newFriends = newFriends.reduce((friendListNotDuplicate, element) => {
        if (!tmp.includes(element.toString())) {
          friendListNotDuplicate.push(element);
          tmp.push(element.toString());
        }
        return friendListNotDuplicate;
      }, []);

      updateChatChannelDto.members = newFriends;
    }

    return this.chatChannelModel.updateOne(
      { _id, hostId },
      updateChatChannelDto,
    );
  }

  async remove(_id: string, hostId: string) {
    const channel = await this.chatChannelModel
      .deleteOne({ _id, hostId })
      .exec();
    if (channel.deletedCount === 0) {
      throw new HttpException('Không tồn tại chat channel', 404);
    }
    return channel;
  }
}
