import { paypalClient } from "../config/payPal.js";
import paypal from "@paypal/checkout-server-sdk";

export const createOrder = async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "0.02"
        }
      }
    ]
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({
      status: "order-created",
      id: order.result.id,
      links: order.result.links
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const captureOrder = async (req, res) => {
  const { orderId } = req.params;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({
    payment_source: {
      paypal: {
        email_address: "sb-f843go47165573@business.example.com"
      }
    }
  });

  try {
    const capture = await paypalClient.execute(request);
    res.json({ status: "success", capture: capture.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: JSON.stringify(err.message) });
  }
};

export const createAndCaptureOrder = async (req, res) => {
  try {
    const createRequest = new paypal.orders.OrdersCreateRequest();
    createRequest.prefer("return=representation");
    createRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "0.02"
          }
        }
      ]
    });

    const order = await paypalClient.execute(createRequest);
    const orderId = order.result.id;

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({
      payment_source: {
        paypal: {
          email_address: "sb-buyer@example.com"
        }
      }
    });

    const capture = await paypalClient.execute(captureRequest);

    res.json({ status: "success", orderId, capture: capture.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: JSON.stringify(err.message) });
  }
};