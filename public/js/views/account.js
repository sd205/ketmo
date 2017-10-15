console.log("account.js");
ketmo.AccountView = Backbone.View.extend({

    initialize: function () {
        console.log("AccountView:initialize this.model="+JSON.stringify(this.model));
        this.model.on('change', this.render, this);

        var tasks = new ketmo.TaskCollection();
        tasks.fetch({
          data: {'parent_ref': 'fund', 'parent_id': ketmo.currentFund.get("_id"), 'value': {$gt: 0}},
          success: function(collection, response, options) {
            console.log("AccountView:initialize success3");
            //console.log("collection2 = "+ JSON.stringify(collection));
		        if (collection.length > 0) {
			        ketmo.fundRewardView = new ketmo.TaskListView({model: new Backbone.Model({ 
			        	parentId: ketmo.currentFund.get("_id"),
			        	parentRef: "fund",
			        	parentLabel: "Fund",
			        	title: "Fund Rewards",
			        	taskType: "Reward",
			        	taskSign: 1,
			        	taskCount: collection.length,
			        	features: ketmo.currentFund.get("features"),
			        	featureKey: "FUND_REWARD",
			        	defaultValue: ketmo.currentFund.get("defaultValue"),
			        	page: "account",
			        	cols: 12
			        })});
			        $('#accfundrewardlist').html(ketmo.fundRewardView.render().el);
							ketmo.fundRewardList = new ketmo.TaskListViewList({model: collection});
							ketmo.fundRewardList.setParentAttrs(ketmo.fundRewardView.model.attributes);
	            $('#taskFundRewardList').html(ketmo.fundRewardList.render().el);
	          } else {
	          	$('#accfundrewardlist').html("");
	          }						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

        var tasks = new ketmo.TaskCollection();
        tasks.fetch({
          data: {'parent_ref': 'fund', 'parent_id': ketmo.currentFund.get("_id"), 'value': {$lte: 0}},
          success: function(collection, response, options) {
            console.log("FundView:initialize success4");
            //console.log("collection3 = "+ JSON.stringify(collection));
		        if (collection.length > 0) {
			        ketmo.fundPenaltyView = new ketmo.TaskListView({model: new Backbone.Model({ 
			        	parentId: ketmo.currentFund.get("_id"),
			        	parentRef: "fund",
			        	parentLabel: "Fund",
			        	title: "Fund Penalties",
			        	taskType: "Penalty",
			        	taskSign: -1,
			        	taskCount: collection.length,
			        	features: ketmo.currentFund.get("features"),
			        	featureKey: "FUND_PENALTY",
			        	defaultValue: ketmo.currentFund.get("defaultValue"),
			        	page: "account",
			        	cols: 12
			        })});
			        $('#accfundpenaltylist').html(ketmo.fundPenaltyView.render().el);
							ketmo.fundPenaltyList = new ketmo.TaskListViewList({model: collection});
							ketmo.fundPenaltyList.setParentAttrs(ketmo.fundPenaltyView.model.attributes);
	            $('#taskFundPenaltyList').html(ketmo.fundPenaltyList.render().el);
	          } else {
	          	$('#accfundpenaltylist').html("");
	          }						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

        var tasks = new ketmo.TaskCollection();
        tasks.fetch({
          data: {'parent_ref': 'account', 'parent_id': ketmo.currentAccount.get("_id"), 'value': {$gt: 0}},
          success: function(collection, response, options) {
            console.log("AccountView:initialize success4");
            //console.log("collection4 = "+ JSON.stringify(collection));
		        ketmo.accountRewardView = new ketmo.TaskListView({model: new Backbone.Model({ 
		        	parentId: ketmo.currentAccount.get("_id"),
		        	parentRef: "account",
		        	parentLabel: "Account",
		        	title: "Account Rewards",
		        	taskType: "Reward",
		        	taskSign: 1,
		        	taskCount: collection.length,
		        	features: ketmo.currentFund.get("features"),
		        	featureKey: "ACCOUNT_REWARD",
		        	defaultValue: ketmo.currentAccount.get("defaultValue"),
		        	page: "account",
		        	cols: 12
		        })});
		        $('#accountrewardlist').html(ketmo.accountRewardView.render().el);
						ketmo.accountRewardList = new ketmo.TaskListViewList({model: collection});
						ketmo.accountRewardList.setParentAttrs(ketmo.accountRewardView.model.attributes);
		        if (collection.length > 0) {
	            $('#taskAccountRewardList').html(ketmo.accountRewardList.render().el);						
	          } else {
	          	$('#taskAccountRewardList').html("");
	          }						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

        var tasks = new ketmo.TaskCollection();
        tasks.fetch({
          data: {'parent_ref': 'account', 'parent_id': ketmo.currentAccount.get("_id"), 'value': {$lte: 0}},
          success: function(collection, response, options) {
            console.log("AccountView:initialize success5");
            //console.log("collection5 = "+ JSON.stringify(collection));
		        ketmo.accountPenaltyView = new ketmo.TaskListView({model: new Backbone.Model({ 
		        	parentId: ketmo.currentAccount.get("_id"),
		        	parentRef: "account",
		        	parentLabel: "Account",
		        	title: "Account Penalties",
		        	taskType: "Penalty",
		        	taskSign: -1,
		        	taskCount: collection.length,
		        	features: ketmo.currentFund.get("features"),
		        	featureKey: "ACCOUNT_PENALTY",
		        	defaultValue: ketmo.currentAccount.get("defaultValue"),
		        	page: "account",
		        	cols: 12
		        })});
		        $('#accountpenaltylist').html(ketmo.accountPenaltyView.render().el);
						ketmo.accountPenaltyList = new ketmo.TaskListViewList({model: collection});
						ketmo.accountPenaltyList.setParentAttrs(ketmo.accountPenaltyView.model.attributes);
		        if (collection.length > 0) {
	            $('#taskAccountPenaltyList').html(ketmo.accountPenaltyList.render().el);						
	          } else {
	          	$('#taskAccountPenaltyList').html("");
	          }						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

        var trns = new ketmo.TransactionCollection();
        trns.fetch({
          data: {'account_id': ketmo.currentAccount.get("_id"), _options: {limit: 20, sort: {applied: -1}}},
          success: function(collection, response, options) {
            console.log("AccountView:initialize success6");
            console.log("collection6 = "+ JSON.stringify(collection));
            ketmo.transactionListView = new ketmo.TransactionListView({model: collection});
            $('#acctransactionlist').html(ketmo.transactionListView.render().el);
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

    },

    events:{
        "click #deleteAccountBtn":"deleteAccountBtnClick",
        "submit #deleteAccountDialog":"deleteAccountBtnClick",
        "click #editAccountBtn":"editAccountBtnClick",
        "submit #editAccountDialog":"editAccountBtnClick",
        "click #accountDepositBtn":"accountDepositBtnClick",
        "submit #accountDepositDialog":"accountDepositBtnClick",
        "click #accountWithdrawBtn":"accountWithdrawBtnClick",
        "submit #accountWithdrawDialog":"accountWithdrawBtnClick"
    },

    render:function () {
        console.log("AccountView:render");
        this.$el.html(this.template(this.model.attributes));

        if (ketmo.fundRewardView) {
	        $('#accfundrewardlist').html(ketmo.fundRewardView.render().el);
        	ketmo.fundRewardView.delegateEvents();
        }
        if (ketmo.fundPenaltyView) {
	        $('#accfundpenaltylist').html(ketmo.fundPenaltyView.render().el);
        	ketmo.fundPenaltyView.delegateEvents();
        }
        if (ketmo.accountRewardView) {
	        $('#accountrewardlist').html(ketmo.accountRewardView.render().el);
        	ketmo.accountRewardView.delegateEvents();
        }
        if (ketmo.accountPenaltyView) {
	        $('#accountpenaltylist').html(ketmo.accountPenaltyView.render().el);
        	ketmo.accountPenaltyView.delegateEvents();
        }
        if (ketmo.transactionListView) {
	        $('#acctransactionlist').html(ketmo.transactionListView.render().el);
        	ketmo.transactionListView.delegateEvents();
        }
        return this;
    },

    deleteAccountBtnClick:function () {
        console.log("deleteAccountBtnClick");
        var account = ketmo.currentAccount.clone();
        account.destroy({
          success: function(model, response, options) {
            console.log("deleteAccountBtnClick success");
            $('#deleteAccountDialog').modal('hide');
            ketmo.router.navigate("#fund/"+model.get("fund_id"), {trigger:true});
          },
          error: function(model, response, options) {
            console.log("deleteAccountBtnClick error: "+response.responseText);
            /* TO DO */
          }
        });
        console.log("deleteAccountBtnClick end");
    },

    editAccountBtnClick:function () {
        console.log("editAccountBtnClick");
        var name = $('#editAccountName').val();
        var defaultValue = Number($('#editAccountDefaultAmount').val());
        console.log("editAccountBtnClick name="+name);
        var account = ketmo.currentAccount.clone();
        account.set({name: name, defaultValue: defaultValue});
        account.unset("_");
        console.log("account="+JSON.stringify(account));
        account.save(null, {
          success: function(model, response, options) {
            console.log("editAccountBtnClick success");
            //console.log("model._id = "+ JSON.stringify(model.get("_id")));
            $('#editAccountDialog').modal('hide');
            ketmo.currentAccount.set(model.attributes);
          },
          error: function(model, response, options) {
            console.log("editAccountBtnClick error");
            $('#editAccountErrorMsg').html(response.debug.debug);
            $('#editAccountErrorMsg').collapse("show");
            /* TO DO */
          }
        });
        console.log("editAccountBtnClick end");
    },

    accountDepositBtnClick:function () {
        console.log("accountDepositBtnClick "+JSON.stringify(ketmo.currentAccount.get("_id")));
        var amount = Number($('#accountDepositValue').val());
        //TO DO: amount > 0
        console.log("accountDepositBtnClick amount="+amount);
	      var trn = new ketmo.Transaction({
	      	account_id: ketmo.currentAccount.get("_id"), 
	      	amount:     amount,
	      	comment:    "Deposit"
	      });
	      //console.log("addAccountBtnClick trn="+JSON.stringify(trn));
	      trn.save(null, {
	        success: function(model, response, options) {
            console.log("accountDepositBtnClick success "+response.balance);
            $('#accountDepositDialog').modal('hide');
            ketmo.transactionListView.model.unshift(model);
	          ketmo.currentAccount.set({balance: model.get("balance")});
	        },
	        error: function(model, response, options) {
            console.log("accountDepositBtnClick error "+JSON.stringify(response));
            $('#accountDepositErrorMsg').html(response.debug);
            $('#accountDepositErrorMsg').collapse("show");
          }
        });
        console.log("accountDepositBtnClick end");
    },

    accountWithdrawBtnClick:function () {
        console.log("accountWithdrawBtnClick "+JSON.stringify(ketmo.currentAccount.get("_id")));
        var amount = Number($('#accountWithdrawValue').val());
        //TO DO: amount > 0
        console.log("accountWithdrawBtnClick amount="+amount);
	      var trn = new ketmo.Transaction({
	      	account_id: ketmo.currentAccount.get("_id"), 
	      	amount:     -amount,
	      	comment:    "Withdrawal"
	      });
	      //console.log("addAccountBtnClick trn="+JSON.stringify(trn));
	      trn.save(null, {
	        success: function(model, response, options) {
            console.log("accountWithdrawBtnClick success");
            $('#accountWithdrawDialog').modal('hide');
            ketmo.transactionListView.model.unshift(model);
	          ketmo.currentAccount.set({balance: model.get("balance")});
	        },
	        error: function(model, response, options) {
            console.log("accountWithdrawBtnClick error "+JSON.stringify(response));
            $('#accountWithdrawErrorMsg').html(response.debug);
            $('#accountWithdrawErrorMsg').collapse("show");
          }
        });
        console.log("accountWithdrawBtnClick end");
    }

});

ketmo.TransactionListView = Backbone.View.extend({

    tagName:'table',

    className:'table',

    render:function () {
        console.log("TransactionListView: render");
        var i=0;
        this.$el.empty();
        if (this.model.models.length > 0) {
	        this.$el.append('<tr><th>Comment</th><th class="text-right">Amount</th><th class="text-right">Applied</th></tr>');
					$('#transactionsTitle').show();
				}
        _.each(this.model.models, function (trn) {
            console.log("trn = "+ JSON.stringify(trn));
            this.$el.append(new ketmo.TransactionListItemView({model:trn}).render().el);
            i++;
        }, this);
        return this;
    }
});

ketmo.TransactionListItemView = Backbone.View.extend({

    tagName:"tr",

    initialize:function () {
        console.log("TransactionListItemView:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        console.log("TransactionListItemView:render");
        console.log("this.model.attributes = "+ JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});
