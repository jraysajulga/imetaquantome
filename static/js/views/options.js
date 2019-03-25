define([''],
    function() {
    return Backbone.View.extend({

        className : "options",

        initialize: function(config){
            this.model = config.model;
            //$()
            this.$el.html(this.dropdown("Label: "));
            this.$el.append(this.dropdown("X: "));
            this.$el.append(this.dropdown("Y: "));
        },

        dropdown : function(text){
            var dropdown = $("<div>", {class : "option-dropdown",
                                        text : text})
            var dropdown_content = $("<div>", {class : "option-dropdown-content"})

            // Iterate through dataset's headers and place within dropdown.
            var columns = this.model.get("headers");
            for (var i = 0; i < columns.length; i++){
                dropdown_content.append($("<a>", {
                                        text : columns[i],
                                        click : function(){
                                            console.log($( this ).html());
                                        }}));
            }
            dropdown.append($("<button>", {class : "option-dropbtn"}));
            dropdown.append(dropdown_content);
            return dropdown
        },

        render : function(){
        }
    });
});
