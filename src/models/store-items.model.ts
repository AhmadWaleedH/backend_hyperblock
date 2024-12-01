export interface IStoreItem extends Document {
  serverId: string;
  type: 'role' | 'whitelist' | 'nft' | 'custom';
  name: string;
  description: string;
  price: number;
  quantity: number;
  remaining: number;
  metadata: {
    roleId?: string;
    imageUrl?: string;
    externalUrl?: string;
  };
  purchases: [{
    userId: string;
    quantity: number;
    timestamp: Date;
  }];
  status: 'active' | 'sold' | 'expired';
  expiresAt?: Date;
}

const storeItemSchema = new Schema<IStoreItem>({
  serverId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['role', 'whitelist', 'nft', 'custom'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  remaining: {
    type: Number,
    required: true
  },
  metadata: {
    roleId: String,
    imageUrl: String,
    externalUrl: String
  },
  purchases: [{
    userId: String,
    quantity: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'expired'],
    default: 'active'
  },
  expiresAt: Date
}, {
  timestamps: true
});

storeItemSchema.index({ serverId: 1, status: 1 });
storeItemSchema.index({ type: 1 });