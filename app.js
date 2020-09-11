require('dotenv').config();
const express              =require("express"),
	  app                  =express(),
	  mongoose             =require("mongoose"),
	  bodyParser           =require("body-parser"),
	  passport             =require('passport'),
	  LocalStrategy        =require('passport-local'),
	  passportLocalMongoose=require('passport-local-mongoose'),
	  User                 =require('./models/user'),
//	  seedDB               =require('./seed'),
	  flash                =require('connect-flash'),
	  Camp                 =require("./models/campgrounds"),
	  Comment              =require('./models/comments'),
	  methodOverride       =require('method-override');
  
//requiring routes
const indexRouter          =require('./routes/index');
const campRouter           =require('./routes/campground');
const commentRouter        =require('./routes/comments');

app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
	console.log("connected to db");
	app.listen(process.env.PORT || 3000, () =>{
		console.log("server running");
	});
}).catch(err =>{
    console.log("error", err.message);
});
//seedDB();
//app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
	secret:'makes no sense',
	resave:false,
	saveUninitialized:false
}));
//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser= req.user;
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');

	next();
});

//using them
app.use(indexRouter);
app.use('/clist',campRouter);
app.use('/clist/:id/comment',commentRouter);
