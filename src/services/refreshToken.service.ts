import { PoolClient } from "pg";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import cryptoService from "./crypo.service.js";

const deleteByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  await refreshTokenRepository.deleteByTokenHash(tokenHash, client);
};

const findByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  return await refreshTokenRepository.findByTokenHash(tokenHash, client);
};

const revokeByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  await refreshTokenRepository.revokeByTokenHash(tokenHash, client);
};

const refreshTokenService = {
  deleteByToken,
  findByToken,
  revokeByToken,
};

export default refreshTokenService;
