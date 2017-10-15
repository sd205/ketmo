console.log("home.js");
ketmo.HomeView = Backbone.View.extend({

    initialize: function () {
        console.log("home.js:initialize");
        this.funds = new ketmo.FundCollection();
        this.funds.fetch({
          success: function(collection, response, options) {
            console.log("home.js:initialize success");
            ketmo.HomeView.funds = collection;
            //console.log("ketmo.HomeView.funds = "+ JSON.stringify(ketmo.HomeView.funds));
            this.FundListView = new ketmo.FundListView({model: ketmo.HomeView.funds});
            $('#fundlist').html(this.FundListView.render().el);
          },
          error: function(collection, response, options) {
            console.log("home.js:initialize error");
            /* TO DO */
          }
        });
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    events:{
        "click #addFundBtn":"addFundBtnClick",
        "submit #addFundDialog":"addFundBtnClick"
    },

    addFundBtnClick:function () {
        console.log("addFundBtnClick");
        var name = $('#addFundName').val();
        console.log("addFundBtnClick name="+name);
        var fund = new ketmo.Fund({name: name, features: 1, defaultValue: 0.5});
        //console.log("addFundBtnClick fund="+JSON.stringify(fund));
        fund.save(null, {
          success: function(model, response, options) {
            console.log("addFundBtnClick success");
            //console.log("model._id = "+ JSON.stringify(model.get("_id")));
            $('#addFundDialog').modal('hide');
            ketmo.router.navigate("#fund/"+model.get("_id"), {trigger:true});
          },
          error: function(model, response, options) {
            console.log("addFundBtnClick error: "+JSON.stringify(response));
            $('#addFundErrorMsg').html(response.debug.debug);
            $('#addFundErrorMsg').collapse("show");
            /* TO DO */
          }
        });
        console.log("addFundBtnClick end");
    }

});

ketmo.FundListView = Backbone.View.extend({

    tagName:'div',

    className:'row',

    render:function () {
        console.log("FundListView:render");
        var i=0;
        this.$el.empty();
        _.each(this.model.models, function (fund) {
            this.$el.append(new ketmo.FundListItemView({model:fund}).render().el);
            i++;
            if (i%4==0) {
                this.$el.append('</div><div class="row">');
            }
        }, this);
        return this;
    }
});

ketmo.FundListItemView = Backbone.View.extend({

    tagName:"div",

    initialize:function () {
        console.log("FundListItemView:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        console.log("FundListItemView:render");
        //console.log("this.model.attributes = "+ JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});

