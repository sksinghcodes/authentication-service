import { PoolClient } from "pg";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import cryptoService from "./crypo.service.js";

const deleteByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  await refreshTokenRepository.deleteByTokenHash(tokenHash, client);
};

const refreshTokenService = {
  deleteByToken,
};

export default refreshTokenService;
