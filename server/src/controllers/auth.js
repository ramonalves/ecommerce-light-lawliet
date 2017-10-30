const jwt = require('jwt-simple');;
const User = require('../models/user');
const config = require('../../configs');

module.exports = function (app) {
    return {
        token: (req, res) => {
            let user = req.body;

            let query = {email: user.username, password: user.password};

            let callback = function (err, user) {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        err: err
                    });
                }

                if (!user) {
                    return res.status(401).send('Unauthorized');
                }

                let payload = {id: user.id};
                let token = jwt.encode(payload, config.jwrSecret);
                return res.json({token: token});
            }

            user = User.findOne(query, callback);
        },
        me: (req, res) => {
            res.status(200).json({
                status: true,
                user: req.user
            });
        },
        register: (req, res) => {
            let data = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            let callback = function (err, user) {
                if (err) {
                    return res.status(422).json({
                        status: false,
                        err: err
                    });
                }
                return res.status(200).json({
                    status: true,
                    data: user
                });
            }

            User.create(data, callback);
        },
        edit: (req, res) => {
            return res.json({page: 'auth@edit'});
        }
    }
}
