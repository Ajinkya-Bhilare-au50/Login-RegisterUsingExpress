create a login and register routes using passport,  passport-local, passpost-local-mongoose npm paackages

//Login Route

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

//Register Route

router.post('/register', (req, res) => {
    let { name, email, password, password2 } = req.body
    let errors = []

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    //Check pass length
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            //Set password to hashed
                            newUser.password = hash
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/login')
                                })
                                .catch(err => console.log(err))
                        })
                    )
                }
            })
    }
})
