import { prisma } from "@/config";

export async function createBookingUsingUserIdRoomId(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId }
  });
}
