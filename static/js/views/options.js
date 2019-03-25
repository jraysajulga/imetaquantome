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

            // CLose dropdown menus if user clicks outside
            window.onclick = function(event) {
                if (!event.target.matches('.option-dropbtn')) {
                    var dropdowns = document.getElementsByClassName("option-dropdown-content");
                    for (var i = 0; i < dropdowns.length; i++){
                        var shownDropdown = dropdowns[i];
                        if ($( shownDropdown ).css("display") == "block"){
                            $( shownDropdown ).toggle("show");
                        }
                        //if (shownDropdown.classList.contains("show")) {
                          //  shownDropdown.classList.remove("show");
                        //}
                    }
                }
            }

            // Iterate through dataset's headers and place within dropdown.
            var columns = this.model.get("headers");
            for (var i = 0; i < columns.length; i++){
                dropdown_content.append($("<a>", {
                                        text : columns[i],
                                        click : function(){
                                            console.log($( this ).html());
                                        }}));
            }
            dropdown.append($("<button>", {class : "option-dropbtn",
                                       click : function(){
                                        //$( this ).find(".option-dropdown-content").classList.toggle("show")
                                        $(this).parent().find(".option-dropdown-content").toggle("show");
                                       }}));
            dropdown.append(dropdown_content);
            return dropdown
        },

        render : function(){
        }
    });
});
