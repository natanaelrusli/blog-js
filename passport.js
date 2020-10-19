const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

// Load user model
const User = require('./models/User')


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' },(email, password, done) => {
            // Match user
            User.findOne({ email: email })
                .then(user => {
                    if(!user){
                        return done(null, false, { message: 'Email not registered' })
                    }

                    // Match password
                    if (user.password == password) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Incorrect Password' })
                    }
                })
                .catch(err => console.log(err))
        })
    )
}