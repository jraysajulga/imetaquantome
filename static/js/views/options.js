define([''],
    function() {
    return Backbone.View.extend({

        className : "options",

        initialize: function(config){
            this.model = config.model;
            this.dropdown_label = null;
            this.addDropdowns();
        },

        addDropdowns : function(){
            var values = this.model.get("values");
            for (value in values){
                this.$el.append(this.dropdown(value, values[value]));
            }
        },

        updateLabel : function(){
            console.log("Updating label");
        },

        dropdown : function(label, value){
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
                 text : label});
            var dropdown_button = $("<button>", 
                {class : "option-dropbtn",
                 text : "▼",
                click : function(){
                    var content = $(this).parent().parent()
                        .find(".option-dropdown-content");
                    content.toggle("show");
                }});
            this.dropdown_label = $("<div>",
                {class : "option-label",
                 text : value});
            dropdown_header.append(this.dropdown_label);
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
