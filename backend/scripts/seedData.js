const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedProducts = [
  {
    name: 'Fresh Bananas',
    price: 45,
    category: 'Fruits',
    stock: 120,
    image:
      'https://images.pexels.com/photos/5945904/pexels-photo-5945904.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'Organic Tomatoes',
    price: 35,
    category: 'Vegetables',
    stock: 90,
    image:
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Brown Bread Loaf',
    price: 55,
    category: 'Bakery',
    stock: 60,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Farm Fresh Milk',
    price: 30,
    category: 'Dairy',
    stock: 110,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Basmati Rice 1kg',
    price: 120,
    category: 'Grains',
    stock: 70,
    image:
      'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  {
    name: 'Free Range Eggs (12)',
    price: 95,
    category: 'Poultry',
    stock: 80,
    image:
      'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=1200&q=80'
  }
];

async function upsertUser({ name, email, password, role }) {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email, password, role });
    return user;
  }

  user.name = name;
  user.role = role;
  user.password = password;
  await user.save();

  return user;
}

async function runSeed() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in root .env');
    }

    await mongoose.connect(mongoUri);

    const adminUser = await upsertUser({
      name: 'Demo Admin',
      email: 'admin@grocery.com',
      password: 'admin123',
      role: 'admin'
    });

    const customerUser = await upsertUser({
      name: 'Demo Customer',
      email: 'customer@grocery.com',
      password: 'customer123',
      role: 'customer'
    });

    const productDocs = [];

    for (const product of seedProducts) {
      const doc = await Product.findOneAndUpdate(
        { name: product.name },
        { $set: product },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      productDocs.push(doc);
    }

    const existingOrder = await Order.findOne({
      userId: customerUser._id,
      status: 'confirmed'
    });

    if (!existingOrder && productDocs.length >= 2) {
      const items = [
        { productId: productDocs[0]._id, quantity: 2 },
        { productId: productDocs[1]._id, quantity: 3 }
      ];

      const totalAmount =
        productDocs[0].price * 2 + productDocs[1].price * 3;

      await Order.create({
        userId: customerUser._id,
        items,
        totalAmount,
        status: 'confirmed'
      });
    }

    console.log('Seed completed successfully.');
    console.log('Admin login: admin@grocery.com / admin123');
    console.log('Customer login: customer@grocery.com / customer123');
    console.log(`Products available: ${productDocs.length}`);
    console.log(`Admin user id: ${adminUser._id}`);
    console.log(`Customer user id: ${customerUser._id}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
}

runSeed();
