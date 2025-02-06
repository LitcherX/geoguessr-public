// utils/jwt.js
import jwt from "jsonwebtoken";
const key = process.env.JWT_SECRET_KEY;
export function generateToken(userId) {
    try {
        const token = jwt.sign({ userId: userId }, key, {
            expiresIn: "1h",
        });
        return token;
    } catch (error) {
        console.error("Error generating token: ", error);
        return null;
    }
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, key);
    } catch (error) {
        return null;
    }
}
