console.log("fund.js");
ketmo.FundView = Backbone.View.extend({

    initialize: function () {
        console.log("FundView:initialize");
        //console.log("this.model._id="+this.model.get("_id"));
        this.model.on('change', this.render, this);
        //ketmo.FundView.fund = this.model;
        //console.log("ketmo.FundView.fund = "+ JSON.stringify(ketmo.FundView.fund));
        //console.log("ketmo.FundView.fund.name="+ketmo.FundView.fund.get("name"));

        this.accounts = new ketmo.AccountCollection();
        this.accounts.fetch({
          data: {'fund_id': this.model.get("_id")},
          success: function(collection, response, options) {
            console.log("FundView:initialize success2");
            //ketmo.FundView.accounts = collection;
            //console.log("collection = "+ JSON.stringify(collection));
            ketmo.accountListView = new ketmo.AccountListView({model: collection});
            $('#accountlist').html(ketmo.accountListView.render().el);
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error2");
            /* TO DO */
          }
        });

        this.rewards = new ketmo.TaskCollection();
        this.rewards.fetch({
          data: {'parent_ref': 'fund', 'parent_id': this.model.get("_id"), 'value': {$gt: 0}},
          success: function(collection, response, options) {
            console.log("FundView:initialize success3");
            //console.log("collection2 = "+ JSON.stringify(collection));
		        ketmo.fundRewardView = new ketmo.TaskListView({model: new Backbone.Model({
		        	parentId: ketmo.currentFund.get("_id"),
		        	parentRef: "fund",
		        	parentLabel: "Fund",
		        	title: "Fund Rewards",
		        	taskType: "Reward",
		        	taskSign: 1,
		        	//tasks: collection,
		        	features: ketmo.currentFund.get("features"),
		        	featureKey: "FUND_REWARD",
		        	defaultValue: ketmo.currentFund.get("defaultValue"),
		        	page: "fund",
		        	cols: 6
		        })});
		        $('#fundrewardlist').html(ketmo.fundRewardView.render().el);
						ketmo.fundRewardList = new ketmo.TaskListViewList({model: collection, parent: ketmo.fundRewardView});
						ketmo.fundRewardList.setParentAttrs(ketmo.fundRewardView.model.attributes);
            $('#taskFundRewardList').html(ketmo.fundRewardList.render().el);						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error3");
            /* TO DO */
          }
        });

        this.rewards = new ketmo.TaskCollection();
        this.rewards.fetch({
          data: {'parent_ref': 'fund', 'parent_id': this.model.get("_id"), 'value': {$lte: 0}},
          success: function(collection, response, options) {
            console.log("FundView:initialize success4");
            //console.log("collection3 = "+ JSON.stringify(collection));
		        ketmo.fundPenaltyView = new ketmo.TaskListView({model: new Backbone.Model({ 
		        	parentId: ketmo.currentFund.get("_id"),
		        	parentRef: "fund",
		        	parentLabel: "Fund",
		        	title: "Fund Penalties",
		        	taskType: "Penalty",
		        	taskSign: -1,
		        	//tasks: collection,
		        	features: ketmo.currentFund.get("features"),
		        	featureKey: "FUND_PENALTY",
		        	defaultValue: ketmo.currentFund.get("defaultValue"),
		        	page: "fund",
		        	cols: 6
		        })});
		        $('#fundpenaltylist').html(ketmo.fundPenaltyView.render().el);
						ketmo.fundPenaltyList = new ketmo.TaskListViewList({model: collection});
						ketmo.fundPenaltyList.setParentAttrs(ketmo.fundPenaltyView.model.attributes);
            $('#taskFundPenaltyList').html(ketmo.fundPenaltyList.render().el);						
          },
          error: function(collection, response, options) {
            console.log("FundView:initialize error4");
            /* TO DO */
          }
        });

    },

    render:function () {
        console.log("FundView:render");
        //console.log("this.model.name="+this.model.get("name"));
        this.$el.html(this.template(this.model.attributes));
        if (ketmo.accountListView) {
        	$('#accountlist').html(ketmo.accountListView.render().el);
        	ketmo.accountListView.delegateEvents();
        }
        if (ketmo.fundRewardView) {
	        ketmo.fundRewardView.model.set({features: this.model.get("features")});
	        $('#fundrewardlist').html(ketmo.fundRewardView.render().el);
        	ketmo.fundRewardView.delegateEvents();
        }
        if (ketmo.fundPenaltyView) {
	        ketmo.fundPenaltyView.model.set({features: this.model.get("features")});
	        $('#fundpenaltylist').html(ketmo.fundPenaltyView.render().el);
        	ketmo.fundPenaltyView.delegateEvents();
        }
        return this;
    },

    events:{
        "click #deleteFundBtn":"deleteFundBtnClick",
        "submit #deleteFundDialog":"deleteFundBtnClick",
        "click #editFundBtn":"editFundBtnClick",
        "submit #editFundDialog":"editFundBtnClick",
        "click #addAccountBtn":"addAccountBtnClick",
        "submit #addAccountDialog":"addAccountBtnClick"
    },

    deleteFundBtnClick:function () {
        console.log("deleteFundBtnClick");
        var fund = ketmo.currentFund.clone();
        console.log("fund="+JSON.stringify(fund));
        fund.destroy({
          success: function(model, response, options) {
            console.log("deleteFundBtnClick success");
            //console.log("model._id = "+ JSON.stringify(model.get("_id")));
            $('#deleteFundDialog').modal('hide');
            ketmo.router.navigate("", {trigger:true});
          },
          error: function(model, response, options) {
            console.log("deleteFundBtnClick error");
            /* TO DO */
          }
        });
        console.log("deleteFundBtnClick end");
    },

    editFundBtnClick:function () {
        console.log("editFundBtnClick");
        var name = $('#editFundName').val();
        var defaultValue = Number($('#editFundDefaultAmount').val());
        var features = 0;
			  for (key in ketmo.features) {
			  	var f = $('#editFundFeature'+ketmo.features[key].value);
			  	if (f.prop('checked')) {
			  		features += Number(f.val());
					}
			  }
        console.log("editFundBtnClick name="+name);
        var fund = ketmo.currentFund.clone();
        fund.set({name: name, features: features, defaultValue: defaultValue});
        //console.log("fund="+JSON.stringify(fund));
        fund.save(null, {
          success: function(model, response, options) {
            console.log("editFundBtnClick success");
            //console.log("model._id = "+ JSON.stringify(model.get("_id")));
            $('#editFundDialog').modal('hide');
            ketmo.currentFund.set(model.attributes);
          },
          error: function(model, response, options) {
            console.log("editFundBtnClick error");
            $('#editFundErrorMsg').html(response.debug.debug);
            $('#editFundErrorMsg').collapse("show");
            /* TO DO */
          }
        });
        console.log("editFundBtnClick end");
    },

    addAccountBtnClick:function () {
        console.log("addAccountBtnClick");
        var name = $('#addAccountName').val();
        console.log("addAccountBtnClick  name="+name);
        //console.log("addAccountBtnClick fund_id="+this.fund.get("_id"));
        var account = new ketmo.Account({name: name, fund_id: this.model.get("_id"), balance: 0, defaultValue: this.model.get("defaultValue")});
        //console.log("addAccountBtnClick account="+JSON.stringify(account));
        account.save(null, {
          success: function(model, response, options) {
            console.log("addAccountBtnClick success");
            console.log("model.name = "+ JSON.stringify(model.get("name")));
            $('#addAccountDialog').modal('hide');
            ketmo.router.navigate("#account/"+model.get("_id"), {trigger:true});
            //ketmo.router.navigate("#fund/"+ketmo.FundView.fund.get("_id"), {trigger:true});
          },
          error: function(model, response, options) {
            console.log("addAccountBtnClick error");
            $('#addAccountErrorMsg').html(response.debug.debug);
            $('#addAccountErrorMsg').collapse("show");
          }
        });
        console.log("addAccountBtnClick end");
    }
});

ketmo.AccountListView = Backbone.View.extend({

    tagName:'div',

    className:'row',

    render:function () {
        console.log("AccountListView: render");
        var i=0;
        this.$el.empty();
        _.each(this.model.models, function (account) {
            //console.log("account = "+ JSON.stringify(account));
            this.$el.append(new ketmo.AccountListItemView({model:account}).render().el);
            i++;
            if (i%4==0) {
                this.$el.append('</div><div class="row">');
            }
        }, this);
        return this;
    }
});

ketmo.AccountListItemView = Backbone.View.extend({

    tagName:"div",

    initialize:function () {
        console.log("AccountListItemView:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        console.log("AccountListItemView:render");
        //console.log("ALIV this.model.attributes = "+ JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});
