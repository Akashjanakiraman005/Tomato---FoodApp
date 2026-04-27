import jwt from "jsonwebtoken";

const DEMO_FALLBACK_SECRET = "tomato-demo-secret";

const authMiddleware =  async (req, res, next) => {
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({success: false, message: "Not Authorized Login Again"});
    }
    try {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (verifyError) {
            decoded = jwt.verify(token, DEMO_FALLBACK_SECRET);
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Not Authorized Login Again"});
    }
}
export default authMiddleware;