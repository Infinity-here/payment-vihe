import crypto from "crypto";

export const generatePayUHash = ({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  salt,
}) => {
  const hashString =
    `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}` +
    `|||||||||||${salt}`;

  return crypto.createHash("sha512").update(hashString).digest("hex");
};

export const verifyPayUHash = (hashString) => {
  return crypto.createHash("sha512").update(hashString).digest("hex");
};
