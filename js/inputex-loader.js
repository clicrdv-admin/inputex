/**
 * @fileoverview a global inputEx that provide an additional way to boostrap a YUI3 instance
 */
if (typeof(inputEx) === 'undefined') {
    var inputEx = {
        loaded:false,
        //TODO enhance it to allow users to override YUI configurations
        YUI : function(cfg) {
            if (typeof(YUI) === 'undefined' && !inputEx.loaded) {
                var w = window.d = document,l = d.location,ld = 'yui.yahooapis.com/3.0.0pr1/build/yui/yui-min.js';
                var _s = d.createElement('script');
                //_s.src = 'http' + (l.location == 'https' ? 's' : '') + '://' + ld;
                _s.src = (cfg && cfg.base) ? cfg.base + 'yui/yui-min.js' : 'http://' + ld;
                d.getElementsByTagName('head')[0].appendChild(_s);
                inputEx.loaded = true;
            }

            return {
                cfg:cfg,
                args:null,
                use:function() {
                    this.args = arguments
                    if (typeof(YUI) === 'undefined') {
                        var that = this
                        function delegate() { that.use.apply(that, that.args); }
                        window.setTimeout(delegate, 500)
                    } else {
                        var merged = inputEx.yuiProfile
                        YUI().use(function(Y) { merged = Y.merge(merged, cfg)})
                        YUI.use.apply(YUI(merged), arguments);
                    }
                }
            }
        },

        //TODO allow user to specify a variable to override the inputEx base path
        yuiProfile :{base:"http://yui.yahooapis.com/3.0.0pr1/build/", timeout: 10000,
            modules: {
                'inputex-css':{
                    fullpath:"../css/inputEx.css", type:'css'
                },
                'inputex':{
                    fullpath:'../js/inputex.js', type:'js', requires:['inputex-css']
                },
                'field': {
                    fullpath: "../js/Field.js", type:'js', requires:['inputex','inputex-css','base','node','json']
                },
                'stringfield': {
                    fullpath: "../js/fields/StringField.js", type:'js', requires:['field']
                },
                'urlfield': {
                    fullpath: "../js/fields/UrlField.js", type:'js', requires:['stringfield']
                },
                'emailfield': {
                    fullpath: "../js/fields/EmailField.js", type:'js', requires:['stringfield']
                },
                'checkbox': {
                    fullpath: "../js/fields/CheckBox.js", type:'js', requires:['field']
                },
                'selectfield': {
                    fullpath: "../js/fields/SelectField.js", type:'js', requires:['field']
                },
                'group':{
                    fullpath: '../js/Group.js', type:'js', requires:['field']
                },
                'form':{
                    fullpath: '../js/Form.js', type:'js', requires:['group']
                }
            }}
    };
}
