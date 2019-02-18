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

        <link rel="stylesheet" href="static/css/index.css">
        <script src="https://d3js.org/d3.v5.min.js"></script>

        <script src="static/js/volcanoPlot.js"></script>

        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

        ${h.js( 'libs/jquery/jquery',
                'libs/jquery/jquery-ui')}

        ${h.js( 'libs/jquery/select2',
                'libs/bootstrap-tour',
                'libs/underscore',
                'libs/backbone',
                'libs/require')}
        ${h.css( 'base', 'jquery-ui/smoothness/jquery-ui' )}
        <!--'libs/d3',-->
    </head>
<html>
    <button id="resetBtn">Reset</button>
    <div id="chart"></div>

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
                    "repository"    : "${repository_root}",
                    "volcanoPlot" : "volcanoPlot"
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

    var yLabel = '-log<tspan baseline-shift="sub">10</tspan>False Discovery Rate',
        xLabel = 'log<tspan baseline-shift="sub">2</tspan>Fold-change';

    var volcanoPlot = volcanoPlot()
        .xAxisLabel(xLabel)
        .yAxisLabel(yLabel)
        .foldChangeThreshold(2.0)
        .sampleID("gene")
        .xColumn("log2(fold_change)")
        .yColumn("q_value");

    d3.select('#chart')
        .data([[{"gene" : "C13orf15", "log2(fold_change)" : -3.26837, "q_value" : 2.50041e-13},
                {"gene" : "TSC22D3", "log2(fold_change)" : -3.26657, "q_value" : 2.50041e-13},
                {"gene" : "CRISPLD2", "log2(fold_change)" : -2.69648, "q_value" : 6.9242e-13},
                {"gene" : "PER1", "log2(fold_change)" : -3.20034, "q_value" : 3.64345e-12}]])
        .call(volcanoPlot);

    /*d3.select('#chart')
        .data([{"gene" : "C13orf15", "log2(fold_change)" : -3.26837, "avg_weight" : 2.50041e-13},
                {"gene" : "TSC22D3", "log2(fold_change)" : -3.26657, "avg_weight" : 2.50041e-13},
                {"gene" : "CRISPLD2", "log2(fold_change)" : -2.69648, "avg_weight" : 6.9242e-13},
                {"gene" : "PER1", "log2(fold_change)" : -3.20034, "avg_weight" : 3.64345e-12}])
        .call(volcanoPlot);*/

    /*d3.tsv(file, parser, function(error, data){
        if (error) console.log(error);

        d3.select('#chart')
            .data([data])
            .call(volcanoPlot);
    });*/

    // row parser to convert key values into numbers if possible
    function parser(d) {
        for (var key in d) {
            if (d.hasOwnProperty(key)) {
                d[key] = numberParser(d[key]);
            }
        }
        return d;
    }

    // function to turn string into number if possible
    function numberParser(value){
        return (+value) ? +value : value;
    }
</script>