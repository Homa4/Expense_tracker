import jwt from "jsonwebtoken";

export function middleware(req, res, next) {
  if (req.path.startsWith("/auth")) {
    return next();
  }

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    console.log(process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
}
