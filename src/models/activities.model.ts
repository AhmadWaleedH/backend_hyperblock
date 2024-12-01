import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  discordId: string;
  serverId?: string;
  type: 'raid' | 'mission' | 'chat' | 'reaction' | 'game';
  action: string;
  pointsEarned: number;
  metadata: {
    channelId?: string;
    messageId?: string;
    raidId?: string;
    missionId?: string;
    gameId?: string;
  };
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  discordId: {
    type: String,
    required: true,
    index: true
  },
  serverId: {
    type: String,
    index: true
  },
  type: {
    type: String,
    enum: ['raid', 'mission', 'chat', 'reaction', 'game'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  metadata: {
    channelId: String,
    messageId: String,
    raidId: String,
    missionId: String,
    gameId: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);