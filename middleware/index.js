const Camp=require('../models/campgrounds'),
	  Comment=require("../models/comments");

let middlewareObj ={};
//middleware
middlewareObj.isLoggedIn= (req, res, next) =>{	
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "Please Login first");
		res.redirect('/login');
	}
}
middlewareObj.isAuthor =(req, res, next) =>{
	if(req.isAuthenticated()){
	//	console.log("1");
		Camp.findById(req.params.id,(err,cg) =>{
			if(err){
				req.flash("error" ,err.message);
				res.redirect('back');
			}
			else{
				if(!cg){
					req.flash("error" ,"Campground not found");
					return res.redirect('back');
				}
				else if(cg.author.id.equals(req.user._id))
					return next();
				else 
					{
						req.flash("error", "You are not authorized to do that");
						res.redirect("back");
					}
			}
		});
	}
	else{
	req.flash("error", "Please Login first");
	res.redirect('/login');
	}
}
middlewareObj.isCommentAuthor =(req, res, next) =>{
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, (e, cg) =>{
			if(e){
				req.flash("error" ,err.message);
				return res.redirect('back');	
			}
			else if(!cg){
					req.flash("error" ,"Campground not found");
					return res.redirect('/clist');	
			}
			Comment.findById(req.params.comment_id ,(err, c) =>{
				if(err){
				req.flash("error" ,err.message);
				return res.redirect('/clist');	
				}
				else if(!c){
					req.flash("error" ,"Comment not found");
					return res.redirect("/clist");	
					}
				else{
					if(c.author.id.equals(req.user._id))
						return next();
					else
						{
						req.flash("error", "You are not authorized to do that");
						res.redirect("back");
					}
				}
			});	
		});
		
	}else{
		req.flash("error", "Please Login first");
		res.redirect("back");
	}
}


module.exports= middlewareObj;