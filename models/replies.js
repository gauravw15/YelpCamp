var mongoose = require('mongoose');
var ReplySchema = new mongoose.Schema({
    text: String,
    author :{ 
       id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            },
       username: String
    }
}),

Reply = mongoose.model("Replies", ReplySchema);

module.exports = Reply;