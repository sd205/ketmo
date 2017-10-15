console.log("app.js");
var ketmo = {

  //features that may be used in a fund
  features: {
    DEPOSIT_WITHDRAW:   {value:  1, label: "Deposits / Withdrawals"},
    //REGULAR_PAYMENT: 	{value:  2, label: "Regular Payments"},
    FUND_REWARD:	{value:  4, label: "Fund Rewards"},
    FUND_PENALTY:	{value:  8, label: "Fund Penalties"},
    ACCOUNT_REWARD: 	{value: 16, label: "Account Rewards"},
    ACCOUNT_PENALTY: 	{value: 32, label: "Account Penalties"}
    //,
    //TRANSFER:		{value: 64, label: "Transfers"}
  },

  //THIS IS CALLED FIRST WHEN THE APPLICATION LOADS
  init: function() {
    console.log("init");
    //check if the user is logged in, pull all the templates from the server, then start the router
    auth.getSession(function() {
      ketmo.loadTemplates(
        function () {
          ketmo.router = new ketmo.Router();
          Backbone.history.start();
        }
      );
    });
  },

  loadTemplates: function(callback) {
      console.log("loadTemplates");

      var deferreds = [];

      $.each([
      	"SignUpView", //if not logged in
        "ShellView",  //if logged in, header and footer
        "HomeView",   //show the user's funds
          "FundListItemView", //a fund in the list
      	"FundView",   //show a single fund and its accounts, rewards and penalties
          "AccountListItemView", //an account in the list
          "TaskListView", // list of penalties or rewards, used in both FundView and AccountView
            "TaskListItemView", //a task in the list
      	"AccountView", //show a single account and its rewards, penalties and transactions
          "TransactionListItemView" //a transaction in the list
        ], 
        function(index, view) {
          if (ketmo[view]) {
              deferreds.push($.get('/tpl/' + view + '.html', function(data) {
                  ketmo[view].prototype.template = _.template(data);
              }, 'html'));
          } else {
              console.log(view + " not found");
          }
      });

      $.when.apply(null, deferreds).done(callback);
  },

  checkUser: function(originalRoute) {
    return function() {
      if (auth.isSignedIn()) {
          console.log("auth.user = "+JSON.stringify(auth.user));
          originalRoute.apply(this, arguments);
      } else {
          //console.log("not logged in");
          if (!ketmo.signupView) {
              ketmo.signupView = new ketmo.SignUpView();
              ketmo.signupView.render();
          }
          $('#ketmo').html(ketmo.signupView.render().el);
      }
    };
  }
};

ketmo.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "fund/:id":         "fund",
        "account/:id":      "account"
    },

    initialize: function () {
        console.log("initialize");
        if (auth.isSignedIn()) {
            ketmo.shellView = new ketmo.ShellView();
            $('body').html(ketmo.shellView.render().el);
            ketmo.$content = $("#content");
        }
    },

    shell: function () {
        console.log("shell");

        ketmo.shellView = new ketmo.ShellView();
        $('#ketmo').html(ketmo.shellView.render().el);
        ketmo.$content = $("#content");
    },

    home: ketmo.checkUser(function () {
        console.log("home");

        ketmo.homeView = new ketmo.HomeView();
        ketmo.homeView.render();
        ketmo.$content.html(ketmo.homeView.el);
        ketmo.shellView.selectMenuItem('home-menu');
    }),

    fund: ketmo.checkUser(function (id) {
        //console.log("fund id="+id);

        this.fund = new ketmo.Fund({_id: id});
        this.fund.fetch({
          success: function(model, response, options) {
            console.log("Router.fund: success model="+JSON.stringify(model));
            ketmo.currentFund = model;
		        ketmo.fundView = new ketmo.FundView({model: model});
		        ketmo.fundView.render();
		        ketmo.$content.html(ketmo.fundView.el);
        //ketmo.shellView.selectMenuItem('home-menu');
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error");
          }
        });
    }),

    account: ketmo.checkUser(function (id) {
        console.log("account id="+id);
        this.account = new ketmo.Account({_id: id});
        this.account.fetch({
          success: function(model, response, options) {
            console.log("Router.account: success model="+JSON.stringify(model));
            ketmo.currentAccount = model;
		        //ketmo.accountView = new ketmo.AccountView({id: id});

            if (!ketmo.currentFund || ketmo.currentFund.get("_id") != model.get("fund_id")) {
              var fund = new ketmo.Fund({_id: model.get("fund_id")});
              fund.fetch({
                success: function(model, response, options) {
                  console.log("Router.account: success2 model="+JSON.stringify(model));
                  ketmo.currentFund = model;
                  ketmo.currentAccount.set({"_": {fund: {
										name:     model.get("name"), 
										features: model.get("features")
									}}});
                  //console.log("fund_name=" +ketmo.AccountView.account.get("_").fund.name);
					        ketmo.accountView = new ketmo.AccountView({model: ketmo.currentAccount});
					        ketmo.accountView.render();
					        ketmo.$content.html(ketmo.accountView.el);
					        ketmo.shellView.selectMenuItem('home-menu');
                  //this.accountDetailView = new ketmo.AccountDetailView({model: ketmo.AccountView.account});
                  //$('#accountdetails').html(this.AccountDetailView.render().el);
                  //$('#addAccount').collapse("show");
                },
                error: function(collection, response, options) {
                  console.log("AccountView:initialize error2");
                }
              });
            } else {
              ketmo.currentAccount.set({"_": {fund: {
								name:     ketmo.currentFund.get("name"), 
								features: ketmo.currentFund.get("features")
							}}});
              //console.log("fund_name=" +ketmo.AccountView.account.get("_").fund.name);
			        ketmo.accountView = new ketmo.AccountView({model: ketmo.currentAccount});
			        ketmo.accountView.render();
			        ketmo.$content.html(ketmo.accountView.el);
			        ketmo.shellView.selectMenuItem('home-menu');
            }

          },
          error: function(collection, response, options) {
            console.log("AccountView:initialize error");
          }
        });
    })
});

_.addTemplateHelpers( {
    getAllFeatures : function() {
    	return ketmo.features;
		}
} );


