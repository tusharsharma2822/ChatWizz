import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import userModel from "../models/user.model.js";


export const authUser = async (req, res, next) => {
    try {
        let token = null;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch user from DB to get _id
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }
        req.user = user; // Attach full user object
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Unauthorized User' });
    }
}