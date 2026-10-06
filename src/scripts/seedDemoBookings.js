require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Class = require('../models/Class');
const Booking = require('../models/Booking');

// Demo Member names for realistic account creation
const demoMemberNames = [
  'Aarav Sharma', 'Ananya Verma', 'Rohan Gupta', 'Ishita Malhotra',
  'Kabir Das', 'Diya Patel', 'Vivaan Joshi', 'Sanya Rao',
  'Aditya Kumar', 'Riya Sen', 'Devansh Nair', 'Meera Kapoor',
  'Siddharth Roy', 'Tara Bhatt', 'Yash Mehta', 'Kavya Singhania',
  'Karan Saxena', 'Navya Reddy', 'Arnav Bansal', 'Tanvi Choudhury'
];

async function seedDemoBookings() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flexfit';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for demo booking seeding (${mongoUri})`);

    // 1. Fetch or Create Demo Member Accounts
    let memberUsers = await User.find({ role: 'member' });
    console.log(`Existing member users in DB: ${memberUsers.length}`);

    // Ensure we have at least 20 member accounts for assigning distinct bookings
    const hashedPassword = await bcrypt.hash('Member@123456', 10);
    const neededAccounts = 20;

    for (let i = 1; i <= neededAccounts; i++) {
      const emailNum = String(i).padStart(2, '0');
      const email = `demo.member${emailNum}@example.com`;
      let user = memberUsers.find(u => u.email === email);
      if (!user) {
        user = await User.create({
          name: demoMemberNames[(i - 1) % demoMemberNames.length],
          email: email,
          password: hashedPassword,
          role: 'member',
          credits: 10
        });
        console.log(`+ Created demo member: ${user.name} (${user.email})`);
        memberUsers.push(user);
      }
    }

    console.log(`Total available member users for booking: ${memberUsers.length}`);

    // 2. Fetch all classes
    const classes = await Class.find({});
    console.log(`Found ${classes.length} classes to process for demo bookings.`);

    let totalNewBookingsCreated = 0;

    for (const fitnessClass of classes) {
      const classId = fitnessClass._id;
      const capacity = fitnessClass.capacity || 20;

      // Calculate target confirmed bookings based on capacity
      // Target around 60% - 75% of capacity (10 to 15 for capacity 20, 10 to 12 for capacity 15)
      let targetCount;
      if (capacity >= 25) {
        targetCount = 14; // e.g. 14 / 25
      } else if (capacity >= 20) {
        targetCount = 12; // e.g. 12 / 20
      } else if (capacity >= 15) {
        targetCount = 10; // e.g. 10 / 15
      } else {
        targetCount = Math.min(capacity - 2, Math.floor(capacity * 0.7)); // e.g. 8 / 12
      }

      // Check existing confirmed bookings for this class
      const existingBookings = await Booking.find({
        class: classId,
        status: 'confirmed'
      });

      let currentConfirmedCount = existingBookings.length;
      const existingUserIds = new Set(existingBookings.map(b => b.user.toString()));

      console.log(`Processing class: [${fitnessClass.category}] ${fitnessClass.title} (Capacity: ${capacity}, Current Confirmed: ${currentConfirmedCount}, Target: ${targetCount})`);

      // Shuffle available member users deterministically per class to get random distribution
      const availableMembers = memberUsers.filter(m => !existingUserIds.has(m._id.toString()));

      let addedForThisClass = 0;
      for (const member of availableMembers) {
        if (currentConfirmedCount >= targetCount || currentConfirmedCount >= capacity) {
          break; // Stop once target or capacity reached
        }

        // Generate realistic booking date (within past 3 days to current date)
        const dateOffsetMs = Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000);
        const bookingDate = new Date(Date.now() - dateOffsetMs);

        await Booking.create({
          user: member._id,
          class: classId,
          status: 'confirmed',
          bookingDate: bookingDate
        });

        currentConfirmedCount++;
        addedForThisClass++;
        totalNewBookingsCreated++;
      }

      // 3. Recalculate and Update bookedCount on Class document directly from MongoDB confirmed bookings
      const finalConfirmedCount = await Booking.countDocuments({
        class: classId,
        status: 'confirmed'
      });

      fitnessClass.bookedCount = finalConfirmedCount;
      await fitnessClass.save();

      console.log(`  -> Final status for "${fitnessClass.title}": ${fitnessClass.bookedCount} / ${capacity} booked (Added ${addedForThisClass} bookings)`);
    }

    console.log(`\n==============================================`);
    console.log(`✅ Demo booking seeding completed successfully!`);
    console.log(`Total new bookings created: ${totalNewBookingsCreated}`);
    console.log(`==============================================`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo bookings:', error);
    process.exit(1);
  }
}

seedDemoBookings();
