-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "created_by_id" TEXT;

-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "gender" TEXT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
