import Payment from "../models/Payment.js";
import { generatePayUHash, verifyPayUHash } from "../utils/payuHash.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;

    const txnid = crypto.randomBytes(16).toString("hex");
    const productinfo = "Form Payment";

    // Save transaction
    await Payment.create({
      txnid,
      name,
      email,
      phone,
      amount,
      status: "PENDING"
    });

    const hash = generatePayUHash({
      key: process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname: name,
      email,
      salt: process.env.PAYU_SALT
    });

    res.json({
      payuData: {
        key: process.env.PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo,
        firstname: name,
        email,
        phone,
        surl: `${process.env.BACKEND_URL}/api/payment/success`,
        furl: `${process.env.BACKEND_URL}/api/payment/failure`,
        hash
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Payment creation failed" });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const payuResponse = req.body;
    const { txnid, status, email, amount, hash } = payuResponse;

    const hashString = `${process.env.PAYU_SALT}|${status}|||||||||||${email}|${payuResponse.firstname}|${payuResponse.productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;

    const calculatedHash = verifyPayUHash(hashString);

    if (calculatedHash !== hash) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }

    await Payment.findOneAndUpdate(
      { txnid },
      { status: "SUCCESS", payuResponse }
    );

    res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};

export const paymentFailure = async (req, res) => {
  try {
    const { txnid } = req.body;

    await Payment.findOneAndUpdate(
      { txnid },
      { status: "FAILED", payuResponse: req.body }
    );

    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
};
