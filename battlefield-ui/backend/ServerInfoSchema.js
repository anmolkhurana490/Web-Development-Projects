import mongoose from 'mongoose';

// Schema for player stats
const playerStatsSchema = new mongoose.Schema({
  players: {
    val1: { type: Number, required: true },
    val2: { type: Number, required: true },
    sep: { type: String, default: '/' }
  },
  ping: {
    val1: { type: Number, required: true },
    val2: { type: String, default: 'ms' },
    sep: { type: String, default: '' }
  },
  tickrate: {
    val1: { type: Number, required: true },
    val2: { type: String, default: 'Hz' },
    sep: { type: String, default: '' }
  }
});

const booleanType = new mongoose.Schema({
  value: { type: Boolean, required: true },
  type: { type: String, default: 'bool' }
});

const numberType = new mongoose.Schema({
  value: { type: Number, required: true },
  type: { type: String, default: 'number' }
});

const selectType = new mongoose.Schema({
  value: { type: String, required: true },
  type: { type: String, default: 'select' }
});

// Schema for settings
const settingsSchema = new mongoose.Schema({
  region: { type: selectType, required: true },
  punkbuster: { type: booleanType, required: true },
  fairfight: { type: booleanType, required: true },
  password: { type: booleanType, required: true },
  preset: { type: selectType, required: true }
});

// Schema for advanced settings
const advancedSettingsSchema = new mongoose.Schema({
  minimap: { type: booleanType, required: true },
  "only squad leader spawn": { type: booleanType, required: true },
  vehicles: { type: booleanType, required: true },
  "team balance": { type: booleanType, required: true },
  "minimap spotting": { type: booleanType, required: true },
  hud: { type: booleanType, required: true },
  "3p vehicle cam": { type: booleanType, required: true },
  "regenerative health": { type: booleanType, required: true },
  "kill cam": { type: booleanType, required: true },
  "friendly fire": { type: booleanType, required: true },
  "3d spotting": { type: booleanType, required: true },
  "enemy name tags": { type: booleanType, required: true }
});

// Schema for rules
const rulesSchema = new mongoose.Schema({
  tickets: { type: numberType, required: true },
  "vehicle spawn delay": { type: numberType, required: true },
  "bullet damage": { type: numberType, required: true },
  "kick after team kills": { type: numberType, required: true },
  "player health": { type: numberType, required: true },
  "player respawn time": { type: numberType, required: true },
  "kick after idle": { type: numberType, required: true },
  "ban after kicks": { type: numberType, required: true }
});

// Schema for settings data
const settingsDataSchema = new mongoose.Schema({
  settings: { type: settingsSchema, required: true },
  advanced: { type: advancedSettingsSchema, required: true },
  rules: { type: rulesSchema, required: true }
});

// Main schema
const serverInfoSchema = new mongoose.Schema({
  playerStats: { type: playerStatsSchema, required: true },
  settingsData: { type: settingsDataSchema, required: true }
});

// Create model
const ServerInfo = mongoose.model('server-info', serverInfoSchema);

export default ServerInfo;
