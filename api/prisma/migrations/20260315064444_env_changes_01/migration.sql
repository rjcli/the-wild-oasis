-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('unconfirmed', 'checked-in', 'checked-out');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabins" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "regular_price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "image" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cabins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" TEXT,
    "national_id" TEXT,
    "country_flag" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "num_nights" INTEGER NOT NULL,
    "num_guests" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'unconfirmed',
    "total_price" DOUBLE PRECISION NOT NULL,
    "cabin_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extras_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "has_breakfast" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "cabin_id" INTEGER NOT NULL,
    "guest_id" INTEGER NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "min_booking_length" INTEGER NOT NULL DEFAULT 1,
    "max_booking_length" INTEGER NOT NULL DEFAULT 365,
    "max_guests_per_booking" INTEGER NOT NULL DEFAULT 20,
    "breakfast_price" DOUBLE PRECISION NOT NULL DEFAULT 15,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cabins_name_key" ON "cabins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "guests_email_key" ON "guests"("email");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
