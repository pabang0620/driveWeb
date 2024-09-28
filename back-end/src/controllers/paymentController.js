const got = require("got");
// npm install got@11 기존의 require('got') 구문을 그대로 사용할 수 있.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.confirmPayment = async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
  const encryptedSecretKey =
    "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

  try {
    const response = await got.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        json: {
          orderId: orderId,
          amount: amount,
          paymentKey: paymentKey,
        },
        responseType: "json",
      }
    );

    console.log(response.body);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.log(error.response.body);
    res.status(error.response.statusCode).json(error.response.body);
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  const { userId, orderId, amount, orderState, paymentDate, expirationDate } =
    req.body;

  try {
    // userId로 기존 결제 정보가 있는지 확인
    const existingPayment = await prisma.premium_payments.findFirst({
      where: {
        userId: Number(userId), // userId만으로 조회
      },
    });

    // 기존 결제 정보가 없으면 새로 생성 (POST)
    if (!existingPayment) {
      const newPaymentRecord = await prisma.premium_payments.create({
        data: {
          userId: Number(userId),
          orderId,
          amount: Number(amount),
          orderState: Number(orderState),
          paymentDate: new Date(paymentDate),
          expirationDate: new Date(expirationDate),
        },
      });

      return res.status(200).json({
        message: "결제 정보가 성공적으로 저장되었습니다.",
        paymentRecord: newPaymentRecord,
      });
    }

    // 기존 결제 정보가 있으면 만료일 연장 (PUT)
    const updatedExpirationDate = calculateNewExpirationDate(
      existingPayment.expirationDate, // 기존 만료일을 기준으로 연장
      orderState // 새로운 orderState를 기준으로 연장
    );

    // userId가 동일한 경우, 해당 기록을 업데이트
    const updatedPaymentRecord = await prisma.premium_payments.update({
      where: { id: existingPayment.id }, // 반드시 고유한 id로 업데이트
      data: {
        orderId, // 새로운 결제 정보로 업데이트
        amount: Number(amount),
        orderState: Number(orderState),
        paymentDate: new Date(paymentDate),
        expirationDate: new Date(updatedExpirationDate),
      },
    });

    return res.status(200).json({
      message: "기존 결제 정보가 업데이트되었습니다. 만료일이 연장되었습니다.",
      paymentRecord: updatedPaymentRecord,
    });
  } catch (error) {
    console.error("결제 정보 처리 오류:", error);
    return res.status(500).json({
      message: "결제 정보를 처리하는 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 새로운 만료일 계산 함수
function calculateNewExpirationDate(currentExpirationDate, orderState) {
  const expiration = new Date(currentExpirationDate);
  const lastDigit = Number(orderState.toString().slice(-1)); // orderState의 마지막 자리 기준

  if (lastDigit === 1) {
    expiration.setMonth(expiration.getMonth() + 1); // 1개월 연장
  } else if (lastDigit === 2) {
    expiration.setMonth(expiration.getMonth() + 6); // 6개월 연장
  } else if (lastDigit === 3) {
    expiration.setFullYear(expiration.getFullYear() + 1); // 12개월 연장
  }

  return expiration.toISOString(); // 연장된 만료일 반환
}
