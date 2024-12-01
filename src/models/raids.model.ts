export interface IRaid extends Document {
  serverId: string;
  name: string;
  description?: string;
  type: 'twitter' | 'discord';
  requirements: [{
    type: 'like' | 'retweet' | 'comment' | 'space' | 'reaction';
    value: string;          // URL or reaction emoji
    points: number;
    required: boolean;
  }];
  participants: [{
    userId: string;
    completedTasks: string[];
    earnedPoints: number;
    completedAt?: Date;
  }];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
}

const raidSchema = new Schema<IRaid>({
  serverId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['twitter', 'discord'],
    required: true
  },
  requirements: [{
    type: {
      type: String,
      enum: ['like', 'retweet', 'comment', 'space', 'reaction'],
      required: true
    },
    value: String,
    points: Number,
    required: {
      type: Boolean,
      default: false
    }
  }],
  participants: [{
    userId: String,
    completedTasks: [String],
    earnedPoints: {
      type: Number,
      default: 0
    },
    completedAt: Date
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

raidSchema.index({ serverId: 1, status: 1 });
raidSchema.index({ startDate: 1, endDate: 1 });