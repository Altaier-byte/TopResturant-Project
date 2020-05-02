var mongoose = require("mongoose");

//***************
//Comment schema
//***************
var commentSchema = mongoose.Schema({
	text:String,
	createdAt: { type: Date, default: Date.now },
	author:{
		id:{type: mongoose.Schema.Types.ObjectId,
		ref: "User"
		   },
	
		username:String,
	}
	});





//module.exports
module.exports = mongoose.model("Comment", commentSchema);