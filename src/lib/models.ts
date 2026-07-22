// src/lib/models.ts
import mongoose from 'mongoose';

// 1. Skema Chat Sessions
const chatSessionSchema = new mongoose.Schema({
  phone_number: { type: String, default: null },
  telegram_chat_id: { type: String, required: true, unique: true },
  role: { type: String, default: 'owner' },
  active_store_id: { type: String, default: null },
  platform: { type: String, default: 'telegram' },
  context_memory: { type: Array, default: [] },
  session_status: { type: String, default: 'active' }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

// 2. Skema Messages
const messageSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' },
  sender_type: { type: String, enum: ['user', 'bot', 'owner'], required: true },
  message_type: { type: String, enum: ['text', 'audio','voice', 'image'], required: true },
  raw_content: { type: String, default: null },
  transcribed_text: { type: String, default: null },
  intent_detected: { type: String, default: null },
  postgres_reference_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

// 3. Skema AI Logs
const aiLogSchema = new mongoose.Schema({
  store_id: { type: String, required: true },
  feature_type: { type: String, required: true },
  provider: { type: String, required: true },
  prompt_payload: { type: String, required: true },
  response_payload: { type: String, required: true },
  metrics: {
    prompt_tokens: Number,
    completion_tokens: Number,
    total_tokens: Number,
    latency_ms: Number
  },
  status: { type: String, default: 'success' },
  created_at: { type: Date, default: Date.now }
});

const storeSettingSchema = new mongoose.Schema({
  store_id: { type: String, required: true, unique: true },
  is_global_active: { type: Boolean, default: true },
  custom_rules: { type: String, default: '' },
}, { timestamps: true });


// 4. Ekspor dengan ES Modules dan pengaman Hot-Reload Next.js
export const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const AiLog = mongoose.models.AiLog || mongoose.model('AiLog', aiLogSchema);
export const StoreSetting = mongoose.models.StoreSetting || mongoose.model('StoreSetting', storeSettingSchema);