export interface IServer extends Document {
  discordId: string;          // Discord server ID
  name: string;               // Server name
  iconUrl?: string;          // Server icon
  ownerDiscordId: string;    // Server owner's Discord ID
  
  botConfig: {
    enabled: boolean;
    prefix: string;
    channels: {
      hypeLogs: string;      // Channel IDs
      missionsHall: string;
      stadium: string;
      hyperMarket: string;
      myBag: string;
      hyperNotes: string;
    };
  };
  
  pointsSystem: {
    name: string;            // Custom points name
    exchangeRate: number;    // Rate for HyperBlock points
    actions: {
      like: number;
      retweet: number;
      comment: number;
      space: number;
      reaction: number;
      messageInterval: number;  // Minutes between message points
      messagePoints: number;
    };
    channelMultipliers: [{
      channelId: string;
      multiplier: number;
    }];
  };
  
  subscription: {
    tier: 'Free' | 'Gold' | 'Diamond' | 'Platinum';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  
  analytics: {
    rating: 'S' | 'A' | 'B' | 'C' | 'D';
    rank: number;
    isTop10: boolean;
    metrics: {
      activeUsers: number;
      messageCount: number;
      taskCompletion: number;
      pointsUsage: number;
      chatHealth: number;
    };
  };

  createdAt: Date;
  updatedAt: Date;
}

const serverSchema = new Schema<IServer>({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  iconUrl: String,
  ownerDiscordId: {
    type: String,
    required: true
  },
  
  botConfig: {
    enabled: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: '/'
    },
    channels: {
      hypeLogs: String,
      missionsHall: String,
      stadium: String,
      hyperMarket: String,
      myBag: String,
      hyperNotes: String
    }
  },
  
  pointsSystem: {
    name: {
      type: String,
      default: 'Points'
    },
    exchangeRate: {
      type: Number,
      default: 1
    },
    actions: {
      like: Number,
      retweet: Number,
      comment: Number,
      space: Number,
      reaction: Number,
      messageInterval: {
        type: Number,
        default: 5
      },
      messagePoints: {
        type: Number,
        default: 1
      }
    },
    channelMultipliers: [{
      channelId: String,
      multiplier: Number
    }]
  },
  
  subscription: {
    tier: {
      type: String,
      enum: ['Free', 'Gold', 'Diamond', 'Platinum'],
      default: 'Free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  analytics: {
    rating: {
      type: String,
      enum: ['S', 'A', 'B', 'C', 'D']
    },
    rank: Number,
    isTop10: {
      type: Boolean,
      default: false
    },
    metrics: {
      activeUsers: {
        type: Number,
        default: 0
      },
      messageCount: {
        type: Number,
        default: 0
      },
      taskCompletion: {
        type: Number,
        default: 0
      },
      pointsUsage: {
        type: Number,
        default: 0
      },
      chatHealth: {
        type: Number,
        default: 0
      }
    }
  }
}, {
  timestamps: true
});