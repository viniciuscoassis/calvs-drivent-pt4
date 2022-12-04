import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

async function findReserveByUserId(userId: number): Promise<Booking & {Room: Room}> {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true }
  });
}

export type BookingId = Pick<Booking, "id">

async function createBooking(body: CreateBooking) {
  return prisma.booking.create({
    data: body
  });
}
type CreateBooking = Omit<Booking, "id" | "createdAt"| "updatedAt" >

async function updateBookingById(bookingId: number, body: toUpdateBooking) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: body
  });
}

type toUpdateBooking = Omit<Booking, "id" | "createdAt" >

async function findRoomsTakenQuantity(roomId: number) {
  return prisma.booking.count({
    where: { roomId }
  });
}

const bookingRepository = {
  findReserveByUserId, createBooking, updateBookingById, findRoomsTakenQuantity
};

export default bookingRepository;
