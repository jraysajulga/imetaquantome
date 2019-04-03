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
            var dropdown = $("<div>", {class : "option-dropdown"})
            var dropdown_content = $("<div>", {class : "option-dropdown-content"})

            // CLose dropdown menus if user clicks outside
            window.onclick = function(event) {
                if (!event.target.matches('.option-dropbtn')) {
                    var dropdowns = document.getElementsByClassName("option-dropdown-content");
                    for (var i = 0; i < dropdowns.length; i++){
                        var shownDropdown = dropdowns[i];
                        if ($( shownDropdown ).css("display") == "block"){
                            $( shownDropdown ).toggle("show");
                        }
                    }
                }
            }


            var dropdown_header = $("<div>",
                {class : "option-header",
                 text : text});
            var dropdown_button = $("<button>", 
                {class : "option-dropbtn",
                 text : "▼",
                click : function(){
                    var content = $(this).parent().parent()
                        .find(".option-dropdown-content");
                    content.toggle("show");
                }});
            var dropdown_label = $("<div>",
                {class : "option-label"});
            dropdown_header.append(dropdown_label);
            dropdown_header.append(dropdown_button);

            // Iterate through dataset's headers and place within dropdown.
            var columns = this.model.get("headers");
            var view = this;
            for (var i = 0; i < columns.length; i++){
                dropdown_content.append($("<a>", {
                                        text : columns[i],
                                        click : function(){
                                            console.log($( this ).html());
                                            
                                            //console.log($(this).parent().parent().find(".option-header").find(".option-label").html($( this ).html()));
                                        }}));
            }
            dropdown.append(dropdown_header);
            dropdown.append(dropdown_content);
            return dropdown
        },

        render : function(){
        }
    });
});
