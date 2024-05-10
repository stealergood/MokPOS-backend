import jwt from 'jsonwebtoken';

export const AuthVerify = (req, res, next) => {
    const header = req.header('Authorization');
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Authorization" });
        req.user = user;
        next();
    });
}