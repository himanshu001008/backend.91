require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');
const bcrypt = require('bcryptjs');

const sampleClasses = [
  // 1. YOGA
  {
    title: 'Morning Vinyasa Flow',
    description: 'Revitalize your body with gentle morning sun salutations and mindful breathing exercises.',
    instructor: 'Ananya Shah',
    category: 'Yoga',
    date: new Date('2026-10-15T07:00:00Z'),
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    capacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Power Vinyasa Yoga',
    description: 'Dynamic, high-energy yoga sequence focusing on flexibility, balance, and core stability.',
    instructor: 'Priya Singh',
    category: 'Yoga',
    date: new Date('2026-10-16T18:00:00Z'),
    startTime: '06:00 PM',
    endTime: '07:15 PM',
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },

  // 2. GYM
  {
    title: 'Full Body Gym Training',
    description: 'Comprehensive weight training and compound movements targeting all major muscle groups.',
    instructor: 'Rahul Sharma',
    category: 'Gym',
    date: new Date('2026-10-17T08:00:00Z'),
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    capacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Functional Gym Workout',
    description: 'Athletic conditioning session combining kettlebells, battle ropes, and bodyweight agility drills.',
    instructor: 'Arjun Mehta',
    category: 'Gym',
    date: new Date('2026-10-18T17:30:00Z'),
    startTime: '05:30 PM',
    endTime: '06:30 PM',
    capacity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },

  // 3. ZUMBA
  {
    title: 'Zumba Dance Blast',
    description: 'High-octane cardio dance session featuring energetic Latin routines and infectious beats.',
    instructor: 'Neha Patel',
    category: 'Zumba',
    date: new Date('2026-10-19T18:30:00Z'),
    startTime: '06:30 PM',
    endTime: '07:30 PM',
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Latin Zumba Fitness',
    description: 'Fun, upbeat salsa and bachata rhythms blended into a total-body cardio party.',
    instructor: 'Priya Singh',
    category: 'Zumba',
    date: new Date('2026-10-20T09:00:00Z'),
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=800&q=80'
  },

  // 4. CARDIO
  {
    title: 'Cardio Burn',
    description: 'Sweat-inducing aerobic workout designed to maximize calorie burn and improve stamina.',
    instructor: 'Rohan Kapoor',
    category: 'Cardio',
    date: new Date('2026-10-21T07:30:00Z'),
    startTime: '07:30 AM',
    endTime: '08:30 AM',
    capacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'HIIT Cardio Training',
    description: 'Fast-paced interval sprints, plyometrics, and heart-pumping functional movements.',
    instructor: 'Arjun Mehta',
    category: 'Cardio',
    date: new Date('2026-10-22T18:00:00Z'),
    startTime: '06:00 PM',
    endTime: '06:45 PM',
    capacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80'
  },

  // 5. STRENGTH
  {
    title: 'Strength & Conditioning',
    description: 'Heavy lifting fundamentals focusing on deadlifts, squats, and overhead presses.',
    instructor: 'Rahul Sharma',
    category: 'Strength',
    date: new Date('2026-10-23T08:30:00Z'),
    startTime: '08:30 AM',
    endTime: '09:45 AM',
    capacity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Upper Body Strength',
    description: 'Targeted hypertrophy and power training for chest, back, shoulders, and arms.',
    instructor: 'Rohan Kapoor',
    category: 'Strength',
    date: new Date('2026-10-24T17:00:00Z'),
    startTime: '05:00 PM',
    endTime: '06:00 PM',
    capacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
  },

  // 6. PILATES
  {
    title: 'Pilates Core Flow',
    description: 'Precision mat Pilates emphasizing deep abdominal activation, spinal alignment, and posture.',
    instructor: 'Ananya Shah',
    category: 'Pilates',
    date: new Date('2026-10-25T10:00:00Z'),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    capacity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Beginner Pilates',
    description: 'Gentle introduction to foundational Pilates movements, breath control, and core stabilization.',
    instructor: 'Neha Patel',
    category: 'Pilates',
    date: new Date('2026-10-26T16:00:00Z'),
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    capacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flexfit';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding (${mongoUri})`);

    // Find or create default Studio Partner user
    let studioUser = await User.findOne({ role: 'studio' });

    if (!studioUser) {
      console.log('No existing studio user found. Creating default FlexFit Partner Studio user...');
      const hashedPassword = await bcrypt.hash('Studio@123456', 10);
      studioUser = await User.create({
        name: 'FlexFit Central Studio',
        email: 'studio@flexfit.com',
        password: hashedPassword,
        role: 'studio'
      });
      console.log('Created Studio user:', studioUser.email);
    } else {
      console.log('Using existing studio user:', studioUser.email);
    }

    // Check optional CLI argument to clean test duplicates
    const cleanDuplicatesArg = process.argv.includes('--clean-duplicates');
    if (cleanDuplicatesArg) {
      console.log('Removing duplicate test Yoga classes titled "E2E Master Vinyasa Yoga (Updated)"...');
      const removeResult = await Class.deleteMany({ title: 'E2E Master Vinyasa Yoga (Updated)' });
      console.log(`Removed ${removeResult.deletedCount} duplicate test Yoga classes.`);
    }

    let addedCount = 0;
    for (const classData of sampleClasses) {
      // Avoid creating duplicate if class with same title already exists
      const existing = await Class.findOne({ title: classData.title });
      if (!existing) {
        await Class.create({
          ...classData,
          createdBy: studioUser._id
        });
        console.log(`+ Added class: [${classData.category}] ${classData.title}`);
        addedCount++;
      } else {
        console.log(`- Skipping existing class: [${classData.category}] ${classData.title}`);
      }
    }

    console.log(`\n✅ Seeding complete! Successfully added ${addedCount} new classes.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
