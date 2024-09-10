const got = require("got");
// npm install got@11 기존의 require('got') 구문을 그대로 사용할 수 있.
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
