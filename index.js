const express = require("express")
const app = express()
const User = require("./src/database/User")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10

const JWTSecret = "asdfojnfawefnlhdshfolvnvdfvdfvapuhvoa"

app.use(express.json())
app.use(cors())

function authUser(req, res, next) {
    const authToken = req.headers['authorization']
    if (authToken != undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]

        jwt.verify(token, JWTSecret, (err, data) => {
            if (err) {
                res.status(401)
                res.json({ err: "token inválido" })
                res.send({ err: "token inválido" })
            } else {
                if (data.type == '2') {
                    req.token = token
                    req.loggedUser = {
                        id: data.id,
                        username: data.username,
                        type: data.type
                    }
                    next()
                } else {
                    res.status(401)
                    res.json({ err: "token invalido" })
                    res.send({ err: "token invalido" })
                }
            }
        })
    } else {
        res.status(401)
        res.json({ err: "token invalido" })
        res.send({ err: "token invalido" })
    }
}

app.post("/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const type = req.body.type

    User.findOne({ where: { username: username } }).then((err, user) => {
        if (user == undefined) {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                User.create({
                    username: username,
                    password: hash,
                    type: type
                }).then(() => {
                    res.send({ msg: "cadastrado com sucesso" })
                }).catch((err) => {
                    res.send(err)
                })
            })
        } else {
            res.send({ msg: "usuário já cadastrado" })
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if (user != undefined) {
            bcrypt.compare(password, result[0].password, (err, result) => {
                if (result) {
                    jwt.sign({ id: user.id, username: user.username, type: user.type }, JWTSecret, { expiresIn: '7d' }, (err, token) => {
                        if (err) {
                            res.status(400)
                            res.json({ err: "Falha interna" })
                        } else {
                            res.status(200)
                            res.json({ token: token })
                            res.send({ msg: "usuario logado" })
                        }
                    })
                } else {
                    res.status(401)
                    res.send({ msg: "senha incorreta" })
                }
            })
        } else {
            res.status(404)
            res.json({ err: "O usuário não foi encontrado" })
            res.send({ msg: "usuario não encontrado" })
        }
    }).catch((err) => {
        res.send(err)
    })
})

app.listen(3001, () => {
    console.log("rodando na porta 3001")
})