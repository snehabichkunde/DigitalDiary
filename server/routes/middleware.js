export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Authorization header missing or invalid" });
    }
    console.log("Token Decoded:", req.user);

  
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Assign decoded token to request
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
  