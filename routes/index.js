const express=require('express');
const router=express.Router({mergeParams:true});
const passport=require('passport');
const User=require('../models/user');

//index route
router.get('/', (req, res) =>{
// 	res.render('home');
res.redirect('/clist');
});

//signup routes
router.get('/register' , (req, res) => {
	res.render('registration');
});
router.post('/register',(req, res) =>{
	User.register(new User({username:req.body.username}),req.body.password, (err, u) =>{
		if(err){
			req.flash("error", err.message);
			return res.redirect('/register'); //why return?
		}
		else{
			passport.authenticate("local")(req,res, ()=>{
				res.redirect('/clist');
			});
		}
	});
});
//login routes
router.get('/login',(req, res) =>{
	res.render('login');
});
router.post('/login', passport.authenticate('local',{
	successRedirect:'/clist',
	failureRedirect:'/login',
	failureFlash:   "Invalid username or password"
}),(req, res) =>{});
//logout routes
router.get('/logout',(req, res) =>{
	req.logout();
	req.flash("success" ,"Successfully Logged Out");
	res.redirect('/clist');
});
module.exports=router;