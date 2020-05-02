var express = require("express");
var router =  express.Router();
var Resturant = require("../models/resturant");
var middleware = require("../middleware");


//INDEX - show all Resturants
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Resturant.find({name: regex}, function(err, allResturants){
           if(err){
               console.log(err);
           } else {
              if(allResturants.length < 1) {
                  noMatch = "No Resturant Review match that query, please try again.";
              }
              res.render("resturants/index",{resturants:allResturants, noMatch: noMatch});
           }
        });
    } else {
        // Get all resturants from DB
        Resturant.find({}, function(err, allResturants){
           if(err){
               console.log(err);
           } else {
              res.render("resturants/index",{resturants:allResturants, noMatch: noMatch});
           }
        });
    }
});

	
//Add new Resturant to DB
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newResturant = {name: name, image: image, price:price, description: description, author:author}

	// Create a new resturant and save to DB
	Resturant.create(newResturant,function(err,newlyCreated){
	if(err){
		req.flash("error","You couldn't add a review");
		console.log(err);
	}else{
		req.flash("success", "You have successfully added a Resturant review");
		res.redirect("/resturants");
	}
});	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("resturants/new");
	
});

//Show More details about a Resturant review
router.get("/:id",function(req,res){
	Resturant.findById(req.params.id).populate("comments").exec(function(err,foundResturant){
		if(err || !foundResturant){
			req.flash("error", "Resturant Review Not Found!");
			res.redirect("/resturants");
		}else{
			res.render("resturants/show",{resturant:foundResturant});
		}
	});
	
	
});

// edit router
router.get("/:id/edit", middleware.checkResturantOwnership ,function(req, res){
	
	Resturant.findById(req.params.id, function(err, foundResturant){
		
	res.render("resturants/edit", {resturant:foundResturant});
		
	});
	});

//update router

router.put("/:id",middleware.checkResturantOwnership,function(req, res){
	//find and update the correct Resturant Review
	Resturant.findByIdAndUpdate(req.params.id, req.body.resturant, function(err, updatedResturant){
       if(err){
           res.redirect("/resturants");
       } else {
           //redirect somewhere(show page)
           res.redirect("/resturants/" + req.params.id);
       }
    });
});

// DESTROY resturant ROUTE
router.delete("/:id", middleware.checkResturantOwnership, function(req, res){
   Resturant.findByIdAndDelete(req.params.id, function(err){
      if(err){
          res.redirect("/resturants");
      } else {
          res.redirect("/resturants");
      }
   });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};






module.exports= router;