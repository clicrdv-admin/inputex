/**
 * @fileoverview a global inputEx that provide an additional way to boostrap a YUI3 instance
 */
if (typeof(inputEx) === 'undefined') {
    var inputEx = {
        loaded:false,
        //TODO enhance it to allow users to override YUI configurations
        YUI : function(cfg) {
            if (typeof(YUI) === 'undefined' && !inputEx.loaded) {
                var w = window.d = document,l = d.location,ld = 'yui.yahooapis.com/3.0.0pr2/build/yui/yui-min.js';
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
                        var merged = inputEx.getProfile(cfg ? cfg.inputExBase : null)
                        YUI().use(function(Y) {
                            merged = Y.merge(merged, cfg)
                        })
                        var yui = YUI(merged)
                        yui.log('created YUI instance, inputExBase: ' + merged.inputExBase + ', base: ' + merged.base, 'debug', 'inputEx')
                        YUI.use.apply(yui, arguments);
                    }
                }
            }
        },

        //TODO allow user to specify a variable to override the inputEx base path
        getProfile:function(base) {
            base = (base) ? base : 'http://inputex.googlecode.com/svn/branches/inputex-yui3/'
            //base = (base)?base:'http://inputex.googlecode.com/svn/release/inputEx-0.yui3' //TODO change this
            return {base:"http://yui.yahooapis.com/3.0.0pr2/build/", timeout: 10000,
                modules: {
                    'inputex-css':{
                        fullpath: base + 'css/inputEx.css', type:'css'
                    },
                    'inputex':{
                        fullpath:base + 'js/inputex.js', type:'js', requires:['inputex-css']
                    },
                    'field': {
                        fullpath: base + 'js/Field.js', type:'js', requires:['inputex','inputex-css','base','widget','json']
                    },
                    'stringfield': {
                        fullpath: base + 'js/fields/StringField.js', type:'js', requires:['field']
                    },
                    'urlfield': {
                        fullpath: base + 'js/fields/UrlField.js', type:'js', requires:['stringfield']
                    },
                    'emailfield': {
                        fullpath: base + 'js/fields/EmailField.js', type:'js', requires:['stringfield']
                    },
                    'checkbox': {
                        fullpath: base + 'js/fields/CheckBox.js', type:'js', requires:['field']
                    },
                    'selectfield': {
                        fullpath: base + 'js/fields/SelectField.js', type:'js', requires:['field']
                    },
                    'group':{
                        fullpath: base + 'js/Group.js', type:'js', requires:['field']
                    },
                    'form':{
                        fullpath: base + 'js/Form.js', type:'js', requires:['group']
                    },
                    'accordionform-yui2-css':{
                        fullpath: 'http://yui.yahooapis.com/combo?2.6.0/build/assets/skins/sam/skin.css', type:'css'
                    },
                    'accordionform-yui2':{
                        fullpath: 'http://yui.yahooapis.com/combo?2.6.0/build/utilities/utilities.js&2.6.0/build/container/container_core-min.js&2.6.0/build/menu/menu-min.js&2.6.0/build/button/button-min.js&2.6.0/build/editor/editor-min.js', type:'js', requires:['accordionform-yui2-css']
                    },
                    'accordionform-accordionview-css':{
                        fullpath: 'http://www.i-marco.nl/weblog/yui-accordion/accordionview/assets/skins/sam/accordionview.css', type:'css'
                    },
                    'accordionform-accordionview':{
                        fullpath: 'http://www.i-marco.nl/weblog/yui-accordion/accordionview/accordionview.js', type:'js', requires:['accordionform-accordionview-css','accordionform-yui2']
                    },
                    'accordionform':{
                        fullpath: base + 'js/forms/AccordionForm.js', type:'js', requires:['form','accordionform-accordionview']
                    },
                    'exampleform':{
                        fullpath: base + 'js/forms/ExampleForm.js', type:'js', requires:['form']
                    }
                }}
        }
    };
}
