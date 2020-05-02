var mongoose = require("mongoose");

//*************
//Schema Setup
//*************

var resturantSchema = new mongoose.Schema({
   name: String,
	price:String,
   image: String,
	createdAt: { type: Date, default: Date.now },
   description: String,
	
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String,
	},
	comments:[{
		type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
	}]
	
});



module.exports = mongoose.model("Resturant", resturantSchema);
