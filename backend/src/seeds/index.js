require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Article  = require('../models/Article');
const Match    = require('../models/Match');
const Player   = require('../models/Player');
const Standing = require('../models/Standing');
const Video    = require('../models/Video');
const User     = require('../models/User');

const articles  = require('./seedNews');
const matches   = require('./seedMatches');
const players   = require('./seedPlayers');
const standings = require('./seedStandings');
const videos    = require('./seedVideos');

const seed = async () => {
  await connectDB();

  console.log('🗑  Clearing existing data...');
  await Promise.all([
    Article.deleteMany(),
    Match.deleteMany(),
    Player.deleteMany(),
    Standing.deleteMany(),
    Video.deleteMany(),
    User.deleteMany(),
  ]);

  console.log('👤 Seeding users...');
  await User.create([
    { name: 'Admin',    email: 'admin@burnleyfc.com', password: 'admin123', role: 'admin' },
    { name: 'Test Fan', email: 'fan@burnleyfc.com',   password: 'fan12345', role: 'subscriber' },
  ]);

  console.log('📰 Seeding articles...');
  await Article.insertMany(articles);

  console.log('⚽ Seeding matches...');
  await Match.insertMany(matches);

  console.log('👥 Seeding players...');
  await Player.insertMany(players);

  console.log('📊 Seeding standings...');
  await Standing.insertMany(standings);

  console.log('🎬 Seeding videos...');
  await Video.insertMany(videos);

  console.log('\n✅ Seed complete!');
  console.log('   Admin:      admin@burnleyfc.com / admin123');
  console.log('   Subscriber: fan@burnleyfc.com   / fan12345');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
