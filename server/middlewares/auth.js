import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
      }

      req.clientId = payload.userid;
console.log(payload);

      next();
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
