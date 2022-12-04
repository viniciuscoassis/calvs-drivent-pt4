import { notFoundError } from "@/errors";
import { cannotPostBookingError } from "@/errors/cannot-post-booking-error";
import { fullCapacityReachedError } from "@/errors/full-capacity-reached-error";
import bookingRepository, { BookingId } from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Room } from "@prisma/client";

async function checkBeforePostBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
 
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
 
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotPostBookingError();
  }
  
  await checkRoomAvailability(roomId);
}

async function checkRoomAvailability(roomId: number) {
  const room = await roomRepository.getRoomById(roomId);
 
  if(!room) {
    throw notFoundError();
  }

  const quantityTaken = await bookingRepository.findRoomsTakenQuantity(roomId);
  if(room.capacity === quantityTaken) {
    throw fullCapacityReachedError();
  }
}

async function listReserve(userId: number): Promise<BookingId & {Room: Room}> {
  const reservation = await bookingRepository.findReserveByUserId(userId);
  if(!reservation) {
    throw notFoundError();
  }
  delete reservation.createdAt;
  delete reservation.roomId;
  delete reservation.updatedAt;
  delete reservation.userId;
  return reservation;
}

async function createReserve(userId: number, roomId: number ) {
  await checkBeforePostBooking(userId, roomId);
  const body = { userId, roomId };
  const created = await bookingRepository.createBooking(body);
  return created;
}

async function changeReserve(bookingId: number, roomId: number, userId: number) {
  await checkRoomAvailability(roomId);

  const reservation = await bookingRepository.findReserveByUserId(userId);
  if(!reservation) {
    throw notFoundError();
  }

  const updated = await bookingRepository.updateBookingById(bookingId, { userId, roomId, updatedAt: new Date() });
  return updated;
}

const bookingService = {
  listReserve, createReserve, changeReserve
};

export default bookingService;
