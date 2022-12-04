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
    if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomId = req.body.roomId as number;
  const userId = req.userId;

  try {
    const created = await bookingService.createReserve(roomId, userId);
    return res.status(httpStatus.OK).send(created.id);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const roomId = req.body.roomId;
  const bookingId = req.params.bookingId;
  const userId = req.userId;

  try {
    const updated = await bookingService.changeReserve(Number(bookingId), roomId, userId);

    return res.status(httpStatus.OK).send(updated.id);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name === "fullCapacityReached")
      return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
