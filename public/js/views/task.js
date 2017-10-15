ketmo.TaskListView = Backbone.View.extend({

    tagName:"div",

    initialize:function () {
        console.log("TaskListView:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        console.log("TaskListView:render");
        //console.log("this.model.attributes = "+ JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));

        var viewName = this.model.get('parentRef')+this.model.get('taskType')+'List';
        var elName   = '#task'+this.model.get('parentLabel')+this.model.get('taskType')+'List';
        if (ketmo[viewName]) {
	        this.$(elName).html(ketmo[viewName].render().el);						
        }
        return this;
    },

    events:{
        "click #addFundRewardBtn":"addTaskBtnClick",
        "submit #addFundRewardDialog":"addTaskBtnClick",
        "click #addFundPenaltyBtn":"addTaskBtnClick",
        "submit #addFundPenaltyDialog":"addTaskBtnClick",
        "click #addAccountRewardBtn":"addTaskBtnClick",
        "submit #addAccountRewardDialog":"addTaskBtnClick",
        "click #addAccountPenaltyBtn":"addTaskBtnClick",
        "submit #addAccountPenaltyDialog":"addTaskBtnClick",
        "click .editTaskBtn":"preEditTask",
        "click #editFundRewardBtn":"editTaskBtnClick",
        "submit #editFundRewardDialog":"editTaskBtnClick",
        "click #editFundPenaltyBtn":"editTaskBtnClick",
        "submit #editFundPenaltyDialog":"editTaskBtnClick",
        "click #editAccountRewardBtn":"editTaskBtnClick",
        "submit #editAccountRewardDialog":"editTaskBtnClick",
        "click #editAccountPenaltyBtn":"editTaskBtnClick",
        "submit #editAccountPenaltyDialog":"editTaskBtnClick",
        "click .deleteTaskBtn":"preDeleteTask",
        "click #deleteFundRewardBtn":"deleteTaskBtnClick",
        "submit #deleteFundRewardDialog":"deleteTaskBtnClick",
        "click #deleteFundPenaltyBtn":"deleteTaskBtnClick",
        "submit #deleteFundPenaltyDialog":"deleteTaskBtnClick",
        "click #deleteAccountRewardBtn":"deleteTaskBtnClick",
        "submit #deleteAccountRewardDialog":"deleteTaskBtnClick",
        "click #deleteAccountPenaltyBtn":"deleteTaskBtnClick",
        "submit #deleteAccountPenaltyDialog":"deleteTaskBtnClick",
        "click .taskTransactionBtn":"preTaskTransaction",
        "click #trnFundRewardBtn":"taskTrnBtnClick",
        "submit #trnFundRewardDialog":"taskTrnBtnClick",
        "click #trnFundPenaltyBtn":"taskTrnBtnClick",
        "submit #trnFundPenaltyDialog":"taskTrnBtnClick",
        "click #trnAccountRewardBtn":"taskTrnBtnClick",
        "submit #trnAccountRewardDialog":"taskTrnBtnClick",
        "click #trnAccountPenaltyBtn":"taskTrnBtnClick",
        "submit #trnAccountPenaltyDialog":"taskTrnBtnClick"
    },

    addTaskBtnClick:function () {
        console.log("addTaskBtnClick model="+JSON.stringify(this.model.attributes));
        var parentId    = this.model.get('parentId');
        var parentRef   = this.model.get('parentRef');
        var parentLabel = this.model.get('parentLabel');
        var taskType    = this.model.get('taskType');
        var taskSign    = this.model.get('taskSign');
        var name = $('#add'+parentLabel+taskType+'Name').val();
        var amount = taskSign * $('#task'+parentLabel+taskType+'Value').val();
        //console.log("addTaskBtnClick name="+name+" amount="+amount);
        var task = new ketmo.Task({name: name, value: amount, parent_ref: parentRef, parent_id: parentId});
        console.log("addTaskBtnClick task="+JSON.stringify(task));

        task.save(null, {
          success: function(model, response, options) {
            console.log("addTaskBtnClick success");
            console.log("model = "+ JSON.stringify(model));

		        var viewName = parentRef+taskType+'List';
		        ketmo[viewName].model.add(model);

		        if (ketmo[viewName]) {
			        this.$('#task'+parentLabel+taskType+'List').html(ketmo[viewName].render().el);						
		        }

            $('#add'+parentLabel+taskType+'Dialog').modal('hide');
          },
          error: function(model, response, options) {
            console.log("addTaskBtnClick error");
            $('#add'+parentLabel+taskType+'ErrorMsg').html(response.debug.debug);
            $('#add'+parentLabel+taskType+'ErrorMsg').collapse("show");
          }
        });
        console.log("addTaskBtnClick end");
    },

		preEditTask:function(event) {
			console.log("preEditTask");
      var parentRef   = this.model.get('parentRef');
      var parentLabel = this.model.get('parentLabel');
      var taskType    = this.model.get('taskType');
      var taskSign    = this.model.get('taskSign');

      var viewName = parentRef+taskType+'List';
      this.currentTask = ketmo[viewName].model.at(event.currentTarget.id.split("$")[1]);
			console.log("this.currentTask="+JSON.stringify(this.currentTask));
			$('#edit'+parentLabel+taskType+'TitleName').html(this.currentTask.get('name'));
			$('#edit'+parentLabel+taskType+'Name').val(this.currentTask.get('name'));
			$('#edit'+parentLabel+taskType+'Value').val(taskSign*Number(this.currentTask.get('value')));
		},
	
    editTaskBtnClick:function () {
        console.log("editTaskBtnClick");
        var parentId    = this.model.get('parentId');
        var parentRef   = this.model.get('parentRef');
        var parentLabel = this.model.get('parentLabel');
        var taskType    = this.model.get('taskType');
        var taskSign    = this.model.get('taskSign');
        var name = $('#edit'+parentLabel+taskType+'Name').val();
        var amount = taskSign * $('#edit'+parentLabel+taskType+'Value').val();
        console.log("editTaskBtnClick name="+name+" amount="+amount);
        var originalTask = this.currentTask;
        var task = originalTask.clone();
        task.set({name: name, value: amount});
        console.log("editTaskBtnClick task="+JSON.stringify(task));

        task.save(null, {
          success: function(model, response, options) {
            console.log("editTaskBtnClick success");
            console.log("model = "+ JSON.stringify(model));

		        var viewName = parentRef+taskType+'List';
		        originalTask.set(model.attributes);

		        if (ketmo[viewName]) {
			        this.$('#task'+parentLabel+taskType+'List').html(ketmo[viewName].render().el);						
		        }

            $('#edit'+parentLabel+taskType+'Dialog').modal('hide');
          },
          error: function(model, response, options) {
            console.log("editTaskBtnClick error");
            $('#edit'+parentLabel+taskType+'ErrorMsg').html(response.debug.debug);
            $('#edit'+parentLabel+taskType+'ErrorMsg').collapse("show");
          }
        });

        console.log("editTaskBtnClick end");
    },
    
		preDeleteTask:function(event) {
			console.log("preDeleteTask");
      var parentRef   = this.model.get('parentRef');
      var parentLabel = this.model.get('parentLabel');
      var taskType    = this.model.get('taskType');
      var taskSign    = this.model.get('taskSign');

      var viewName = parentRef+taskType+'List';
      this.currentTaskIndex = event.currentTarget.id.split("$")[1];
      this.currentTask = ketmo[viewName].model.at(this.currentTaskIndex);
      
			//console.log("this.currentTask="+JSON.stringify(this.currentTask));
			$('#delete'+parentLabel+taskType+'TitleName').html(this.currentTask.get('name'));
		},
	
    deleteTaskBtnClick:function () {
        console.log("deleteTaskBtnClick");
        var parentId    = this.model.get('parentId');
        var parentRef   = this.model.get('parentRef');
        var parentLabel = this.model.get('parentLabel');
        var taskType    = this.model.get('taskType');
        var taskSign    = this.model.get('taskSign');
        var originalTask = this.currentTask;
        var task = originalTask.clone();
        //console.log("deleteTaskBtnClick task="+JSON.stringify(task));
        //console.log("this.currentTaskIndex="+this.currentTaskIndex);

        task.destroy({
          success: function(model, response, options) {
            console.log("deleteTaskBtnClick success");
            //console.log("model = "+ JSON.stringify(model));
		        var viewName = parentRef+taskType+'List';
		        ketmo[viewName].model.remove(model);
            //console.log("model = "+ ketmo[viewName].model);

		        if (ketmo[viewName]) {
			        this.$('#task'+parentLabel+taskType+'List').html(ketmo[viewName].render().el);						
		        }

            $('#delete'+parentLabel+taskType+'Dialog').modal('hide');
          },
          error: function(model, response, options) {
            console.log("deleteTaskBtnClick error");
            $('#edit'+parentLabel+taskType+'ErrorMsg').html(response.debug.debug);
            $('#edit'+parentLabel+taskType+'ErrorMsg').collapse("show");
          }
        });

        console.log("deleteTaskBtnClick end");
    },    

		preTaskTransaction:function(event) {
			console.log("preTaskTransaction");
      var parentRef   = this.model.get('parentRef');
      var parentLabel = this.model.get('parentLabel');
      var taskType    = this.model.get('taskType');
      var taskSign    = this.model.get('taskSign');
      //var account_id  = ketmo.currentAccount.get('_id');

      var viewName = parentRef+taskType+'List';
      this.currentTask = ketmo[viewName].model.at(event.currentTarget.id.split("$")[1]);
			console.log("this.currentTask="+JSON.stringify(this.currentTask));
			//console.log("account_id="+account_id+" name="+this.currentTask.get('name')+" value="+this.currentTask.get('value'));
			$('#trn'+parentLabel+taskType+'TitleName').html(this.currentTask.get('name'));
			$('#trn'+parentLabel+taskType+'Value').val(numeral(taskSign*this.currentTask.get('value')).format('0.00'));
		},
	
    taskTrnBtnClick:function () {
      console.log("taskTrnBtnClick "+JSON.stringify(ketmo.currentAccount.get("_id")));
      var parentLabel = this.model.get('parentLabel');
      var taskType    = this.model.get('taskType');
      console.log("taskTrnBtnClick amount="+this.currentTask.get('value'));
      var trn = new ketmo.Transaction({
      	account_id: ketmo.currentAccount.get("_id"), 
      	amount:     this.currentTask.get('value'),
      	comment:    this.currentTask.get('name')
      });
      //console.log("addAccountBtnClick trn="+JSON.stringify(trn));
      trn.save(null, {
        success: function(model, response, options) {
          console.log("taskTrnBtnClick success");
          $('#trn'+parentLabel+taskType+'Dialog').modal('hide');
		      console.log("model    = "+JSON.stringify(model));
		      //Console.log("response = "+JSON.stringify(response));
		      console.log("balance = "+JSON.stringify(model.get("balance")));

          ketmo.transactionListView.model.unshift(model);
          ketmo.currentAccount.set({balance: model.get("balance")});
        },
        error: function(model, response, options) {
          console.log("taskTrnBtnClick error "+JSON.stringify(response));
          $('#trn'+parentLabel+taskType+'ErrorMsg').html(response.debug);
          $('#trn'+parentLabel+taskType+'ErrorMsg').collapse("show");
        }
      });
      console.log("taskTrnBtnClick end");
    }
});

ketmo.TaskListViewList = Backbone.View.extend({

    tagName:'table',

    className:'table',

    initialize:function () {
        console.log("TaskListViewList:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    setParentAttrs:function (parentAttrs) {
        console.log("TaskListViewList:setParentAttrs");
        console.log("parentAttrs = "+ JSON.stringify(parentAttrs));
        this.parentAttrs = parentAttrs;
    },

    render:function () {
        console.log("TaskListViewList: render");
        //console.log("parent = "+ JSON.stringify(this.parent));
        var i=0;
        this.$el.empty();
        if (this.model.models.length > 0) {
        	//this.$el.append('<table class="table">');
        	this.$el.append('<tr><th>Name</th><th class="text-right">Amount</th><th class="text-right">Actions</th></tr>');
	        _.each(this.model.models, function (task) {
	            task2 = task.clone();
	            task2.set(this.parentAttrs);
	            task2.set({index: i});
	            //console.log("task2 = "+ JSON.stringify(task2));
	            this.$el.append(new ketmo.TaskListItemView({model:task2}).render().el);
	            i++;
	        }, this);
	        //this.$el.append('</table>');
        }
        return this;
    }
});

ketmo.TaskListItemView = Backbone.View.extend({

    tagName:"tr",

    initialize:function () {
        console.log("TaskListItemView:initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        console.log("TaskListItemView:render");
        console.log("TLIV this.model.attributes = "+ JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});
