require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Application = require('./models/Application');

const pets = [
  {
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    size: 'large',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and cuddle. He is house-trained, good with kids, and gets along great with other dogs.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Golden',
    location: 'New York, NY',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  },
  {
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 2,
    gender: 'female',
    size: 'small',
    description: 'Luna is a graceful Siamese cat with striking blue eyes. She loves to perch by the window and watch the world go by. She\'s independent but affectionate.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Cream and brown',
    location: 'San Francisco, CA',
    photo: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400',
  },
  {
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    age: 5,
    gender: 'male',
    size: 'large',
    description: 'Max is a loyal and intelligent German Shepherd. He has been trained in basic obedience and is looking for an active family who can keep up with his energy levels.',
    status: 'available',
    vaccinated: true,
    neutered: false,
    color: 'Black and tan',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
  },
  {
    name: 'Bella',
    species: 'cat',
    breed: 'Persian',
    age: 4,
    gender: 'female',
    size: 'medium',
    description: 'Bella is a fluffy Persian cat with the most luxurious coat. She loves being groomed and pampered. She prefers a quiet home and would do best as an only pet.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'White',
    location: 'Los Angeles, CA',
    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
  {
    name: 'Charlie',
    species: 'dog',
    breed: 'Beagle',
    age: 1,
    gender: 'male',
    size: 'medium',
    description: 'Charlie is a curious and playful Beagle puppy who gets into everything! He needs lots of exercise and mental stimulation. Great with kids and other dogs.',
    status: 'available',
    vaccinated: true,
    neutered: false,
    color: 'Tricolor',
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400',
  },
  {
    name: 'Milo',
    species: 'rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'male',
    size: 'small',
    description: 'Milo is an adorable Holland Lop rabbit with floppy ears. He loves to binky around his enclosure and enjoys fresh vegetables as treats. Very gentle and social.',
    status: 'available',
    vaccinated: false,
    neutered: true,
    color: 'Grey and white',
    location: 'Seattle, WA',
    photo: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
  },
  {
    name: 'Coco',
    species: 'bird',
    breed: 'African Grey Parrot',
    age: 6,
    gender: 'unknown',
    size: 'medium',
    description: 'Coco is an incredibly intelligent African Grey Parrot who can speak over 100 words. Needs a dedicated owner who can spend a lot of time with them. Not for beginners.',
    status: 'available',
    vaccinated: false,
    neutered: false,
    color: 'Grey with red tail',
    location: 'Miami, FL',
    photo: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=400',
  },
  {
    name: 'Rocky',
    species: 'dog',
    breed: 'Labrador Retriever',
    age: 2,
    gender: 'male',
    size: 'large',
    description: 'Rocky is a loveable black Labrador who is full of energy and enthusiasm. He is great at swimming and loves outdoor adventures. Perfect for active families.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Black',
    location: 'Denver, CO',
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
  },
  {
    name: 'Whiskers',
    species: 'cat',
    breed: 'Maine Coon',
    age: 3,
    gender: 'male',
    size: 'large',
    description: 'Whiskers is a majestic Maine Coon with a magnificent fluffy coat. He\'s chatty and loves to follow his people around. Great with dogs and kids.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Brown tabby',
    location: 'Boston, MA',
    photo: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=400',
  },
  {
    name: 'Daisy',
    species: 'dog',
    breed: 'Cavalier King Charles Spaniel',
    age: 4,
    gender: 'female',
    size: 'small',
    description: 'Daisy is the sweetest Cavalier who loves nothing more than snuggling on the sofa. She is perfect for apartment living and does well with adults and calm kids.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Blenheim (chestnut and white)',
    location: 'Portland, OR',
    photo: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400',
  },
  {
    name: 'Nibbles',
    species: 'rabbit',
    breed: 'Lionhead',
    age: 2,
    gender: 'male',
    size: 'small',
    description: 'Nibbles is a fluffy Lionhead rabbit who loves munching on carrot tops. Very energetic but can be shy at first.',
    status: 'available',
    vaccinated: false,
    neutered: true,
    color: 'Brown',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1518796745738-41048802f99a?w=400',
  },

  {
    name: 'Simba',
    species: 'cat',
    breed: 'Bengal',
    age: 3,
    gender: 'male',
    size: 'medium',
    description: 'Simba has a beautiful spotted coat and a wild heart. Highly energetic, requires lots of playtime, and loves running on his cat wheel.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Spotted Brown',
    location: 'Houston, TX',
    photo: 'https://images.unsplash.com/photo-1618221815809-8e478546114e?w=400',
  },
  {
    name: 'Zeus',
    species: 'dog',
    breed: 'Husky',
    age: 4,
    gender: 'male',
    size: 'large',
    description: 'Zeus is a striking Husky with one blue eye and one brown eye. Very vocal and loves long hikes. Needs a home with a secure, high fence.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Black and White',
    location: 'Denver, CO',
    photo: 'https://images.unsplash.com/photo-1605568420116-b11b95ff664c?w=400',
  },
  {
    name: 'Snowball',
    species: 'rabbit',
    breed: 'Mini Rex',
    age: 1,
    gender: 'female',
    size: 'small',
    description: 'Snowball has fur as soft as velvet! She is very social and loves being gently petted. Would do well with older children.',
    status: 'available',
    vaccinated: false,
    neutered: true,
    color: 'White',
    location: 'Seattle, WA',
    photo: 'https://images.unsplash.com/photo-1582239611680-2a81389ed9b1?w=400',
  },
  {
    name: 'Oliver',
    species: 'cat',
    breed: 'British Shorthair',
    age: 5,
    gender: 'male',
    size: 'medium',
    description: 'Oliver is a chunky, easy-going lad who prefers napping in warm sunbeams over chasing toys. Extremely affectionate and low-maintenance.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Blue (Grey)',
    location: 'New York, NY',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
  },
  {
    name: 'Mango',
    species: 'bird',
    breed: 'Cockatiel',
    age: 2,
    gender: 'male',
    size: 'small',
    description: 'Mango is an incredibly cheerful little bird who whistles familiar tunes. He loves head scratches and millet spray treats.',
    status: 'available',
    vaccinated: false,
    neutered: false,
    color: 'Yellow and Grey',
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1629822607870-ab8f1b29ab26?w=400',
  },
  {
    name: 'Shadow',
    species: 'dog',
    breed: 'Doberman Pinscher',
    age: 3,
    gender: 'female',
    size: 'large',
    description: "Shadow is a sleek, highly intelligent 'velcro dog' who wants to be wherever you are. Very protective and well-trained in basic obedience.",
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Black and Rust',
    location: 'Los Angeles, CA',
    photo: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400',
  },
  {
    name: 'Hazel',
    species: 'rabbit',
    breed: 'Flemish Giant',
    age: 2,
    gender: 'female',
    size: 'large',
    description: 'Hazel is a gentle giant! Weighing in at 14 lbs, she is basically a small dog. Very docile and loves lounging on the living room rug.',
    status: 'available',
    vaccinated: false,
    neutered: true,
    color: 'Sandy Fawn',
    location: 'Portland, OR',
    photo: 'https://images.unsplash.com/photo-1577774438676-46bd88eddf73?w=400',
  },
  {
    name: 'Gizmo',
    species: 'dog',
    breed: 'Pug',
    age: 6,
    gender: 'male',
    size: 'small',
    description: 'Gizmo is a funny little character who grunts and snores to communicate. Not built for marathons, but an absolute champion at couch cuddling.',
    status: 'available',
    vaccinated: true,
    neutered: true,
    color: 'Fawn',
    location: 'Boston, MA',
    photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@petadopt.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);

    // Create regular test user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@petadopt.com',
      password: 'user1234',
      role: 'user',
    });
    console.log(`Test user created: ${user.email}`);

    // Create pets
    const createdPets = await Pet.insertMany(pets);
    console.log(`${createdPets.length} pets seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin  → admin@petadopt.com  / admin123');
    console.log('User   → user@petadopt.com   / user1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
