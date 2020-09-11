const mongoose=require('mongoose');

const campSchema=new mongoose.Schema({
	name:String,
	image:String,
	content:String,
	phone:Number,
	start:String,
	end:String,
	
	cost:{ type:Number,
		  default:9
		 },
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'comment'
	}],
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'user'
		},
		username:String
	}

});
 module.exports=mongoose.model("camp", campSchema);