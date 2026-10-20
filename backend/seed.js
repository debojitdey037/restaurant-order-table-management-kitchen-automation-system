const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear old data
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    await Order.deleteMany();

    console.log('Cleared existing collections.');

    // 1. Create Admin & Customer Users
    const adminUser = await User.create({
      name: 'Restaurant Admin',
      email: 'admin@restaurant.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Sample Customer',
      email: 'customer@restaurant.com',
      password: 'customerpassword123',
      role: 'customer'
    });

    console.log('Seeded Users:');
    console.log(`- Admin: ${adminUser.email} / adminpassword123`);
    console.log(`- Customer: ${customerUser.email} / customerpassword123`);

    // 2. Create 5 Tables
    const tablesData = [
      { tableNumber: 1, capacity: 2 },
      { tableNumber: 2, capacity: 4 },
      { tableNumber: 3, capacity: 4 },
      { tableNumber: 4, capacity: 6 },
      { tableNumber: 5, capacity: 8 }
    ];

    const createdTables = await Table.insertMany(tablesData);
    console.log(`Seeded ${createdTables.length} tables.`);

    // 3. Create 16 Menu Items across 4 Categories
    const menuItemsData = [
      // Starters
      {
        name: 'Crispy Paneer Tikka',
        category: 'Starters',
        price: 220,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Veg Spring Rolls',
        category: 'Starters',
        price: 180,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'BBQ Chicken Wings',
        category: 'Starters',
        price: 280,
        isVeg: false,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1527477378378-fc2f0997193b?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Garlic Butter Mushrooms',
        category: 'Starters',
        price: 210,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'
      },

      // Main Course
      {
        name: 'Paneer Butter Masala',
        category: 'Main Course',
        price: 290,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Dal Makhani',
        category: 'Main Course',
        price: 240,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Butter Chicken',
        category: 'Main Course',
        price: 350,
        isVeg: false,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Veg Dum Biryani',
        category: 'Main Course',
        price: 260,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Chicken Dum Biryani',
        category: 'Main Course',
        price: 330,
        isVeg: false,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
      },

      // Breads & Rice
      {
        name: 'Butter Naan',
        category: 'Breads & Rice',
        price: 55,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Garlic Naan',
        category: 'Breads & Rice',
        price: 70,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Jeera Rice',
        category: 'Breads & Rice',
        price: 140,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80'
      },

      // Desserts & Beverages
      {
        name: 'Gulab Jamun with Ice Cream',
        category: 'Desserts & Beverages',
        price: 120,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Warm Chocolate Brownie',
        category: 'Desserts & Beverages',
        price: 150,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Sweet Mango Lassi',
        category: 'Desserts & Beverages',
        price: 90,
        isVeg: true,
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Fresh Mint Lime Soda',
        category: 'Desserts & Beverages',
        price: 70,
        isVeg: true,
        isAvailable: false, // Testing out-of-stock item
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const createdItems = await MenuItem.insertMany(menuItemsData);
    console.log(`Seeded ${createdItems.length} menu items across 4 categories.`);

    // 4. Create Sample Orders for testing Dashboard, Kitchen, and Customer views
    const sampleOrders = [
      {
        user: customerUser._id,
        table: createdTables[0]._id, // Table 1
        items: [
          { menuItem: createdItems[0]._id, name: createdItems[0].name, price: createdItems[0].price, quantity: 2 },
          { menuItem: createdItems[4]._id, name: createdItems[4].name, price: createdItems[4].price, quantity: 1 }
        ],
        subtotal: (createdItems[0].price * 2) + createdItems[4].price,
        gst: Number((((createdItems[0].price * 2) + createdItems[4].price) * 0.05).toFixed(2)),
        grandTotal: Number((((createdItems[0].price * 2) + createdItems[4].price) * 1.05).toFixed(2)),
        status: 'Paid'
      },
      {
        user: customerUser._id,
        table: createdTables[1]._id, // Table 2
        items: [
          { menuItem: createdItems[6]._id, name: createdItems[6].name, price: createdItems[6].price, quantity: 2 },
          { menuItem: createdItems[9]._id, name: createdItems[9].name, price: createdItems[9].price, quantity: 4 }
        ],
        subtotal: (createdItems[6].price * 2) + (createdItems[9].price * 4),
        gst: Number((((createdItems[6].price * 2) + (createdItems[9].price * 4)) * 0.05).toFixed(2)),
        grandTotal: Number((((createdItems[6].price * 2) + (createdItems[9].price * 4)) * 1.05).toFixed(2)),
        status: 'Preparing'
      },
      {
        user: customerUser._id,
        table: createdTables[2]._id, // Table 3
        items: [
          { menuItem: createdItems[1]._id, name: createdItems[1].name, price: createdItems[1].price, quantity: 1 },
          { menuItem: createdItems[14]._id, name: createdItems[14].name, price: createdItems[14].price, quantity: 2 }
        ],
        subtotal: createdItems[1].price + (createdItems[14].price * 2),
        gst: Number(((createdItems[1].price + (createdItems[14].price * 2)) * 0.05).toFixed(2)),
        grandTotal: Number(((createdItems[1].price + (createdItems[14].price * 2)) * 1.05).toFixed(2)),
        status: 'Placed'
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`Seeded ${sampleOrders.length} sample orders (Paid, Preparing, Placed).`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
