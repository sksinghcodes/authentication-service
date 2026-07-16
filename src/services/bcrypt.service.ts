import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/env.js";

const hash = (text: string): Promise<string> => {
  return bcrypt.hash(text, SALT_ROUNDS);
};

const compare = (plainText: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};

const bcryptService = {
  hash,
  compare,
};

export default bcryptService;
