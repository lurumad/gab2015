var DocumentClient = require('documentdb-q-promises').DocumentClientWrapper,
    shortid = require('shortid'),
    Post = require('../models/post'),
    q = require('q');

var PostDao = function(host, masterKey) {
    this.client = new DocumentClient(host, { masterKey: masterKey });
    this.databaseDefinition = { id: "blog" };
    this.collectionDefinition = { id: "posts" };
}

PostDao.prototype = {
    connect: function() {
        var self = this;

        this.client.readDatabases().toArrayAsync()
            .then(function (results) {
                if (results.feed.length === 0) {
                    self.client.createDatabaseAsync(self.databaseDefinition)
                        .then(function(databaseResponse) {
                            self.database = databaseResponse.resource;
                            return self.client.createCollectionAsync(self.database._self, self.collectionDefinition);
                        })
                        .then(function(collectionResponse) {
                            self.collection = collectionResponse.resource;
                        })
                        .fail(function(error) {
                            console.log("An error occured", error);
                        });
                } else {
                    for (var i = 0; i < results.feed.length; i++) {
                        if (results.feed[i].id === self.databaseDefinition.id) {
                            self.database = results.feed[i];
                            break;
                        }
                    }

                    self.client.readCollections(self.database._self).toArrayAsync()
                        .then(function (results) {
                            for (var i = 0; i < results.feed.length; i++) {
                                if (results.feed[i].id === self.collectionDefinition.id) {
                                    self.collection = results.feed[i];
                                    break;
                                }
                            }
                        });
                }  
            });
    },
    all: function(callback) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r'
        };
        
        self.client.queryDocuments(self.collection._self, querySpec).toArrayAsync()
            .then(function (results) {
                var postList = [];
                results.feed.forEach(function(data) {
                    postList.push(new Post(data));
                });
                callback(null,postList);
        })
        .fail(function (error) {
            callback(error);
        });
    },
    add: function(post, callback) {
        var self = this,
            json = JSON.parse(JSON.stringify(post));
        
        json.id = shortid.generate();

        self.client.createDocumentAsync(self.collection._self, json)
            .then(function() {
                callback(null, new Post(json));
            })
            .fail(function(error) {
                callback(error);
            });
    },
    update: function (post, callback) {
        var self = this,
            json = JSON.parse(JSON.stringify(post));
  
        self.client.replaceDocumentAsync(json._self, json)
            .then(function (results) {
                callback(null, new Post(results.resource));
            })
            .fail(function (error) {
                callback(error);
            });
    },
    findBy: function (id, callback) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: id
            }]
        };
        
        self.client.queryDocuments(self.collection._self, querySpec).toArrayAsync()
            .then(function(results) {
                callback(null, new Post(results.feed[0]));
            })
        .fail(function(error) {
            callback(error);
        });
    }
}
module.exports = new PostDao(
    'HOST', 
    'MASTERKEY');





    
