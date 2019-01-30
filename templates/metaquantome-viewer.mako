<%
    default_title = "Metaquantome"
    info = hda.name
    if hda.info:
        info += ' : ' + hda.info
    root            = h.url_for( "/static/" )

    data =  hda.datatype.dataprovider(hda, 'base')
    app_root        = root + "plugins/visualizations/metaquantome/static"
    app_root = "static/js"
    repository_root = 'static'
    hdadict = trans.security.encode_dict_ids( hda.to_dict() )
    import re
    re_img = re.compile(r"<img .*?>")
%>


<!DOCTYPE HTML>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>${hda.name | h} | Metaquantome Visualizer</title>

        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        ${h.js( 'libs/jquery/jquery',
                'libs/jquery/jquery-ui')}

        ${h.js( 'libs/jquery/select2',
                'libs/bootstrap-tour',
                'libs/underscore',
                'libs/backbone',
                'libs/d3',
                'libs/require')}
        ${h.css( 'base', 'jquery-ui/smoothness/jquery-ui' )}

    </head>
<html>
    <div id="myDiv"></div>
    <div id="heatMap"></div>
</html>

<script>
    var app_root = '${app_root}';
    var repository_root = '${repository_root}';

     var Galaxy = Galaxy || parent.Galaxy || {
                root    : '${root}',
                emit    : {
                    debug: function() {}
                }
            };
            window.console = window.console || {
                log     : function(){},
                debug   : function(){},
                info    : function(){},
                warn    : function(){},
                error   : function(){},
                assert  : function(){}
            };
            require.config({
                baseUrl: 'static/js',
                paths: {
                    "plugin"        : "",
                    "d3"            : "libs/d3",
                    "repository"    : "${repository_root}"
                },
                shim: {
                    "libs/underscore": { exports: "_" },
                    "libs/backbone": { exports: "Backbone" },
                    "d3": { exports: "d3" }
                }
            });
    $(function() {
        require( [ 'app' ], function( App ) {
            var app = new App({dataset_id : '${hdadict["id"]}'});
            $('body').append(app.$el);
        });
    });
</script>