console.log("signup.js");
ketmo.SignUpView = Backbone.View.extend({

    render:function () {
        this.$el.html(this.template());
        return this;
    }
    
});
