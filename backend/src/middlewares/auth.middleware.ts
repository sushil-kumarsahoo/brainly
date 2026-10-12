import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authUser = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    
    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json({message: "Token missing"});
    }
    const token = header.split(' ')[1];
    if (!token) {
    return res.status(401).json({ message: "Token missing" });
}
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.userId = decoded.id; // attach to the request
        next();                   // go to the route handler
    } catch(error){
        res.status(401).json({message: "Invalid or expired token"});
    }
};

