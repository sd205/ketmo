console.log("test/model-test.js");
//override model for testing

ketmo.Fund = Backbone.Model.extend({
    idAttribute: "_id"
});

ketmo.FundCollection = Backbone.Collection.extend({
    model: ketmo.Fund
});

ketmo.Account = Backbone.Model.extend({
    idAttribute: "_id"
});

ketmo.AccountCollection = Backbone.Collection.extend({
    model: ketmo.Account
});

ketmo.Task = Backbone.Model.extend({
    idAttribute: "_id"
});

ketmo.TaskCollection = Backbone.Collection.extend({
    model: ketmo.Task
});

ketmo.Transaction = Backbone.Model.extend({
    idAttribute: "_id"
});

ketmo.TransactionCollection = Backbone.Collection.extend({
    model: ketmo.Transaction
});
