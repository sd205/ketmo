console.log("model-rest.js");
//map backbone models for the REST APIs

ketmo.Fund = Backbone.Model.extend({
    urlRoot:"/api/fund",
    idAttribute: "_id"
});

ketmo.FundCollection = Backbone.Collection.extend({
    model: ketmo.Fund,
    url:"/api/funds"
});

ketmo.Account = Backbone.Model.extend({
    urlRoot:"/api/account",
    idAttribute: "_id"
});

ketmo.AccountCollection = Backbone.Collection.extend({
    model: ketmo.Account,
    url:"/api/accounts"
});

ketmo.Task = Backbone.Model.extend({
    urlRoot:"/api/task",
    idAttribute: "_id"
});

ketmo.TaskCollection = Backbone.Collection.extend({
    model: ketmo.Task,
    url:"/api/tasks"
});

ketmo.Transaction = Backbone.Model.extend({
    urlRoot:"/api/transaction",
    idAttribute: "_id"
});

ketmo.TransactionCollection = Backbone.Collection.extend({
    model: ketmo.Transaction,
    url:"/api/transactions"
});
