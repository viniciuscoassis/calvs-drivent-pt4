import { ApplicationError } from "@/protocols";

export function cannotPostBookingError(): ApplicationError {
  return {
    name: "cannotPostBookingError",
    message: "Cannot post booking!",
  };
}
