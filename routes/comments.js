const express=require('express');
const router=express.Router({mergeParams:true});
const Comment=require('../models/comments');
const Camp=require('../models/campgrounds');
const middleware=require("../middleware");



router.get('/new',middleware.isLoggedIn,(req, res) =>{
	Camp.findById(req.params.id, (e, cg) =>{
		if(e || !cg){
			req.flash("error","Campground not found");
			res.redirect("/clist");
		}
		else{
			res.render('newcomm',{a:req.params.id});	
		}
	});
	
});
router.post('/',middleware.isLoggedIn,(req, res) =>{
	//eval(require('locus'));
	Camp.findById(req.params.id, (err,cg ) =>{
		if(err || !cg){
			req.flash("error" ,"Campground not found");
			return res.redirect('/clist/'+req.params.id);
		}
		Comment.create(req.body.comment, (e, c) =>{
			if(e){
				req.flash("error" ,e.message);
				res.redirect('/clist'+req.params.id);
			}
			c.author.username=req.user.username;
			c.author.id=req.user._id;
			c.save();
			cg.comments.push(c);
			cg.save();
			return res.redirect('/clist/'+req.params.id);
		});
	});
});
router.get('/:comment_id/edit',middleware.isCommentAuthor, (req, res) =>{
	Comment.findById(req.params.comment_id, (err, c) =>{
		if(err || !c)
			res.redirect("back");
		else
			res.render('editcomment',{cg_id:req.params.id, comment:c});
	});
	
});
router.put("/:comment_id",middleware.isCommentAuthor, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, c)=>{
		if(err || !c){
			req.flash("error","Some error occured");
			res.redirect('back');
		}
		else
			res.redirect('/clist/'+req.params.id);
	});
});
router.delete("/:comment_id", middleware.isCommentAuthor, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err, c) =>{
		if(err || !c){
			req.flash("error", "Can't delete");
			res.redirect('back');
		}
		else{
			req.flash("success" ,"Deleted successfully");
			res.redirect("/clist/"+req.params.id);
		}
	});
	
});
module.exports= router;
