import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  
  try {
    const reserveFromId = await bookingService.listReserve(userId);

    return res.status(httpStatus.OK).send(reserveFromId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const userId = req.userId;

  if(!roomId) return res.sendStatus(httpStatus.FORBIDDEN);

  try {
    const created = await bookingService.createReserve(userId, Number(roomId));
    return res.status(httpStatus.OK).send({ bookingId: created.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const roomId = req.body.roomId;
  const bookingId = req.params.bookingId;
  const userId = req.userId;
  if(!roomId || !bookingId) return res.sendStatus(httpStatus.FORBIDDEN);
  try {
    const updated = await bookingService.changeReserve(Number(bookingId), roomId, userId);

    return res.status(httpStatus.OK).send({ bookingId: updated.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
