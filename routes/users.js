const router = require('express').Router();

const User = require('../models/User');

const passport = require('passport');

router.post('/login', passport.authenticate('local', {
    successRedirect: '/productos.html',
    failureRedirect: '/login.html',
    failureFlash: true
}));

router.post('/registro', async(req,res) =>{
    let errors= [];
    const{usuario, password, confirm_password} = req.body;

    if(usuario.length <=0 ){
        errors.push({text: 'Por favor ingrese su usuario'});
    }
    if(password != confirm_password){
        errors.push({text: 'La contraseña no coincide'});
    }
    if(password <4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});
    }
    if(errors.length>0){
        res.render('/public/signup.html', {errors});
    }else{
        const usuarioUser = await User.findOne({usuario: usuario});
        if(usuarioUser){
            req.flash('error_msg','Este usuario ya se encuentra registrado');
            res.redirect('/public/signup.html');
        }else{
            const newUser = new User({usuario, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Ha sido regsitrado');
            res.redirect('/login.html');
        }
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/login.html');
})

module.exports = router;