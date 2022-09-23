const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypte = require('bcryptjs');

const user = require('../Model/user');
const bcrypte = require('bcryptrjs/dist/bcrypt');

router.post('/register', async (req, res) => {
    const usermail = await user.findOne({ email: req.body.email });
    if (usermail !== null) {
        return res.status(400).json({ message: 'Ce mail existe deja!' })
    }

    const salt = bcrypte.genSaltSync(10);
    const Hach = bcrypte.hashSync(req.body.password, salt);
    const userdata = req.body;
    userdata.password = Hach;

    const createuser = await user.create(userdata);
    res.json(createuser);
})

router.post('/login', async (req, res) => {
    const usermail = await user.findOne({ email: req.body.email });
    if (usermail === null) {
        return res.status(400).json({ message: 'Email invalid!' })
    } else {
        if (!bcrypte.compareSync(req.body.password, usermail.password)) {
            return res.status(400).json({ message: 'Password Invalid!' })
        } else {
            const data = {
                email: usermail.email,
                userID: usermail._id
            };
            const Newtoken = jwt.sign(data, 'secret', { expiresIn: '1h' })
            return res.status(201).json({ message: 'Login succfuly !', token: Newtoken });
        }
    }
})

module.exports = router;