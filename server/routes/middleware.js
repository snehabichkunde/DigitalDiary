// middleware.js
import jwt from "jsonwebtoken";
const jwtSecret = "sneha's_dairy.jwtsecrt"; 

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token in middleware:", token); 

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};