import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/messages.schema';
import { User } from 'src/schemas/user.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  private time = new Date();

  async create(createMessageDto: CreateMessageDto) {
    // get current miliseconds time and set to create_at
    const message = new this.messageModel(createMessageDto);

    return message.save();
  }

  async findAll() {
    const messages = await this.messageModel
      .find()
      .lean()
      .populate('ownerId', ['_uid', 'name', 'avatar'])
      .populate('replyMessageId', ['_id', 'content'])
      .exec();

    return messages;
  }

  async findOneByObjID(id: string) {
    const message = await (
      await (
        await this.messageModel.findOne({ _id: id })
      ).populate('ownerId', ['_uid', 'name', 'avatar'])
    ).populate('replyMessageId', ['_id', 'content']);

    // If content is null, return null
    if (!message) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Lỗi tin nhắn',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return message;
  }

  async update(
    mesId: string,
    ownerId: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messageModel.findOneAndUpdate(
      { _id: mesId, ownerId: ownerId },
      updateMessageDto,
    );
    if (!message) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Lỗi tin nhắn',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return message;
  }

  async remove(mesId: string, _ownerId: string) {
    const message = await this.messageModel
      .deleteOne({ _id: mesId, ownerId: _ownerId })
      .exec();

    if (!message) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Lỗi tin nhắn',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return message;
  }
}
