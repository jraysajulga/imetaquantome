define([''],
    function() {
    return Backbone.View.extend({

        className : "options",

        initialize: function(config){
            this.model = config.model;
            this.headers = config.headers;
            this.addDropdowns();
            this.model.on("change:values", this.addDropdowns, this);
        },

        addDropdowns : function(){
            var values = this.model.get("values");
            this.$el.empty();
            for (value in values){
                this.$el.append(this.dropdown(value, values[value]));
            }
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
            dropdown_label = $("<div>",
                {class : "option-label",
                 text : value});
            dropdown_header.append(dropdown_button);
            dropdown_header.append(dropdown_label);

            // Iterate through dataset's headers and place within dropdown.
            var view = this;
            for (var i = 0; i < this.headers.length; i++){
                dropdown_content.append($("<a>", {
                                        text : this.headers[i],
                                        class : value == this.headers[i] ? "selected" : null,
                                        click : function(){
                                            var values = _.clone(view.model.get("values"));
                                            values[label] = $( this ).html();
                                            view.model.set("values", values);
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
