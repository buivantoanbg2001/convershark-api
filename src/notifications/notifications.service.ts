import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notifications.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // return 'This action adds a new notification';
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAllForReceiver(userId: string) {
    // console.log(userId);
    const notifications = await this.notificationModel
      .find({
        receiver: userId,
      })
      .lean()
      .populate('sender', ['_uid', 'name', 'avatar'])
      .populate('serverId', ['name', 'hostId'])
      .populate('chatId', ['name'])
      .populate('callId', ['name'])
      .exec();
    if (!notifications || !notifications[0]) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Danh sách thông báo trống',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return notifications;
  }

  async findOne(_notiId: string, requestId: string) {
    // console.log(_notiId, requestId);
    const notification = await this.notificationModel
      .findOne({ _id: _notiId, receiver: requestId })
      .lean()
      .populate('sender', ['_uid', 'name', 'avatar'])
      .exec();
    if (!notification) {
      throw new HttpException('Thông báo không tồn tại', 404);
    }
    return notification;
  }

  async remove(_notiId: string, requestId: string) {
    // console.log(requestId);
    const notification = await this.notificationModel
      .deleteOne({ _id: _notiId, receiver: requestId })
      .exec();
    if (notification.deletedCount === 0) {
      throw new HttpException('Thông báo không tồn tại', 404);
    }
    return notification;
  }
}
