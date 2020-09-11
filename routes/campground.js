const express=require('express');
const router=express.Router({mergeParams:true});
const Camp=require('../models/campgrounds');
const Comment=require('../models/comments');
const middleware=require('../middleware');

//list routes
router.get('/', (req, res) =>{
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Camp.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Camp.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("camp", {
                    c: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });

	// Camp.find({},(err, c) =>{
	// res.render('camp', {c:c});
	// });
});

router.get('/new',middleware.isLoggedIn, (req, res) =>{
	res.render('new');
});

router.post('/', middleware.isLoggedIn, (req, res) =>{
 	//eval(require('locus'));
	Camp.create(req.body.camp,(err,cg) =>{
		if(err || !cg)
			req.flash("error" ,"Can't create campground");
		else{
		cg.author.id=req.user._id;
		cg.author.username=req.user.username;
		cg.save();
		}
	});
	res.redirect('/clist');
});
router.get('/:id',(req, res) =>{
	//console.log("here we are");
	//eval(require('locus'));
	Camp.findById(req.params.id).populate("comments likes").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
			req.flash("error","Campground not found");
			return res.redirect("/clist");
        } else {
            //console.log(foundCampground)
            //render show template with that campground
            res.render("show", {c: foundCampground});
        }
    });
	
	
	// Camp.findById(req.params.id).populate('comments').exec((err, c)=>{
	// 	if(err || !c){
	// 		req.flash("error","Campground not found");
	// 		return res.redirect("/clist");
	// 	}
	// 	else 
	// 		res.render('show',{c:c});
	// });
});
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Camp.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/clist");
        }

        // check if req.user._id exists in foundCampground.likes
        let foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/clist");
            }
            return res.redirect("/clist/" + foundCampground._id);
        });
    });
});
 router.get('/:id/edit',middleware.isAuthor, (req, res) =>{
	 Camp.findById(req.params.id , (err, cg) =>{
		 if(err || !cg){
			req.flash("error","Campground not found");
			return res.redirect("/clist");
		 }
		 res.render('edit', {cg:cg});
	 });
 });
router.put('/:id',middleware.isAuthor, (req, res) =>{
	//eval(require('locus'));
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, cg) =>{
		if(err || !cg){
			req.flash("error","Campground not found");
			return res.redirect("/clist");
		}
		else 
			res.redirect('/clist/'+cg._id);
	});
});
router.delete('/:id',middleware.isAuthor, (req, res) =>{
	Camp.findByIdAndRemove(req.params.id, (err, cg) =>{
		if(err || !cg){
			req.flash("error","Campground not found");
			return res.redirect("/clist");
		}
		Comment.deleteMany({_id: {$in : cg.comments}}, (err) =>{
			if(err)
				res.redirect('/clist');
		});
		req.flash("success","Deleted successfully");
		res.redirect('/clist');
	});
});


module.exports=router;
