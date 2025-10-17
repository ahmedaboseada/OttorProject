import jwt from 'jsonwebtoken'

export const verifyAccessToken = (token, cb) => {
    return jwt.verify(token, process.env.JWT_ACCESS,cb)
}

export const verifyRefreshToken = (token, cb) => {
    return jwt.verify(token, process.env.JWT_REFRESH,cb)
}
