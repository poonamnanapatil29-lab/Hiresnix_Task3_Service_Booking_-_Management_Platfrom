import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Provider from './models/Provider.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import Review from './models/Review.js';
import Notification from './models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servisync');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Provider.deleteMany(),
      Service.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('Cleared existing collections.');

    // 1. Create Categories
    const categoriesData = [
      {
        name: 'Home Cleaning',
        slug: 'home-cleaning',
        description: 'Deep cleaning, regular housekeeping, move-in/move-out services by trusted professionals.',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Plumbing',
        slug: 'plumbing',
        description: 'Pipe repairs, leak detection, drain cleaning, tap installations, and bathroom fittings.',
        icon: 'Wrench',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Electrical Services',
        slug: 'electrical-services',
        description: 'Certified electrical wiring, short-circuit diagnostics, appliance setups, and lighting.',
        icon: 'Zap',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Beauty & Salon',
        slug: 'beauty-salon',
        description: 'Luxury haircuts, styling, facials, pedicures, manicures, and bridal makeup at home.',
        icon: 'Scissors',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Appliance Repair',
        slug: 'appliance-repair',
        description: 'Refrigerators, washing machines, microwaves, HVAC systems, and dishwasher repairs.',
        icon: 'Cpu',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Car Wash & Detailing',
        slug: 'car-wash',
        description: 'Eco-friendly doorstep foam wash, interior vacuuming, ceramic coating, and polishing.',
        icon: 'Car',
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        isPopular: false
      },
      {
        name: 'Fitness & Personal Training',
        slug: 'fitness-training',
        description: 'Certified personal trainers for 1-on-1 HIIT, yoga, strength conditioning, and diet coaching.',
        icon: 'Activity',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        isPopular: false
      },
      {
        name: 'Tutoring & Education',
        slug: 'tutoring',
        description: 'Expert private tutors for Math, Science, Coding, and SAT prep across all grade levels.',
        icon: 'GraduationCap',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        isPopular: false
      },
      {
        name: 'Photography & Videography',
        slug: 'photography',
        description: 'Event shoots, corporate portraits, wedding photography, and drone videography.',
        icon: 'Camera',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        isPopular: true
      },
      {
        name: 'Computer & IT Services',
        slug: 'computer-it',
        description: 'Laptop repair, virus removal, Wi-Fi networking, data recovery, and home office setups.',
        icon: 'Laptop',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
        isPopular: false
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${createdCategories.length} categories.`);

    // 2. Create Users (Admin, Providers, Customers)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@servisync.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      address: { street: '500 5th Ave', city: 'New York', state: 'NY', zipCode: '10110' }
    });

    // Provider Users
    const providerUser1 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@cleanpro.com',
      password: 'password123',
      role: 'provider',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      address: { street: '124 Atlantic Ave', city: 'Brooklyn', state: 'NY', zipCode: '11201' }
    });

    const providerUser2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@vancepipe.com',
      password: 'password123',
      role: 'provider',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      address: { street: '78 Queens Blvd', city: 'Queens', state: 'NY', zipCode: '11101' }
    });

    const providerUser3 = await User.create({
      name: 'David Chen',
      email: 'david@sparkvolt.com',
      password: 'password123',
      role: 'provider',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      address: { street: '312 W 34th St', city: 'New York', state: 'NY', zipCode: '10001' }
    });

    const providerUser4 = await User.create({
      name: 'Sophia Martinez',
      email: 'sophia@glamoursalon.com',
      password: 'password123',
      role: 'provider',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      address: { street: '450 Lexington Ave', city: 'New York', state: 'NY', zipCode: '10017' }
    });

    // Customer Users
    const customer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+1 (555) 890-1234',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      address: { street: '85 Broad Street, Apt 14B', city: 'New York', state: 'NY', zipCode: '10004' }
    });

    const customer2 = await User.create({
      name: 'Liam Anderson',
      email: 'liam@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      address: { street: '220 E 42nd St', city: 'New York', state: 'NY', zipCode: '10017' }
    });

    // 3. Create Providers
    const provider1 = await Provider.create({
      user: providerUser1._id,
      businessName: 'SparkleClean Premium Services',
      bio: 'Eco-friendly and vetted luxury cleaning specialists with over 8 years serving New York City.',
      rating: 4.9,
      reviewCount: 38,
      isVerified: true,
      serviceAreas: ['Manhattan', 'Brooklyn', 'Queens'],
      experienceYears: 8,
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
      }
    });

    const provider2 = await Provider.create({
      user: providerUser2._id,
      businessName: 'Vance Master Plumbing LLC',
      bio: 'Licensed Master Plumbers available for residential leak repairs, boiler inspections, and emergency fixture installations.',
      rating: 4.8,
      reviewCount: 45,
      isVerified: true,
      serviceAreas: ['Manhattan', 'Queens', 'Long Island City'],
      experienceYears: 12,
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:30 PM', '05:30 PM']
      }
    });

    const provider3 = await Provider.create({
      user: providerUser3._id,
      businessName: 'VoltSmart Electrical Solutions',
      bio: 'Certified electricians specializing in smart home automation, EV chargers, circuit breaker upgrades, and safety audits.',
      rating: 4.95,
      reviewCount: 52,
      isVerified: true,
      serviceAreas: ['Manhattan', 'Brooklyn'],
      experienceYears: 10,
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
      }
    });

    const provider4 = await Provider.create({
      user: providerUser4._id,
      businessName: 'Luxe Hair & Skin Studio',
      bio: 'Top-tier stylists bringing salon-grade pampering, organic facials, and couture styling right to your home.',
      rating: 5.0,
      reviewCount: 29,
      isVerified: true,
      serviceAreas: ['Manhattan', 'Upper East Side', 'SoHo'],
      experienceYears: 7,
      availability: {
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeSlots: ['10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM']
      }
    });

    // 4. Create Services
    const catCleaning = createdCategories.find(c => c.slug === 'home-cleaning');
    const catPlumbing = createdCategories.find(c => c.slug === 'plumbing');
    const catElectric = createdCategories.find(c => c.slug === 'electrical-services');
    const catBeauty = createdCategories.find(c => c.slug === 'beauty-salon');
    const catAppliance = createdCategories.find(c => c.slug === 'appliance-repair');
    const catCar = createdCategories.find(c => c.slug === 'car-wash');
    const catPhoto = createdCategories.find(c => c.slug === 'photography');

    const servicesData = [
      {
        title: 'Deep Home Cleaning & Sanitization',
        description: 'Comprehensive top-to-bottom sanitization of all rooms, kitchen degreasing, bathroom descaling, vacuuming, and mop treatment with hospital-grade disinfectant.',
        category: catCleaning._id,
        provider: provider1._id,
        price: 149,
        durationMins: 180,
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Kitchen cabinets & oven exterior cleaning',
          'Deep bathroom scrub & limescale removal',
          'Dusting baseboards, fixtures & blinds',
          'Eco-friendly non-toxic cleaning supplies included'
        ],
        location: 'New York, NY',
        rating: 4.9,
        reviewCount: 24,
        isPopular: true
      },
      {
        title: 'Move-In / Move-Out Deep Clean',
        description: 'Guaranteed security-deposit standard deep clean. Inside cupboards, appliances, windows, and detailed floor restoration.',
        category: catCleaning._id,
        provider: provider1._id,
        price: 199,
        durationMins: 240,
        images: [
          'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Interior appliance cleaning (Fridge & Oven)',
          'Interior window sill and glass detailing',
          'Full baseboards and door frames hand washed'
        ],
        location: 'Brooklyn, NY',
        rating: 4.85,
        reviewCount: 14,
        isPopular: false
      },
      {
        title: 'Emergency Pipe Leak & Drain Unclogging',
        description: 'Rapid diagnostic and permanent fix for leaking sink traps, dripping pipes, overflowing toilets, or slow draining showers.',
        category: catPlumbing._id,
        provider: provider2._id,
        price: 110,
        durationMins: 75,
        images: [
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Full video-inspection camera diagnostics',
          'Heavy-duty motorized snaking included',
          'Pipe joint replacement and seal testing',
          '90-day leak-free guarantee'
        ],
        location: 'Queens, NY',
        rating: 4.8,
        reviewCount: 31,
        isPopular: true
      },
      {
        title: 'Modern Faucet & Showerhead Installation',
        description: 'Professional setup and water pressure optimization for bathroom vanities, rain showers, kitchen pulldown faucets, and water filtration systems.',
        category: catPlumbing._id,
        provider: provider2._id,
        price: 85,
        durationMins: 60,
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Old fixture removal & disposal',
          'Precision fit with teflon and silicone seals',
          'Water pressure and hot/cold line validation'
        ],
        location: 'New York, NY',
        rating: 4.9,
        reviewCount: 14,
        isPopular: false
      },
      {
        title: 'Smart Home Automation & Lighting Setup',
        description: 'Install and configure smart dimmers, Philips Hue recessed LED downlights, Google Nest / Ring video doorbells, and smart thermostat units.',
        category: catElectric._id,
        provider: provider3._id,
        price: 135,
        durationMins: 90,
        images: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Supports Apple HomeKit, Alexa, and Google Home',
          'Neutral wire inspection and junction box safety check',
          'Full app connection and routine setup guidance'
        ],
        location: 'New York, NY',
        rating: 5.0,
        reviewCount: 28,
        isPopular: true
      },
      {
        title: 'Electrical Panel & Circuit Breaker Upgrade',
        description: 'Comprehensive 100A to 200A service upgrade, GFCI outlet retrofit, surge protection, and safety compliance certification.',
        category: catElectric._id,
        provider: provider3._id,
        price: 250,
        durationMins: 180,
        images: [
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Whole-house surge protector installation',
          'Arc-Fault & GFCI safety compliance',
          'Official licensed contractor sign-off certificate'
        ],
        location: 'Manhattan, NY',
        rating: 4.9,
        reviewCount: 24,
        isPopular: false
      },
      {
        title: 'Deluxe At-Home Haircut, Styling & Blowout',
        description: 'Customized hair consultation, precision cutting, nourishing mask, and red-carpet blowout styling in the comfort of your home.',
        category: catBeauty._id,
        provider: provider4._id,
        price: 95,
        durationMins: 60,
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Consultation tailored to face shape & lifestyle',
          'Kerastase organic deep conditioning treatment',
          'Salon-grade heat protection styling products'
        ],
        location: 'New York, NY',
        rating: 5.0,
        reviewCount: 19,
        isPopular: true
      },
      {
        title: 'HydraGlow Facial & Anti-Stress Massage',
        description: '60-minute revitalizing facial featuring ultrasonic extraction, hyaluronic hydration infusion, LED light therapy, and neck massage.',
        category: catBeauty._id,
        provider: provider4._id,
        price: 120,
        durationMins: 75,
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Pore cleansing and dead skin exfoliation',
          'Collagen boosting red LED therapy',
          'Lymphatic drainage face and neck massage'
        ],
        location: 'New York, NY',
        rating: 4.95,
        reviewCount: 10,
        isPopular: false
      },
      {
        title: 'Refrigerator & Freezer Compressor Diagnostic',
        description: 'Rapid diagnosis and repair for cooling failures, noisy compressors, frost buildup, ice maker glitches, and thermostat failure.',
        category: catAppliance._id,
        provider: provider2._id,
        price: 89,
        durationMins: 60,
        images: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Covers Samsung, LG, Whirlpool, GE, Sub-Zero',
          'Genuine OEM replacement parts guarantee',
          'Refrigerant level check and leak detection'
        ],
        location: 'Brooklyn, NY',
        rating: 4.8,
        reviewCount: 18,
        isPopular: false
      },
      {
        title: 'Doorstep Ceramic Foam Wash & Wax',
        description: 'Hand wash with pH-neutral active foam, rim decontamination, tire dressing, hydrophobic ceramic booster wax, and streak-free glass.',
        category: catCar._id,
        provider: provider1._id,
        price: 65,
        durationMins: 45,
        images: [
          'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Microfiber hand wash with scratch-free 2-bucket method',
          'Wheel arch blast & brake dust removal',
          'Express interior dust and vacuum'
        ],
        location: 'Queens, NY',
        rating: 4.75,
        reviewCount: 22,
        isPopular: false
      },
      {
        title: 'Professional Portrait & Headshot Session',
        description: 'High-end portraiture for LinkedIn, executives, authors, or dating profiles. Includes mobile studio lighting and 5 retouched originals.',
        category: catPhoto._id,
        provider: provider3._id,
        price: 180,
        durationMins: 60,
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          'Multiple wardrobe changes supported',
          'Professional strobes and backdrop brought on-site',
          'High-resolution online gallery delivered in 48 hours'
        ],
        location: 'New York, NY',
        rating: 5.0,
        reviewCount: 16,
        isPopular: true
      }
    ];

    const createdServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${createdServices.length} services.`);

    // 5. Create Sample Bookings
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const bookings = await Booking.insertMany([
      {
        bookingId: 'SRV-8F92A1',
        customer: customer1._id,
        provider: provider1._id,
        service: createdServices[0]._id, // Deep cleaning
        bookingDate: tomorrow,
        timeSlot: '11:30 AM',
        status: 'confirmed',
        paymentStatus: 'paid',
        totalPrice: 149,
        customerAddress: {
          street: '85 Broad Street, Apt 14B',
          city: 'New York',
          state: 'NY',
          zipCode: '10004'
        },
        notes: 'Please buzz code 1402 when downstairs.'
      },
      {
        bookingId: 'SRV-4K29E3',
        customer: customer1._id,
        provider: provider3._id,
        service: createdServices[4]._id, // Smart Home
        bookingDate: nextWeek,
        timeSlot: '02:00 PM',
        status: 'pending',
        paymentStatus: 'paid',
        totalPrice: 135,
        customerAddress: {
          street: '85 Broad Street, Apt 14B',
          city: 'New York',
          state: 'NY',
          zipCode: '10004'
        },
        notes: 'Need Ring doorbell wired.'
      },
      {
        bookingId: 'SRV-1X90B7',
        customer: customer2._id,
        provider: provider4._id,
        service: createdServices[6]._id, // Haircut
        bookingDate: today,
        timeSlot: '03:00 PM',
        status: 'completed',
        paymentStatus: 'paid',
        totalPrice: 95,
        customerAddress: {
          street: '220 E 42nd St',
          city: 'New York',
          state: 'NY',
          zipCode: '10017'
        },
        notes: 'Special event styling.'
      }
    ]);
    console.log(`Seeded ${bookings.length} sample bookings.`);

    // 6. Create Reviews
    await Review.insertMany([
      {
        service: createdServices[0]._id,
        provider: provider1._id,
        customer: customer1._id,
        rating: 5,
        comment: 'Elena and her team did an absolutely phenomenal job. Our apartment looked sparkling clean and smelled wonderful!',
        providerReply: 'Thank you Sarah! It was an absolute pleasure.'
      },
      {
        service: createdServices[4]._id,
        provider: provider3._id,
        customer: customer2._id,
        rating: 5,
        comment: 'David was super fast and knowledgeable. He set up our smart lights and helped us with the app setup without any hassle.',
        providerReply: 'Glad you loved the setup Liam!'
      },
      {
        service: createdServices[6]._id,
        provider: provider4._id,
        customer: customer2._id,
        rating: 5,
        comment: 'Sophia was punctual, professional, and gave me one of the best haircuts I have had in years. Highly recommend!',
        providerReply: 'Thank you so much!'
      }
    ]);
    console.log('Seeded sample reviews.');

    // 7. Seed Notifications
    await Notification.insertMany([
      {
        recipient: customer1._id,
        type: 'booking_created',
        title: 'Booking Confirmed!',
        message: 'Your booking SRV-8F92A1 for "Deep Home Cleaning" has been confirmed for tomorrow.',
        isRead: false,
        link: '/dashboard/customer'
      },
      {
        recipient: providerUser1._id,
        type: 'booking_created',
        title: 'New Booking Request',
        message: 'New confirmed booking SRV-8F92A1 scheduled for tomorrow at 11:30 AM.',
        isRead: false,
        link: '/dashboard/provider'
      }
    ]);
    console.log('Seeded sample notifications.');

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Demo Credentials:');
    console.log('Admin:    admin@servisync.com / password123');
    console.log('Provider: elena@cleanpro.com / password123');
    console.log('Customer: sarah@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
