import express from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (request,response,next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return response.status(401).json({error :"No token Provided"});
    }
    jwt.verify(token,'privatesecretkey123',(error,decode) => {
        if(error){
            console.log(error);
            return response.status(403).json({error : "Failed to authenticate token"});
        }
        request.userId = decode.userId;
        next();
    });
};

export default verifyToken;
