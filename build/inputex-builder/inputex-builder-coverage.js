if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/inputex-builder/inputex-builder.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/inputex-builder/inputex-builder.js",
    code: []
};
_yuitest_coverage["build/inputex-builder/inputex-builder.js"].code=["YUI.add('inputex-builder', function (Y, NAME) {","","/*","    json.js","    2006-04-28","    2006-05-27 added prettyPrint argument","","    This file adds these methods to JavaScript:","","        object.toJSONString(prettyPrint)","","            This method produces a JSON text from an object. The","            object must not contain any cyclical references.","","        array.toJSONString(prettyPrint)","","            This method produces a JSON text from an array. The","            array must not contain any cyclical references.","","        string.parseJSON()","","            This method parses a JSON text to produce an object or","            array. It will return false if there is an error.","","+           added prettyPrint argument","            prettyPrint ... if set to true the resulting string will be formated","                            with tabs and returns to be more human readable.","                            by Matthias.Platzer@knallgrau.at","","*/","(function () {","    var INTEND = \"\\t\";","    var NEWLINE = \"\\n\";","    var pPr = true;","    var intendLevel = 0;","    var intend = function(a) {","        if (!pPr) return a;","        for (var l=0; l<intendLevel; l++) {","            a[a.length] = INTEND;","        }","        return a;","    };","","    var newline = function(a) {","        if (pPr) a[a.length] = NEWLINE;","        return a;","    };","","    var m = {","            '\\b': '\\\\b',","            '\\t': '\\\\t',","            '\\n': '\\\\n',","            '\\f': '\\\\f',","            '\\r': '\\\\r',","            '\"' : '\\\\\"',","            '\\\\': '\\\\\\\\'","        },","        s = {","            array: function (x) {","                var a = ['['], b, f, i, l = x.length, v;","                a = newline(a);","                intendLevel++;","                for (i = 0; i < l; i += 1) {","                    v = x[i];","                    f = s[typeof v];","                    if (f) {","                        v = f(v);","                        if (typeof v == 'string') {","                            if (b) {","                                a[a.length] = ',';","                                a = newline(a);","                            }","                            a = intend(a);","                            a[a.length] = v;","                            b = true;","                        }","                    }","                }","                intendLevel--;","                a = newline(a);","                a = intend(a);","                a[a.length] = ']';","                return a.join('');","            },","            'boolean': function (x) {","                return String(x);","            },","            'null': function (x) {","                return \"null\";","            },","            number: function (x) {","                return isFinite(x) ? String(x) : 'null';","            },","            object: function (x, formatedOutput) {","                if (x) {","                    if (x instanceof Array) {","                        return s.array(x);","                    }","                    var a = ['{'], b, f, i, v;","                    a = newline(a);","                    intendLevel++;","                    for (i in x) {","                        v = x[i];","                        f = s[typeof v];","                        if (f) {","                            v = f(v);","                            if (typeof v == 'string') {","                                if (b) {","                                    a[a.length] = ',';","                                    a = newline(a);","                                }","                                a = intend(a);","                                a.push(s.string(i), ((pPr) ? ' : ' : ':'), v);","                                b = true;","                            }","                        }","                    }","                    intendLevel--;","                    a = newline(a);","                    a = intend(a);","                    a[a.length] = '}';","                    return a.join('');","                }","                return 'null';","            },","            string: function (x) {","                if (/[\"\\\\\\x00-\\x1f]/.test(x)) {","                    x = x.replace(/([\\x00-\\x1f\\\\\"])/g, function(a, b) {","                        var c = m[b];","                        if (c) {","                            return c;","                        }","                        c = b.charCodeAt();","                        return '\\\\u00' +","                            Math.floor(c / 16).toString(16) +","                            (c % 16).toString(16);","                    });","                }","                return '\"' + x + '\"';","            }","        };","","    Object.prototype.toPrettyJSONString = function () {","        //pPr = prettyPrint;","        return s.object(this);","    };","","    Array.prototype.toPrettyJSONString = function () {","        //pPr = prettyPrint;","        return s.array(this);","    };","})();","var g = new Y.inputEx.Group({parentEl: 'container', fields: Y.inputEx.Group.groupOptions});","","g.setValue({","	\"fields\" : [","	  {","			\"type\" : \"string\",","			\"typeInvite\" : \"firstname\",","			\"name\" : \"firstname\",","			\"label\" : \"Firstname\"","		},","		{","			\"type\" : \"string\",","			\"typeInvite\" : \"lastname\",","			\"name\" : \"lastname\",","			\"label\" : \"Lastname\"","		},","		{","			\"type\" : \"email\",","			\"label\" : \"Email\",","			\"name\" : \"\",","			\"required\" : false","		}","	],","	\"collapsible\" : true,","	\"legend\" : \"User\"","}, false);","","","var rebuildPreview = function() { ","   var value = g.getValue();","   var previewGroup = new Y.inputEx.Group(value);","","   var groupContainer = Y.one('#groupContainer')._node;","   groupContainer.innerHTML = \"\";","   groupContainer.appendChild(previewGroup.getEl());","","   var codeContainer = Y.one('#codeGenerator')._node;","   codeContainer.innerHTML = value.toPrettyJSONString(true);","};","","rebuildPreview();","","// Update the preview event","g.on('updated', rebuildPreview);","",""," // Generate Page:","Y.one('#generateButton').on('click', function() {","","	var html = [","		\"<html>\",","		\"<head>\",","		\"  <title>inputEx Builder: generate inputEx Forms</title>\",","		\"  <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\\n\",","		","      \"<link rel='stylesheet' href='http://yui.yahooapis.com/3.7.2/build/cssgrids/grids-min.css'>\",","","      \"<link rel='stylesheet' href='http://yui.yahooapis.com/combo?3.7.2/build/cssreset/reset-min.css&3.7.2/build/cssfonts/fonts-min.css'>\",","      ","		\"  <style>\",","		\"#formContainer {\",","		\"background-color:#EEEEFF;\",","		\"border:1px solid #9999FF;\",","		\"margin:50px;\",","		\"padding:10px;\",","		\"}\",","		\"  </style>\",","		\"</head>\\n\",","		\"<body class='yui3-skin-sam yui-skin-sam'>\",","		\"	 <div id='formContainer'> </div>\",","		\"\",","		\"<scr\"+\"ipt type='text/javascript' src='http://yui.yahooapis.com/3.7.2/build/yui/yui-debug.js'></scr\"+\"ipt>\",","		\"<scr\"+\"ipt type='text/javascript' src='../../build/inputex-loader/inputex-loader.js'></scr\"+\"ipt>\",","		\"<scr\"+\"ipt>\",","		\"YUI_config.groups.inputex.base = '../../build/';\",","		","		  \"var formDef = \"+g.getValue().toPrettyJSONString(true)+\";\",","		","        \"YUI().use('inputex-group', function(Y) {\",","","         \" // Load the modules using Y.use (asynchronously)\",","         \" Y.inputEx.use(formDef, function(){\",","","         \"   // Instantiate the form using Y.inputEx\",","         \"   formDef.parentEl = 'formContainer';\",","         \"   new Y.inputEx.Group(formDef);\",","","         \" });\",","       \" });\",","		","		","		\"</scr\"+\"ipt>\",","		\"</body>\",","		\"</html>\"","	];","","   // Center popup","   var Posx = screen.width /2;","   var Posy = screen.height /2;","   Posx -= (this.windowWidth/2);","   Posy -= (this.windowHeight/2);","","   var formPage = window.open(\"\",'InputExForm','left='+Posx+',top='+Posy+","																								 ',width=850,height=600,toolbar=no,scrollbars,resizable=yes');","","   formPage.document.write(html.join(\"\\n\"));","   formPage.document.close();","});","","","// Add a popup and a load button","Example1 = {};","","Y.one(\"#loadButton\").on(\"click\", function() {Example1.myPanel.show();}); ","","var formConfig = {","    type: 'form',","    fields: [ ","				{type: 'text', name: 'code', cols: 50, rows: 10 },","				{","				   type: \"radio\",","					label : \"Format\",","					name : \"format\",","					choices : [\"inputEx JSON\",\"JSON Schema\"],","					value: \"inputEx JSON\"","				}","			],","    buttons: [","       {type: 'submit', value: 'Load', onClick: function() { ","","         try {","					  var value = Example1.myPanel.getForm().getValue();","					","						try {","					  	var code = eval('('+value.code+')');","						} catch(ex) {","							alert(\"Error during JSON evaluation\");","							return;","						}","					","						// Build using JSON Schema","						if(value.format == \"JSON Schema\") {","							","							try {","							var builder = new Y.inputEx.JsonSchema.Builder({","								'schemaIdentifierMap': code,","							  'defaultOptions':{","							     'showMsg':true","							  }","						  });","						  ","							var lastSchema = (function(o){","							   var r;","							   for(var k in o) {","							      if(o.hasOwnProperty(k)) {","							         r = o[k];","						         }","							   } ","							   return r;","							})(code);","							","							var m = builder.schemaToInputEx(lastSchema);","							g.setValue(m);","							","							} catch(ex) {","								return;","							}","							","						} // OR standard inputEx JSON","						else { // value.format == \"inputEx JSON\"","							g.setValue(code);","						}","						","						Example1.myPanel.hide();","						","					}catch(ex) {","					  if(window.console && Y.Lang.isFunction(console.log)) {","					    console.log(ex);","				    }","					}","						","						return false;","			 }},","       {type: 'link', value: 'Cancel', onClick: function() { Example1.myPanel.hide(); return false; } }","    ]"," };","	","	Example1.myPanel = new Y.inputEx.Panel({","		inputExDef: formConfig,","		title: 'Copy/Paste your inputEx JSON or JSON Schema here :',","		panelConfig: {","					constraintoviewport: true, ","					underlay:\"shadow\", ","					close:true, ","					fixedcenter: true,","					visible:false, ","					draggable:true,","					modal: true","		}","	});","","","}, '@VERSION@', {","    \"requires\": [","        \"inputex\",","        \"inputex-autocomplete\",","        \"inputex-base\",","        \"inputex-button\",","        \"inputex-checkbox\",","        \"inputex-choice\",","        \"inputex-color\",","        \"inputex-combine\",","        \"inputex-datatable\",","        \"inputex-date\",","        \"inputex-datepicker\",","        \"inputex-dateselectmonth\",","        \"inputex-datesplit\",","        \"inputex-datetime\",","        \"inputex-ddlist\",","        \"inputex-dsselect\",","        \"inputex-email\",","        \"inputex-field\",","        \"inputex-file\",","        \"inputex-form\",","        \"inputex-group\",","        \"inputex-hidden\",","        \"inputex-imagecropper\",","        \"inputex-inplaceedit\",","        \"inputex-integer\",","        \"inputex-ipv4\",","        \"inputex-jsonschema\",","        \"inputex-jsontreeinspector\",","        \"inputex-keyopvalue\",","        \"inputex-keyvalue\",","        \"inputex-lens\",","        \"inputex-linkedcombo\",","        \"inputex-list\",","        \"inputex-map\",","        \"inputex-menu\",","        \"inputex-multiautocomplete\",","        \"inputex-multiselect\",","        \"inputex-number\",","        \"inputex-object\",","        \"inputex-panel\",","        \"inputex-password\",","        \"inputex-radio\",","        \"inputex-ratingstars\",","        \"inputex-ratingstarsform\",","        \"inputex-rpc\",","        \"inputex-rte\",","        \"inputex-select\",","        \"inputex-serialize\",","        \"inputex-slider\",","        \"inputex-smdtester\",","        \"inputex-string\",","        \"inputex-stringavailability\",","        \"inputex-textarea\",","        \"inputex-textautotag\",","        \"inputex-time\",","        \"inputex-timeinterval\",","        \"inputex-timerange\",","        \"inputex-tinymce\",","        \"inputex-tree\",","        \"inputex-type\",","        \"inputex-uneditable\",","        \"inputex-uppercase\",","        \"inputex-url\",","        \"inputex-vector\",","        \"inputex-visus\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/inputex-builder/inputex-builder.js"].lines = {"1":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"41":0,"44":0,"45":0,"46":0,"49":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"73":0,"74":0,"75":0,"79":0,"80":0,"81":0,"82":0,"83":0,"86":0,"89":0,"92":0,"95":0,"96":0,"97":0,"99":0,"100":0,"101":0,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"112":0,"113":0,"114":0,"118":0,"119":0,"120":0,"121":0,"122":0,"124":0,"127":0,"128":0,"129":0,"130":0,"131":0,"133":0,"134":0,"139":0,"143":0,"145":0,"148":0,"150":0,"153":0,"155":0,"181":0,"182":0,"183":0,"185":0,"186":0,"187":0,"189":0,"190":0,"193":0,"196":0,"200":0,"202":0,"250":0,"251":0,"252":0,"253":0,"255":0,"258":0,"259":0,"264":0,"266":0,"268":0,"283":0,"284":0,"286":0,"287":0,"289":0,"290":0,"294":0,"296":0,"297":0,"304":0,"305":0,"306":0,"307":0,"308":0,"311":0,"314":0,"315":0,"318":0,"323":0,"326":0,"329":0,"330":0,"334":0,"336":0,"340":0};
_yuitest_coverage["build/inputex-builder/inputex-builder.js"].functions = {"intend:36":0,"newline:44":0,"array:59":0,"\'boolean\':85":0,"\'null\':88":0,"number:91":0,"object:94":0,"(anonymous 3):128":0,"string:126":0,"toPrettyJSONString:143":0,"toPrettyJSONString:148":0,"(anonymous 2):31":0,"rebuildPreview:181":0,"(anonymous 4):200":0,"(anonymous 5):266":0,"(anonymous 6):304":0,"onClick:281":0,"onClick:336":0,"(anonymous 1):1":0};
_yuitest_coverage["build/inputex-builder/inputex-builder.js"].coveredLines = 123;
_yuitest_coverage["build/inputex-builder/inputex-builder.js"].coveredFunctions = 19;
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 1);
YUI.add('inputex-builder', function (Y, NAME) {

/*
    json.js
    2006-04-28
    2006-05-27 added prettyPrint argument

    This file adds these methods to JavaScript:

        object.toJSONString(prettyPrint)

            This method produces a JSON text from an object. The
            object must not contain any cyclical references.

        array.toJSONString(prettyPrint)

            This method produces a JSON text from an array. The
            array must not contain any cyclical references.

        string.parseJSON()

            This method parses a JSON text to produce an object or
            array. It will return false if there is an error.

+           added prettyPrint argument
            prettyPrint ... if set to true the resulting string will be formated
                            with tabs and returns to be more human readable.
                            by Matthias.Platzer@knallgrau.at

*/
_yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 1)", 1);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 31);
(function () {
    _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 2)", 31);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 32);
var INTEND = "\t";
    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 33);
var NEWLINE = "\n";
    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 34);
var pPr = true;
    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 35);
var intendLevel = 0;
    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 36);
var intend = function(a) {
        _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "intend", 36);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 37);
if (!pPr) {return a;}
        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 38);
for (var l=0; l<intendLevel; l++) {
            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 39);
a[a.length] = INTEND;
        }
        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 41);
return a;
    };

    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 44);
var newline = function(a) {
        _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "newline", 44);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 45);
if (pPr) {a[a.length] = NEWLINE;}
        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 46);
return a;
    };

    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 49);
var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        s = {
            array: function (x) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "array", 59);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 60);
var a = ['['], b, f, i, l = x.length, v;
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 61);
a = newline(a);
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 62);
intendLevel++;
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 63);
for (i = 0; i < l; i += 1) {
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 64);
v = x[i];
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 65);
f = s[typeof v];
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 66);
if (f) {
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 67);
v = f(v);
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 68);
if (typeof v == 'string') {
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 69);
if (b) {
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 70);
a[a.length] = ',';
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 71);
a = newline(a);
                            }
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 73);
a = intend(a);
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 74);
a[a.length] = v;
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 75);
b = true;
                        }
                    }
                }
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 79);
intendLevel--;
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 80);
a = newline(a);
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 81);
a = intend(a);
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 82);
a[a.length] = ']';
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 83);
return a.join('');
            },
            'boolean': function (x) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "\'boolean\'", 85);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 86);
return String(x);
            },
            'null': function (x) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "\'null\'", 88);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 89);
return "null";
            },
            number: function (x) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "number", 91);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 92);
return isFinite(x) ? String(x) : 'null';
            },
            object: function (x, formatedOutput) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "object", 94);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 95);
if (x) {
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 96);
if (x instanceof Array) {
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 97);
return s.array(x);
                    }
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 99);
var a = ['{'], b, f, i, v;
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 100);
a = newline(a);
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 101);
intendLevel++;
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 102);
for (i in x) {
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 103);
v = x[i];
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 104);
f = s[typeof v];
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 105);
if (f) {
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 106);
v = f(v);
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 107);
if (typeof v == 'string') {
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 108);
if (b) {
                                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 109);
a[a.length] = ',';
                                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 110);
a = newline(a);
                                }
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 112);
a = intend(a);
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 113);
a.push(s.string(i), ((pPr) ? ' : ' : ':'), v);
                                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 114);
b = true;
                            }
                        }
                    }
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 118);
intendLevel--;
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 119);
a = newline(a);
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 120);
a = intend(a);
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 121);
a[a.length] = '}';
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 122);
return a.join('');
                }
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 124);
return 'null';
            },
            string: function (x) {
                _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "string", 126);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 127);
if (/["\\\x00-\x1f]/.test(x)) {
                    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 128);
x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 3)", 128);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 129);
var c = m[b];
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 130);
if (c) {
                            _yuitest_coverline("build/inputex-builder/inputex-builder.js", 131);
return c;
                        }
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 133);
c = b.charCodeAt();
                        _yuitest_coverline("build/inputex-builder/inputex-builder.js", 134);
return '\\u00' +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    });
                }
                _yuitest_coverline("build/inputex-builder/inputex-builder.js", 139);
return '"' + x + '"';
            }
        };

    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 143);
Object.prototype.toPrettyJSONString = function () {
        //pPr = prettyPrint;
        _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "toPrettyJSONString", 143);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 145);
return s.object(this);
    };

    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 148);
Array.prototype.toPrettyJSONString = function () {
        //pPr = prettyPrint;
        _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "toPrettyJSONString", 148);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 150);
return s.array(this);
    };
})();
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 153);
var g = new Y.inputEx.Group({parentEl: 'container', fields: Y.inputEx.Group.groupOptions});

_yuitest_coverline("build/inputex-builder/inputex-builder.js", 155);
g.setValue({
	"fields" : [
	  {
			"type" : "string",
			"typeInvite" : "firstname",
			"name" : "firstname",
			"label" : "Firstname"
		},
		{
			"type" : "string",
			"typeInvite" : "lastname",
			"name" : "lastname",
			"label" : "Lastname"
		},
		{
			"type" : "email",
			"label" : "Email",
			"name" : "",
			"required" : false
		}
	],
	"collapsible" : true,
	"legend" : "User"
}, false);


_yuitest_coverline("build/inputex-builder/inputex-builder.js", 181);
var rebuildPreview = function() { 
   _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "rebuildPreview", 181);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 182);
var value = g.getValue();
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 183);
var previewGroup = new Y.inputEx.Group(value);

   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 185);
var groupContainer = Y.one('#groupContainer')._node;
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 186);
groupContainer.innerHTML = "";
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 187);
groupContainer.appendChild(previewGroup.getEl());

   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 189);
var codeContainer = Y.one('#codeGenerator')._node;
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 190);
codeContainer.innerHTML = value.toPrettyJSONString(true);
};

_yuitest_coverline("build/inputex-builder/inputex-builder.js", 193);
rebuildPreview();

// Update the preview event
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 196);
g.on('updated', rebuildPreview);


 // Generate Page:
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 200);
Y.one('#generateButton').on('click', function() {

	_yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 4)", 200);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 202);
var html = [
		"<html>",
		"<head>",
		"  <title>inputEx Builder: generate inputEx Forms</title>",
		"  <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\n",
		
      "<link rel='stylesheet' href='http://yui.yahooapis.com/3.7.2/build/cssgrids/grids-min.css'>",

      "<link rel='stylesheet' href='http://yui.yahooapis.com/combo?3.7.2/build/cssreset/reset-min.css&3.7.2/build/cssfonts/fonts-min.css'>",
      
		"  <style>",
		"#formContainer {",
		"background-color:#EEEEFF;",
		"border:1px solid #9999FF;",
		"margin:50px;",
		"padding:10px;",
		"}",
		"  </style>",
		"</head>\n",
		"<body class='yui3-skin-sam yui-skin-sam'>",
		"	 <div id='formContainer'> </div>",
		"",
		"<scr"+"ipt type='text/javascript' src='http://yui.yahooapis.com/3.7.2/build/yui/yui-debug.js'></scr"+"ipt>",
		"<scr"+"ipt type='text/javascript' src='../../build/inputex-loader/inputex-loader.js'></scr"+"ipt>",
		"<scr"+"ipt>",
		"YUI_config.groups.inputex.base = '../../build/';",
		
		  "var formDef = "+g.getValue().toPrettyJSONString(true)+";",
		
        "YUI().use('inputex-group', function(Y) {",

         " // Load the modules using Y.use (asynchronously)",
         " Y.inputEx.use(formDef, function(){",

         "   // Instantiate the form using Y.inputEx",
         "   formDef.parentEl = 'formContainer';",
         "   new Y.inputEx.Group(formDef);",

         " });",
       " });",
		
		
		"</scr"+"ipt>",
		"</body>",
		"</html>"
	];

   // Center popup
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 250);
var Posx = screen.width /2;
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 251);
var Posy = screen.height /2;
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 252);
Posx -= (this.windowWidth/2);
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 253);
Posy -= (this.windowHeight/2);

   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 255);
var formPage = window.open("",'InputExForm','left='+Posx+',top='+Posy+
																								 ',width=850,height=600,toolbar=no,scrollbars,resizable=yes');

   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 258);
formPage.document.write(html.join("\n"));
   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 259);
formPage.document.close();
});


// Add a popup and a load button
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 264);
Example1 = {};

_yuitest_coverline("build/inputex-builder/inputex-builder.js", 266);
Y.one("#loadButton").on("click", function() {_yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 5)", 266);
Example1.myPanel.show();}); 

_yuitest_coverline("build/inputex-builder/inputex-builder.js", 268);
var formConfig = {
    type: 'form',
    fields: [ 
				{type: 'text', name: 'code', cols: 50, rows: 10 },
				{
				   type: "radio",
					label : "Format",
					name : "format",
					choices : ["inputEx JSON","JSON Schema"],
					value: "inputEx JSON"
				}
			],
    buttons: [
       {type: 'submit', value: 'Load', onClick: function() { 

         _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "onClick", 281);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 283);
try {
					  _yuitest_coverline("build/inputex-builder/inputex-builder.js", 284);
var value = Example1.myPanel.getForm().getValue();
					
						_yuitest_coverline("build/inputex-builder/inputex-builder.js", 286);
try {
					  	_yuitest_coverline("build/inputex-builder/inputex-builder.js", 287);
var code = eval('('+value.code+')');
						} catch(ex) {
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 289);
alert("Error during JSON evaluation");
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 290);
return;
						}
					
						// Build using JSON Schema
						_yuitest_coverline("build/inputex-builder/inputex-builder.js", 294);
if(value.format == "JSON Schema") {
							
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 296);
try {
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 297);
var builder = new Y.inputEx.JsonSchema.Builder({
								'schemaIdentifierMap': code,
							  'defaultOptions':{
							     'showMsg':true
							  }
						  });
						  
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 304);
var lastSchema = (function(o){
							   _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "(anonymous 6)", 304);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 305);
var r;
							   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 306);
for(var k in o) {
							      _yuitest_coverline("build/inputex-builder/inputex-builder.js", 307);
if(o.hasOwnProperty(k)) {
							         _yuitest_coverline("build/inputex-builder/inputex-builder.js", 308);
r = o[k];
						         }
							   } 
							   _yuitest_coverline("build/inputex-builder/inputex-builder.js", 311);
return r;
							})(code);
							
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 314);
var m = builder.schemaToInputEx(lastSchema);
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 315);
g.setValue(m);
							
							} catch(ex) {
								_yuitest_coverline("build/inputex-builder/inputex-builder.js", 318);
return;
							}
							
						} // OR standard inputEx JSON
						else { // value.format == "inputEx JSON"
							_yuitest_coverline("build/inputex-builder/inputex-builder.js", 323);
g.setValue(code);
						}
						
						_yuitest_coverline("build/inputex-builder/inputex-builder.js", 326);
Example1.myPanel.hide();
						
					}catch(ex) {
					  _yuitest_coverline("build/inputex-builder/inputex-builder.js", 329);
if(window.console && Y.Lang.isFunction(console.log)) {
					    _yuitest_coverline("build/inputex-builder/inputex-builder.js", 330);
console.log(ex);
				    }
					}
						
						_yuitest_coverline("build/inputex-builder/inputex-builder.js", 334);
return false;
			 }},
       {type: 'link', value: 'Cancel', onClick: function() { _yuitest_coverfunc("build/inputex-builder/inputex-builder.js", "onClick", 336);
_yuitest_coverline("build/inputex-builder/inputex-builder.js", 336);
Example1.myPanel.hide(); return false; } }
    ]
 };
	
	_yuitest_coverline("build/inputex-builder/inputex-builder.js", 340);
Example1.myPanel = new Y.inputEx.Panel({
		inputExDef: formConfig,
		title: 'Copy/Paste your inputEx JSON or JSON Schema here :',
		panelConfig: {
					constraintoviewport: true, 
					underlay:"shadow", 
					close:true, 
					fixedcenter: true,
					visible:false, 
					draggable:true,
					modal: true
		}
	});


}, '@VERSION@', {
    "requires": [
        "inputex",
        "inputex-autocomplete",
        "inputex-base",
        "inputex-button",
        "inputex-checkbox",
        "inputex-choice",
        "inputex-color",
        "inputex-combine",
        "inputex-datatable",
        "inputex-date",
        "inputex-datepicker",
        "inputex-dateselectmonth",
        "inputex-datesplit",
        "inputex-datetime",
        "inputex-ddlist",
        "inputex-dsselect",
        "inputex-email",
        "inputex-field",
        "inputex-file",
        "inputex-form",
        "inputex-group",
        "inputex-hidden",
        "inputex-imagecropper",
        "inputex-inplaceedit",
        "inputex-integer",
        "inputex-ipv4",
        "inputex-jsonschema",
        "inputex-jsontreeinspector",
        "inputex-keyopvalue",
        "inputex-keyvalue",
        "inputex-lens",
        "inputex-linkedcombo",
        "inputex-list",
        "inputex-map",
        "inputex-menu",
        "inputex-multiautocomplete",
        "inputex-multiselect",
        "inputex-number",
        "inputex-object",
        "inputex-panel",
        "inputex-password",
        "inputex-radio",
        "inputex-ratingstars",
        "inputex-ratingstarsform",
        "inputex-rpc",
        "inputex-rte",
        "inputex-select",
        "inputex-serialize",
        "inputex-slider",
        "inputex-smdtester",
        "inputex-string",
        "inputex-stringavailability",
        "inputex-textarea",
        "inputex-textautotag",
        "inputex-time",
        "inputex-timeinterval",
        "inputex-timerange",
        "inputex-tinymce",
        "inputex-tree",
        "inputex-type",
        "inputex-uneditable",
        "inputex-uppercase",
        "inputex-url",
        "inputex-vector",
        "inputex-visus"
    ],
    "skinnable": true
});
