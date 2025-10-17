import jwt from "jsonwebtoken"

export const generateAccessToken = (payload,tokenId, length = '1h') => {
    return jwt.sign({ id: payload._id, email:payload.email, role:payload.role }, process.env.JWT_ACCESS, { expiresIn: `${length}`,jwtid:tokenId })
}

export const generateRefreshToken = (payload, tokenId, length = '7d') => {
    return jwt.sign({ id: payload._id, email:payload.email, role:payload.role }, process.env.JWT_REFRESH, { expiresIn: `${length}`,jwtid:tokenId })
}
