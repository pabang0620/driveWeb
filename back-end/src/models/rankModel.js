const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllRankings() {
  return await prisma.ranking.findMany();
}

async function updateRankingModel(id, updateData) {
  //   console.log(updateData);
  try {
    const updatedRanking = await prisma.ranking.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    return updatedRanking;
  } catch (error) {
    throw new Error(`랭킹 업데이트 중 오류 발생: ${error.message}`);
  }
}

module.exports = {
  getAllRankings,
  updateRankingModel,
};
