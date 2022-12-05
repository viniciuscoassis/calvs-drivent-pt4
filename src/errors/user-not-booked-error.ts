import { ApplicationError } from "@/protocols";

export function userNotBookedError(): ApplicationError {
  return {
    name: "userNotBookedError",
    message: "User needs to have a booking in order to change booking",
  };
}
