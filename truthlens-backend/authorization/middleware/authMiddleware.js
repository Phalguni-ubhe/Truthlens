const admin = require("../../firebase/firebaseConfig").admin;
async function verifyToken(req, res, next) {

    let authHeader = req.headers["authorization"];
    if(!authHeader || !(authHeader.startsWith("Bearer "))){
        return res.status(401).json({ error: "Unauthorized: No token provided"});
    }

    let token = authHeader.split(" ")[1];

    try{
        let decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }catch{
         return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}
module.exports = verifyToken;