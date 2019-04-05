define([''],
    function() {
    return Backbone.View.extend({

        className : "options",

        initialize: function(config){
            this.model = config.model;
            this.dataModel = config.dataModel;
            this.headers = this.dataModel.get("headers");
            this.label_types = this.dataModel.get("label_types");
            this.column_types = this.dataModel.column_types;
            this.colors = this.dataModel.get("colors");
            this.addDropdowns();
            this.clearDropdownsListener();
            this.model.on("change:values change:type", this.addDropdowns, this);
            //this.dataModel.on("change:samplesFiles", )
        },

        addDropdowns : function(){
            var values = this.model.get("values");
            this.$el.html(this.dropdown("Type", this.model.get("type")))
            for (value in values){
                this.$el.append(this.dropdown(value, values[value]));
            }
        },

        clearDropdownsListener : function(){
            // Close dropdown menus if user clicks outside
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
        },

        determineColor : function(label){
            var values = this.model.get("values");
            if (label == "Type"){
                return "#f2f2f2"
            } else {
                return this.colors[label];
            }
        },

        dropdown : function(label, value){
            var dropdown = $("<div>", {class : "option-dropdown",
                                       style : "background-color : " 
                                       + this.determineColor(label)})
            var dropdown_content = $("<div>", {class : "option-dropdown-content"})

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
            var options = label == "Type" ? ["Heat Map", "Bar Chart", "Sankey"] : this.headers;
            for (var i = 0; i < options.length; i++){
                if (label == "Type" || (label != "Type" && this.label_types[label].includes(this.column_types[i]))){
                    dropdown_content.append($("<a>", {
                                            text : options[i],
                                            class : value == options[i] ? "selected" : null,
                                            mouseenter : function(){
                                                view.dataModel.set("highlighted", $(this).html());
                                            },
                                            mouseleave : function(){
                                                view.dataModel.set("highlighted", null);
                                            },
                                            click : function(){
                                                if (label == "Type") {
                                                    view.model.set("type", $(this).html());
                                                } else {
                                                    var values = _.clone(view.model.get("values"));
                                                    values[label] = $(this).html();
                                                    view.model.set("values", values);
                                                }
                                            }}));
                }
            }
            dropdown.append(dropdown_header);
            dropdown.append(dropdown_content);
            return dropdown
        },

        render : function(){
        }
    });
});
