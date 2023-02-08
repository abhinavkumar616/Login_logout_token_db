const express = require("express")
const Logout = require("./models/Logout")
require("./dbConnect")
const app = express()
app.use(express.json())
const jwt = require('jsonwebtoken');



// async function authenticateToken(req, res, next) {
//     try {
//         var token = req.headers.authorization
//         var user = await Logout.findOne({ username: req.headers.username })

//         if (token && user) {
//             if (jwt.verify(token, "AzQ,PI)0")) {
//                 if (user.token.find((item) => item == token)) {
//                     next()
//                 }
//                 else {
//                     res.status(401).send({
//                         result: "Fail",
//                         message: "You Logged Out!"
//                     })
//                 }
//             }
//             else {
//                 res.status(401).send({
//                     result: "Fail",
//                     message: "token......You Are Not Authorized to Access this API!!!"
//                 })
//             }
//         }
//         else {
//             res.status(401).send({
//                 result: "Fail",
//                 message: "token & user...You Are Not Authorized to Access this API!!!"
//             })
//         }

//     }
//     catch (error) {
//         res.status(500).send({
//             result: "Fail",
//             message: "Internal Server Error",
//             error: error.message
//         })
//     }
// }

async function authenticateToken(req, res, next) {

    try {

        let token = req.headers.authorization.split(' ')[1]
        let decode = jwt.verify(token, 'AzQ,PI)0')

        req.user = decode
        // req.user = await loginToken.findById(decode._id);
        next()
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).json({
                message: "Session expired, Kindly login again !"
            })
        } else {
            res.json({
                message: 'Authentication Failed'
            })
        }
    }
}


// API

app.post("/api", async (req, res) => {
    try {
        var data = new Logout({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            username: req.body.username
        })
        await data.save()
        res.send({
            message: "success",
            data: data
        })
    }
    catch (error) {
        res.status(500).send({
            result: "Fail",
            message: "Internal Server Error",
            error: error.message
        })
    }
})

app.post("/api/login", async (req, res) => {
    try {
        // var username1=req.body.username

        var data = await Logout.findOne({ username: req.body.username })
        if (data) {
            if (req.body.password === data.password) {
                // var obj = { ...data }
                jwt.sign({name:data.name}, "AzQ,PI)0", { expiresIn: '5m' }, async (error, token) => {
                    console.log(data)
                    // data.tokens.push(token)
                    // data.tokens=token
                    console.log("Token", token)
                    // await data.save()
                    // await Logout.updateOne({ username: req.body.username }, { $pull: { tokens: { $in: data.tokens } } })
                    Logout.findOneAndUpdate({ username: req.body.username }, { $set: { tokens: token } }, function (err, doc) {
                            if (err) { throw err; }
                            else {
                                console.log("tokensss",token);
                                res.send({
                                    data: token
                                })
                            }
                        })

                //    await Logout.findOne({ username: req.body.username })
                //     // console.log('sssssssss', data1.tokens)
                //     res.send({
                //         data:data
                //     })
                })
            }
            else {
                res.send({
                    message: "password doesnot matched"
                })
            }
        }
        else {
            res.send({
                message: "fail no data founds"
            })
        }
    }
    catch (error) {
        res.status(500).send({
            result: "Fail",
            message: "Internal Server Error",
            error: error.message
        })
    }
})


app.post("/logout", async (req, res) => {

    try {
        var data = await Logout.findOne({ username: req.body.username })
        if (data) {
            // data.tokens = []
            Logout.findOneAndUpdate({ username: req.body.username }, { $unset: { tokens: ""} }, function (err, doc) {
                if (err) { throw err; }
                else {
                    res.send({
                        result: "Done",
                        message: "you logged Out, kindly Login again!!!!"
                    })
                }
            })
           
        }
        else {
            res.send({
                result: "Fail",
                message: "User not found"
            })
        }

    }
    catch {
        res.send({
            result: "Fail",
            message: "Inteernal Server Errors",
            error: error.message
        })
    }

})

app.post("/loginDetails", authenticateToken, async (req, res) => {
    try {
        var data = await Logout.findOne({ username: req.body.username })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.send({
                result: "Fail",
                message: "Data does not matched"
            })
        }
    }
    catch (error) {
        res.send({
            result: "Fail",
            message: "Inteernal Server Errors",
            error: error.message
        })
    }
})


app.listen(8000, () => {
    console.log("server is running on port 8000");
})