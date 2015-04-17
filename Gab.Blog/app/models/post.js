var docooment = require('docooment');

var Schema = docooment.Schema;

var getTags = function(tags) {
    return tags.join(',');
}

var setTags = function(tags) {
    return tags.split(',');
}

var CommentSchema = new Schema({
    body : { type : String },
    user : { type : String },
    createdAt : { type : Date, default : Date.now }
});

var PostSchema = new Schema({
    id : { type : String },
    title: { type : String },
    body : { type: String },
    user : { type: String },
    createdAt : { type : Date, default : Date.now },
    comments : [CommentSchema],
    tags: { type : [], get : getTags, set : setTags },
    _self : { type : Object }
});

PostSchema.methods = {
    addComment : function(user, comment) {
        this.comments.push({
            body : comment.body,
            user : user
        });
    }
}

module.exports = docooment.model('Post', PostSchema);