import { prisma } from "@/config";

async function getRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId }
  });
}

const roomRepository = {
  getRoomById
};

export default roomRepository;
