// loadFakeData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import User from './models/userModel.js';
import Post from './models/postModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB connection error:', err));

const getRandomThumbnail = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/id/${randomId}/600/400`;
};

const getRandomAvatar = () => {
  const id = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/150?img=${id}`;
};

const categories = [
  'Travel', 'Fitness', 'Food', 'Parenting', 'Beauty',
  'Photography', 'Art', 'Writing', 'Music', 'Book'
];

const generateUsers = async (count = 15) => {
  const users = [];
  const password = await bcrypt.hash('123456', 10);

  for (let i = 0; i < count; i++) {
    users.push(new User({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password,
      avatar: getRandomAvatar(),
    }));
  }

  return User.insertMany(users);
};

const generatePosts = async (users, count = 220) => {
  const posts = [];

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);

    posts.push(new Post({
      title: faker.lorem.sentence(5),
      description: faker.lorem.paragraphs(3, '\n\n'),
      category,
      thumbnail: getRandomThumbnail(),
      creator: user._id,
    }));
  }

  return Post.insertMany(posts);
};

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🧹 Cleared old users and posts');

    const users = await generateUsers();
    console.log(`👥 Created ${users.length} users`);

    const posts = await generatePosts(users);
    console.log(`📝 Created ${posts.length} posts`);

    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();