import User from "../models/userModel.js";
import * as utils from "../utils/index.js";
import { nanoid } from "nanoid";
import { revokeTokenModel } from "../models/revokeTokenModel.js";
class UserController {
    createUser = async (req, res) => {
        const tokenId = nanoid()
        const { email, password } = req.body;
        const passwordHash = await utils.HT.hash({ plainText: password });
        const user = await User.create({
            email,
            password: passwordHash
        });
        const accessToken = utils.VT.generateAccessToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
        const refreshToken = utils.VT.generateRefreshToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
        res.status(201).json({
            message: "User created successfully",
            accessToken,
            refreshToken
        });
    }
    login = async (req, res) => {
        const { email, password } = req.body;
        const tokenId = nanoid()
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isPasswordValid = await utils.HT.compareHash({ plainText: password, cypherText: user.password });
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        const accessToken = utils.VT.generateAccessToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
        const refreshToken = utils.VT.generateRefreshToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
        res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken
        });
    }
    logout = async (req, res) => {
        const { authorization: token } = req.headers
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const tokenId = req.user.jti
        await revokeTokenModel.findOneAndUpdate(
            { tokenId },
            { tokenId, expiredAt: new Date() },
            { upsert: true, new: true }
        )
        res.status(200).json({
            message: "User logged out successfully"
        })
    }
    refreshToken = async (req, res) => {
        const { authorization: token } = req.headers
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        utils.VT.verifyRefreshToken(token, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            const user = await User.findById(decoded.id)
            if (!user) {
                return res.status(404).json({ message: "User Not Found" })
            }
            const isRevoked = await revokeTokenModel.findOne({ tokenId: decoded.jti })
            if (isRevoked) {
                return res.status(403).json({
                    message: "Please login again"
                })
            }
            const userTokenId = decoded.jti
            const tokenId = nanoid()
            await revokeTokenModel.findOneAndUpdate(
                { tokenId: userTokenId },
                { tokenId: userTokenId, expiredAt: new Date() },
                { upsert: true, new: true }
            )
            const accessToken = utils.VT.generateAccessToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
            const refreshToken = utils.VT.generateRefreshToken({ _id: user._id, email: user.email, role: user.role }, tokenId);
            res.status(200).json({
                message: "Token refreshed successfully",
                accessToken,
                refreshToken
            });
        })
    }
}

const userController = new UserController();
export default userController;
