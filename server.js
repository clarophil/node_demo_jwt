const express = require('express')
const app = express()
const port = 8000
const jwt = require('jsonwebtoken');

function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        // Here we validate that the JSON Web Token is valid 
        jwt.verify(token,'test' ,(err, user) => {
            if (err) {  
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            console.log(user);
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
    }
}

app.get('/', (req, res) => res.send('Hello World!'))

// Get token
app.get('/jwt', (req, res) => {
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign({ "iduser": "stuff" }, 'test');
    res.send(token);
})

// let's first add a /secret api endpoint that we will be protecting
app.get('/secret', isAuthorized, (req, res) => {
    res.json({ "message" : "THIS IS SUPER SECRET, DO NOT SHARE!" })
})

// and a /readme endpoint which will be open for the world to see 
app.get('/readme', (req, res) => {
    res.json({ "message" : "This is open to the world!" })
})

app.listen(port, 
    () => console.log(`Simple Express app listening on port ${port}!`))