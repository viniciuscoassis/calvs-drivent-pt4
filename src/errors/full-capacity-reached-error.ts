import { ApplicationError } from "@/protocols";

export function fullCapacityReachedError(): ApplicationError {
  return {
    name: "fullCapacityReached",
    message: "Rooms full capacity reached!",
  };
}
