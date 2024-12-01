import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  discordId: string;           // Primary identifier
  username: string;            // Discord username
  discriminator: string;       // Discord discriminator
  email?: string;             // Optional email
  avatarUrl?: string;         // Discord avatar
  walletAddress?: string;     // Ethereum wallet
  
  hyperBlockPoints: number;    // Platform-wide points
  status: 'active' | 'inactive' | 'banned';
  
  socialAccounts?: {
    twitter?: {
      id: string;
      username: string;
      profileUrl: string;
    };
  };
  
  mintWallets?: {
    ethereum?: string;
    solana?: string;
  };
  
  serverMemberships: [{
    serverId: string;         // Discord server ID
    joinedAt: Date;
    points: number;           // Server-specific points
    level: number;
    activeRaids: number;
    completedTasks: number;
  }];

  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}

const userSchema = new Schema<IUser>({
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  discriminator: String,
  email: {
    type: String,
    sparse: true,
    lowercase: true
  },
  avatarUrl: String,
  walletAddress: {
    type: String,
    sparse: true,
    lowercase: true
  },
  
  hyperBlockPoints: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  
  socialAccounts: {
    twitter: {
      id: String,
      username: String,
      profileUrl: String
    }
  },
  
  mintWallets: {
    ethereum: String,
    solana: String
  },
  
  serverMemberships: [{
    serverId: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    activeRaids: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    }
  }],
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ 'serverMemberships.serverId': 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'socialAccounts.twitter.id': 1 });
export const User = mongoose.model<IUser>('User', userSchema);