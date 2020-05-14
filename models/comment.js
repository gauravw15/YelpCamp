var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
    text: String,
    author :{ 
       id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
       username: String
    },
    replies: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Replies"
        }
    ]
}),

Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;