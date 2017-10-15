console.log("shell.js");
ketmo.ShellView = Backbone.View.extend({

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    selectMenuItem: function(menuItem) {
        $('.navbar .nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});