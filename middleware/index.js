var Resturant = require("../models/resturant");
var Comment = require("../models/comment");

// All the middleware
middlewareObj={}
middlewareObj.checkResturantOwnership = function (req, res, next){
if(req.isAuthenticated()){
	Resturant.findById(req.params.id, function(err, foundResturant){
		if(err || !foundResturant){
			req.flash("error", "Resturant Review Not Found!");
		res.redirect("back");
		}else{
			//does the user own the resturant
			if(foundResturant.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error", "You can't alter this review");
				res.redirect("back");
			}
			
		}
	});
	
		
	}else{
		req.flash("error", "Please log in first");
		res.redirect("back");
	}
}



//Comments middleware

middlewareObj.checkCommentOwnership =function (req, res, next){
if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			
			req.flash("error", "Comment not found!");
		res.redirect("/resturants");
		}else{
			//does the user own the resturant
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error", "You can't alter this comment");
				res.redirect("back");
			}
			
		}
	});
	
		
	}else{
		req.flash("error", "Please log in first");
		res.redirect("back");
	}
}



// Is Loggedin middleware

middlewareObj.isLoggedIn =function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please log in first");
    res.redirect("/login");
}




module.exports = middlewareObj