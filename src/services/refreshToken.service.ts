import { PoolClient } from "pg";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import cryptoService from "./crypo.service.js";
import { RefreshTokenStoreServiceInput } from "../types/token.type.js";

const deleteByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  await refreshTokenRepository.deleteByTokenHash(tokenHash, client);
};

const findByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  return refreshTokenRepository.findByTokenHash(tokenHash, client);
};

const revokeByToken = async (token: string, client?: PoolClient) => {
  const tokenHash = cryptoService.hash(token);
  await refreshTokenRepository.revokeByTokenHash(tokenHash, client);
};

const store = async (
  tokenInput: RefreshTokenStoreServiceInput,
  client?: PoolClient,
) => {
  const tokenHash = cryptoService.hash(tokenInput.tokenInfo.value);
  await refreshTokenRepository.create(
    {
      user_id: tokenInput.userId,
      token_hash: tokenHash,
      expires_at: tokenInput.tokenInfo.expiresAt,
      created_at: tokenInput.tokenInfo.issuedAt,
      device_info: tokenInput.deviceInfo,
      user_agent: tokenInput.userAgent,
      ip_address: tokenInput.ipAddress,
    },
    client,
  );
};

const refreshTokenService = {
  store,
  deleteByToken,
  findByToken,
  revokeByToken,
};

export default refreshTokenService;
