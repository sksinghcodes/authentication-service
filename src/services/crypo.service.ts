import crypto from "node:crypto";

const hash = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const cryptoService = {
  hash,
  generateToken,
};

export default cryptoService;
