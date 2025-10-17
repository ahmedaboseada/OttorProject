import * as VT from "../utils/token/verifyToken.js"
import userModel from "../models/userModel.js"
import {revokeTokenModel} from "../models/revokeTokenModel.js"

export const verifyToken = (req, res, next) => {
    const { authorization:token } = req.headers
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

        VT.verifyAccessToken(token, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            const user = await userModel.findById(decoded.id)
            if (!user) {
                return res.status(404).json({ message: "User Not Found" })
            }
            const isRevoked = await revokeTokenModel.findOne({ tokenId: decoded.jti })
            if (isRevoked) {
                return res.status(403).json({
                    message: "Please login again"
                })
            }
            req.user = decoded
            next()
        })

}