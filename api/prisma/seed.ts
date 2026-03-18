/**
 * Seed script: populates the database with initial settings, cabins, guests,
 * and an admin user so the app is ready to use out of the box.
 *
 * Run with:  npm run prisma:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

const fromToday = (numDays: number): Date => {
  const d =
    numDays >= 0
      ? addDays(new Date(), numDays)
      : subDays(new Date(), Math.abs(numDays));
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

async function main() {
  console.log('🌱 Seeding database…');

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      minBookingLength: 3,
      maxBookingLength: 30,
      maxGuestsPerBooking: 10,
      breakfastPrice: 15,
    },
  });

  const hashed = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@wilodoasis.com' },
    update: {},
    create: {
      email: 'admin@wilodoasis.com',
      password: hashed,
      fullName: 'Admin User',
    },
  });

  const cabinData = [
    {
      name: '001',
      maxCapacity: 2,
      regularPrice: 250,
      discount: 0,
      description: 'Cozy couples cabin nestled in the forest.',
    },
    {
      name: '002',
      maxCapacity: 2,
      regularPrice: 350,
      discount: 25,
      description: 'Romantic escape with private hot tub.',
    },
    {
      name: '003',
      maxCapacity: 4,
      regularPrice: 300,
      discount: 0,
      description: 'Comfortable family cabin for up to 4.',
    },
    {
      name: '004',
      maxCapacity: 4,
      regularPrice: 500,
      discount: 50,
      description: 'Luxury family retreat with gourmet kitchen.',
    },
    {
      name: '005',
      maxCapacity: 6,
      regularPrice: 350,
      discount: 0,
      description: 'Spacious group cabin with fireplace.',
    },
    {
      name: '006',
      maxCapacity: 6,
      regularPrice: 800,
      discount: 100,
      description: 'Premium large cabin with full amenities.',
    },
    {
      name: '007',
      maxCapacity: 8,
      regularPrice: 600,
      discount: 100,
      description: 'Grand cabin for large groups and families.',
    },
    {
      name: '008',
      maxCapacity: 10,
      regularPrice: 1400,
      discount: 0,
      description: 'Ultimate luxury grand cabin for 10 guests.',
    },
  ];

  const cabins = await Promise.all(
    cabinData.map((c) =>
      prisma.cabin.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      }),
    ),
  );

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
      nationality: 'Bolivia',
      nationalId: '0988520146',
      countryFlag: 'https://flagcdn.com/bo.svg',
    },
    {
      fullName: 'Jonathan Williams',
      email: 'jowi@gmail.com',
      nationality: 'United States',
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
  ];

  const guests = await Promise.all(
    guestData.map((g) =>
      prisma.guest.upsert({
        where: { email: g.email },
        update: {},
        create: g,
      }),
    ),
  );

  const breakfastPrice = 15;

  type BInput = {
    startDate: Date;
    endDate: Date;
    numNights: number;
    numGuests: number;
    cabinIdx: number;
    guestIdx: number;
    hasBreakfast: boolean;
    observations: string;
    isPaid: boolean;
    status: 'unconfirmed' | 'checked_in' | 'checked_out';
  };

  const bookingInput: BInput[] = [
    {
      startDate: fromToday(0),
      endDate: fromToday(7),
      numNights: 7,
      numGuests: 1,
      cabinIdx: 0,
      guestIdx: 1,
      hasBreakfast: true,
      observations: 'Gluten-free breakfast please.',
      isPaid: false,
      status: 'unconfirmed',
    },
    {
      startDate: fromToday(-23),
      endDate: fromToday(-13),
      numNights: 10,
      numGuests: 2,
      cabinIdx: 0,
      guestIdx: 2,
      hasBreakfast: true,
      observations: '',
      isPaid: true,
      status: 'checked_out',
    },
    {
      startDate: fromToday(12),
      endDate: fromToday(18),
      numNights: 6,
      numGuests: 2,
      cabinIdx: 0,
      guestIdx: 3,
      hasBreakfast: false,
      observations: '',
      isPaid: false,
      status: 'unconfirmed',
    },
    {
      startDate: fromToday(-45),
      endDate: fromToday(-29),
      numNights: 16,
      numGuests: 2,
      cabinIdx: 1,
      guestIdx: 4,
      hasBreakfast: false,
      observations: '',
      isPaid: true,
      status: 'checked_out',
    },
    {
      startDate: fromToday(15),
      endDate: fromToday(18),
      numNights: 3,
      numGuests: 2,
      cabinIdx: 1,
      guestIdx: 5,
      hasBreakfast: true,
      observations: '',
      isPaid: true,
      status: 'unconfirmed',
    },
    {
      startDate: fromToday(-2),
      endDate: fromToday(0),
      numNights: 2,
      numGuests: 2,
      cabinIdx: 2,
      guestIdx: 8,
      hasBreakfast: false,
      observations: 'Bringing our small dog.',
      isPaid: true,
      status: 'checked_in',
    },
    {
      startDate: fromToday(-60),
      endDate: fromToday(-50),
      numNights: 10,
      numGuests: 4,
      cabinIdx: 3,
      guestIdx: 6,
      hasBreakfast: true,
      observations: '',
      isPaid: true,
      status: 'checked_out',
    },
    {
      startDate: fromToday(10),
      endDate: fromToday(20),
      numNights: 10,
      numGuests: 4,
      cabinIdx: 3,
      guestIdx: 7,
      hasBreakfast: false,
      observations: 'Anniversary trip.',
      isPaid: false,
      status: 'unconfirmed',
    },
    {
      startDate: fromToday(-3),
      endDate: fromToday(4),
      numNights: 7,
      numGuests: 6,
      cabinIdx: 4,
      guestIdx: 9,
      hasBreakfast: true,
      observations: '',
      isPaid: true,
      status: 'checked_in',
    },
    {
      startDate: fromToday(20),
      endDate: fromToday(30),
      numNights: 10,
      numGuests: 5,
      cabinIdx: 5,
      guestIdx: 0,
      hasBreakfast: true,
      observations: '',
      isPaid: false,
      status: 'unconfirmed',
    },
  ];

  for (const b of bookingInput) {
    const cabin = cabins[b.cabinIdx];
    const cabinPrice = cabin.regularPrice - cabin.discount;
    const extrasPrice = b.hasBreakfast
      ? b.numNights * b.numGuests * breakfastPrice
      : 0;
    const totalPrice = cabinPrice * b.numNights + extrasPrice;

    await prisma.booking.create({
      data: {
        startDate: b.startDate,
        endDate: b.endDate,
        numNights: b.numNights,
        numGuests: b.numGuests,
        status: b.status,
        totalPrice,
        cabinPrice: cabinPrice * b.numNights,
        extrasPrice,
        hasBreakfast: b.hasBreakfast,
        observations: b.observations,
        isPaid: b.isPaid,
        cabinId: cabin.id,
        guestId: guests[b.guestIdx].id,
      },
    });
  }

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(() => prisma.$disconnect());
