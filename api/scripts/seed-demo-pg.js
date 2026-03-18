require('dotenv').config();
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const IMAGE_SRC_DIR = path.resolve(__dirname, '../../ui/src/data/cabins');
const IMAGE_DEST_DIR = path.resolve(__dirname, '../public/uploads/cabins');

const cabinData = [
  {
    number: '001',
    name: 'Forest Haven',
    maxCapacity: 2,
    regularPrice: 250,
    discount: 0,
    image: 'uploads/cabins/cabin-001.jpg',
    description:
      'Discover the ultimate luxury getaway for couples in the cozy wooden cabin Forest Haven. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat. Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and a fully-equipped kitchen. The plush king-size bed, dressed in fine linens guarantees a peaceful nights sleep. Relax in the spa-like shower and unwind on the private deck with hot tub.',
  },
  {
    number: '002',
    name: 'Lakeside Retreat',
    maxCapacity: 2,
    regularPrice: 350,
    discount: 25,
    image: 'uploads/cabins/cabin-002.jpg',
    description:
      'Escape to the serenity of nature and indulge in luxury in our romantic Lakeside Retreat. Perfect for couples, this cabin offers a secluded and intimate retreat in the heart of a picturesque forest. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace and a fully-equipped kitchen. The luxurious bedroom features a plush king-size bed and spa-like shower. Relax on the private deck with hot tub and take in the beauty of nature.',
  },
  {
    number: '003',
    name: 'Woodland Escape',
    maxCapacity: 4,
    regularPrice: 300,
    discount: 0,
    image: 'uploads/cabins/cabin-003.jpg',
    description:
      'Experience luxury family living in our medium-sized Woodland Escape. Perfect for families of up to 4 people, this cabin offers a comfortable and inviting space with all modern amenities. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace, and a fully-equipped kitchen. The bedrooms feature plush beds and spa-like bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.',
  },
  {
    number: '004',
    name: 'Summit Lodge',
    maxCapacity: 4,
    regularPrice: 500,
    discount: 50,
    image: 'uploads/cabins/cabin-004.jpg',
    description:
      'Indulge in the ultimate luxury family vacation at the Summit Lodge. Designed for families of up to 4, this cabin offers a sumptuous retreat for the discerning traveler. Inside, the cabin boasts of opulent interiors crafted from the finest quality wood, a comfortable living area, a fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-inspired en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.',
  },
  {
    number: '005',
    name: 'Pine Ridge',
    maxCapacity: 6,
    regularPrice: 350,
    discount: 0,
    image: 'uploads/cabins/cabin-005.jpg',
    description:
      'Enjoy a comfortable and cozy getaway with your group or family at Pine Ridge. Designed to accommodate up to 6 people, this cabin offers a secluded retreat in the heart of nature. Inside, the cabin features warm and inviting interiors crafted from quality wood, a living area with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. Step outside to your private deck and take in the natural surroundings while relaxing in your own hot tub.',
  },
  {
    number: '006',
    name: 'Cedar Grove',
    maxCapacity: 6,
    regularPrice: 800,
    discount: 100,
    image: 'uploads/cabins/cabin-006.jpg',
    description:
      'Experience the epitome of luxury with your group or family at Cedar Grove. Designed to comfortably accommodate up to 6 people, this cabin offers a lavish retreat in the heart of nature. Inside, the cabin features opulent interiors crafted from premium wood, a grand living area with fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-like en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.',
  },
  {
    number: '007',
    name: 'Mountain Vista',
    maxCapacity: 8,
    regularPrice: 600,
    discount: 100,
    image: 'uploads/cabins/cabin-007.jpg',
    description:
      'Accommodate your large group or multiple families at Mountain Vista. Designed to comfortably fit up to 8 people, this cabin offers a secluded retreat in the heart of beautiful forests and mountains. Inside, the cabin features warm and inviting interiors crafted from quality wood, multiple living areas with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.',
  },
  {
    number: '008',
    name: 'Grand Wilderness',
    maxCapacity: 10,
    regularPrice: 1400,
    discount: 0,
    image: 'uploads/cabins/cabin-008.jpg',
    description:
      "Experience the epitome of luxury and grandeur with your large group or multiple families at the Grand Wilderness. This cabin offers a lavish retreat that caters to all your needs and desires. The cabin features an opulent design and boasts of high-end finishes, intricate details and the finest quality wood throughout. Inside, the cabin features multiple grand living areas with fireplaces, a formal dining area, and a gourmet kitchen that is a chef's dream. The bedrooms are designed for ultimate comfort and luxury, with plush beds and en-suite spa-inspired bathrooms. Step outside and immerse yourself in the beauty of nature from your private deck, featuring a luxurious hot tub and ample seating areas for ultimate relaxation and enjoyment.",
  },
];

const guestData = [
  {
    fullName: 'Jonas Schmedtmann',
    email: 'hello@jonas.io',
    nationality: 'Portugal',
    nationalId: '3525436345',
    countryFlag: 'https://flagcdn.com/pt.svg',
  },
  {
    fullName: 'Jonathan Smith',
    email: 'johnsmith@test.eu',
    nationality: 'Great Britain',
    nationalId: '4534593454',
    countryFlag: 'https://flagcdn.com/gb.svg',
  },
  {
    fullName: 'Jonatan Johansson',
    email: 'jonatan@example.com',
    nationality: 'Finland',
    nationalId: '9374074454',
    countryFlag: 'https://flagcdn.com/fi.svg',
  },
  {
    fullName: 'Jonas Mueller',
    email: 'jonas@example.eu',
    nationality: 'Germany',
    nationalId: '1233212288',
    countryFlag: 'https://flagcdn.com/de.svg',
  },
  {
    fullName: 'Jonas Anderson',
    email: 'anderson@example.com',
    nationality: 'Bolivia (Plurinational State of)',
    nationalId: '0988520146',
    countryFlag: 'https://flagcdn.com/bo.svg',
  },
  {
    fullName: 'Jonathan Williams',
    email: 'jowi@gmail.com',
    nationality: 'United States of America',
    nationalId: '633678543',
    countryFlag: 'https://flagcdn.com/us.svg',
  },
  {
    fullName: 'Emma Watson',
    email: 'emma@gmail.com',
    nationality: 'United Kingdom',
    nationalId: '1234578901',
    countryFlag: 'https://flagcdn.com/gb.svg',
  },
  {
    fullName: 'Mohammed Ali',
    email: 'mohammedali@yahoo.com',
    nationality: 'Egypt',
    nationalId: '987543210',
    countryFlag: 'https://flagcdn.com/eg.svg',
  },
  {
    fullName: 'Maria Rodriguez',
    email: 'maria@gmail.com',
    nationality: 'Spain',
    nationalId: '1098765321',
    countryFlag: 'https://flagcdn.com/es.svg',
  },
  {
    fullName: 'Li Mei',
    email: 'li.mei@hotmail.com',
    nationality: 'China',
    nationalId: '102934756',
    countryFlag: 'https://flagcdn.com/cn.svg',
  },
  {
    fullName: 'Khadija Ahmed',
    email: 'khadija@gmail.com',
    nationality: 'Sudan',
    nationalId: '1023457890',
    countryFlag: 'https://flagcdn.com/sd.svg',
  },
  {
    fullName: 'Gabriel Silva',
    email: 'gabriel@gmail.com',
    nationality: 'Brazil',
    nationalId: '109283465',
    countryFlag: 'https://flagcdn.com/br.svg',
  },
  {
    fullName: 'Maria Gomez',
    email: 'maria@example.com',
    nationality: 'Mexico',
    nationalId: '108765421',
    countryFlag: 'https://flagcdn.com/mx.svg',
  },
  {
    fullName: 'Ahmed Hassan',
    email: 'ahmed@gmail.com',
    nationality: 'Egypt',
    nationalId: '1077777777',
    countryFlag: 'https://flagcdn.com/eg.svg',
  },
  {
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    nationality: 'United States',
    nationalId: '3245908744',
    countryFlag: 'https://flagcdn.com/us.svg',
  },
  {
    fullName: 'Fatima Ahmed',
    email: 'fatima@example.com',
    nationality: 'Pakistan',
    nationalId: '1089999363',
    countryFlag: 'https://flagcdn.com/pk.svg',
  },
  {
    fullName: 'David Smith',
    email: 'david@gmail.com',
    nationality: 'Australia',
    nationalId: '44450960283',
    countryFlag: 'https://flagcdn.com/au.svg',
  },
  {
    fullName: 'Marie Dupont',
    email: 'marie@gmail.com',
    nationality: 'France',
    nationalId: '06934233728',
    countryFlag: 'https://flagcdn.com/fr.svg',
  },
  {
    fullName: 'Ramesh Patel',
    email: 'ramesh@gmail.com',
    nationality: 'India',
    nationalId: '9875412303',
    countryFlag: 'https://flagcdn.com/in.svg',
  },
  {
    fullName: 'Fatimah Al-Sayed',
    email: 'fatimah@gmail.com',
    nationality: 'Kuwait',
    nationalId: '0123456789',
    countryFlag: 'https://flagcdn.com/kw.svg',
  },
  {
    fullName: 'Nina Williams',
    email: 'nina@hotmail.com',
    nationality: 'South Africa',
    nationalId: '2345678901',
    countryFlag: 'https://flagcdn.com/za.svg',
  },
  {
    fullName: 'Taro Tanaka',
    email: 'taro@gmail.com',
    nationality: 'Japan',
    nationalId: '3456789012',
    countryFlag: 'https://flagcdn.com/jp.svg',
  },
];

function copyCabinImages() {
  fs.mkdirSync(IMAGE_DEST_DIR, { recursive: true });

  for (const cabin of cabinData) {
    const fileName = path.basename(cabin.image);
    const src = path.join(IMAGE_SRC_DIR, fileName);
    const dest = path.join(IMAGE_DEST_DIR, fileName);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${fileName} → ${dest}`);
    } else {
      console.warn(`Image not found, skipping: ${src}`);
    }
  }
}

async function seed() {
  copyCabinImages();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM cabins');
    await client.query('DELETE FROM guests');
    console.log('Existing bookings, cabins, and guests deleted.');

    await client.query(
      `
      INSERT INTO settings (
        id,
        min_booking_length,
        max_booking_length,
        max_guests_per_booking,
        breakfast_price
      ) VALUES (1, 3, 30, 10, 15)
      ON CONFLICT (id) DO UPDATE SET
        min_booking_length = EXCLUDED.min_booking_length,
        max_booking_length = EXCLUDED.max_booking_length,
        max_guests_per_booking = EXCLUDED.max_guests_per_booking,
        breakfast_price = EXCLUDED.breakfast_price
      `,
    );

    const hashedPassword = await bcrypt.hash('password123', 12);

    await client.query(
      `
      INSERT INTO users (id, email, password, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
      `,
      [randomUUID(), 'admin@wilodoasis.com', hashedPassword, 'Admin', 'admin'],
    );

    for (const cabin of cabinData) {
      await client.query(
        `
        INSERT INTO cabins (cabin_number, name, max_capacity, regular_price, discount, image, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (cabin_number) DO UPDATE SET
          name          = EXCLUDED.name,
          max_capacity  = EXCLUDED.max_capacity,
          regular_price = EXCLUDED.regular_price,
          discount      = EXCLUDED.discount,
          image         = EXCLUDED.image,
          description   = EXCLUDED.description
        `,
        [
          cabin.number,
          cabin.name,
          cabin.maxCapacity,
          cabin.regularPrice,
          cabin.discount,
          cabin.image,
          cabin.description,
        ],
      );
    }

    for (const guest of guestData) {
      await client.query(
        `
        INSERT INTO guests (full_name, email, nationality, national_id, country_flag)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
        `,
        [
          guest.fullName,
          guest.email,
          guest.nationality,
          guest.nationalId,
          guest.countryFlag,
        ],
      );
    }

    await client.query('COMMIT');
    console.log('Demo data inserted with pg successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed demo data with pg:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
