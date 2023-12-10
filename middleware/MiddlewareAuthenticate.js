const jwt = require("jsonwebtoken");

class MiddlewareAuthenticate {
  static authenticateToken(roles) {
    return function (req, res, next) {
      const tokenHeader = req.header("Authorization");

      if (tokenHeader && tokenHeader.startsWith("Bearer")) {
        const accessToken = tokenHeader.substring("Bearer".length);

        const secretKey = process.env.YOUR_SECRET_KEY;

        jwt.verify(accessToken, secretKey, (err, decoded) => {
          if (decoded) {
            if (Array.tsArray(roles)) {
              for (const role of roles) {
                if (decoded.role != role) {
                  next();
                }
              }
            } else if (decoded.role === roles) {
              next();
            } else {
              return res.status(403).json({ error: "У вас недостаточно прав" });
            }
          } else {
            return res.status(401).json({ error: "Токен недействителен" });
          }
        });
      } else {
        return res.status(401).json({ error: "Токен отсуствует" });
      }
    };
  }
}

module.exports = MiddlewareAuthenticate;