var express = require("express");
var router =  express.Router({mergeParams: true});
var Resturant = require("../models/resturant");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//****************
//Comments Routes
//****************


//Show comments form
router.get("/new",middleware.isLoggedIn,function(req, res){
	Resturant.findById(req.params.id, function(err, resturant){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {resturant:resturant});
		}
	});
});

//adding comments logic
router.post("/",middleware.isLoggedIn,function(req,res){
	//find resturant by id
	Resturant.findById(req.params.id, function(err, resturant){
		if(err){
			console.log(err)
			res.redirect("/resturants");
		}else{
			//creating a new comment
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					req.flash("error", "Opps SomethingWent Wrong");
					console.log(err);
				}else{ 
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					resturant.comments.push(comment);
					
					resturant.save();
					res.redirect("/resturants/" + resturant._id);
				}
			})
		}
	});
	
});

//edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
	Resturant.findById(req.params.id, function(err, foundResturant){
		if(err || !foundResturant){
			req.flash("error", "Resturant Review Not Found!");
			return res.redirect("/resturants")
		}
		Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err ){
			res.redirect("/resturants");
		}else{
res.render("comments/edit",{resturant_id:req.params.id, comment:foundComment});			
		}
	});
	});
	
	
	
	


});


//Update Comment

router.put("/:comment_id",middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/resturants/"+ req.params.id);
		}
	} )
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/resturants/" + req.params.id);
       }
    });
});






module.exports = router;