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
(function () {
    var INTEND = "\t";
    var NEWLINE = "\n";
    var pPr = true;
    var intendLevel = 0;
    var intend = function(a) {
        if (!pPr) return a;
        for (var l=0; l<intendLevel; l++) {
            a[a.length] = INTEND;
        }
        return a;
    };

    var newline = function(a) {
        if (pPr) a[a.length] = NEWLINE;
        return a;
    };

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
                var a = ['['], b, f, i, l = x.length, v;
                a = newline(a);
                intendLevel++;
                for (i = 0; i < l; i += 1) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                                a = newline(a);
                            }
                            a = intend(a);
                            a[a.length] = v;
                            b = true;
                        }
                    }
                }
                intendLevel--;
                a = newline(a);
                a = intend(a);
                a[a.length] = ']';
                return a.join('');
            },
            'boolean': function (x) {
                return String(x);
            },
            'null': function (x) {
                return "null";
            },
            number: function (x) {
                return isFinite(x) ? String(x) : 'null';
            },
            object: function (x, formatedOutput) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    var a = ['{'], b, f, i, v;
                    a = newline(a);
                    intendLevel++;
                    for (i in x) {
                        v = x[i];
                        f = s[typeof v];
                        if (f) {
                            v = f(v);
                            if (typeof v == 'string') {
                                if (b) {
                                    a[a.length] = ',';
                                    a = newline(a);
                                }
                                a = intend(a);
                                a.push(s.string(i), ((pPr) ? ' : ' : ':'), v);
                                b = true;
                            }
                        }
                    }
                    intendLevel--;
                    a = newline(a);
                    a = intend(a);
                    a[a.length] = '}';
                    return a.join('');
                }
                return 'null';
            },
            string: function (x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            }
        };

    Object.prototype.toPrettyJSONString = function () {
        //pPr = prettyPrint;
        return s.object(this);
    };

    Array.prototype.toPrettyJSONString = function () {
        //pPr = prettyPrint;
        return s.array(this);
    };
})();
var g = new Y.inputEx.Group({parentEl: 'container', fields: Y.inputEx.Group.groupOptions});

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


var rebuildPreview = function() { 
   var value = g.getValue();
   var previewGroup = new Y.inputEx.Group(value);

   var groupContainer = Y.one('#groupContainer')._node;
   groupContainer.innerHTML = "";
   groupContainer.appendChild(previewGroup.getEl());

   var codeContainer = Y.one('#codeGenerator')._node;
   codeContainer.innerHTML = value.toPrettyJSONString(true);
};

rebuildPreview();

// Update the preview event
g.on('updated', rebuildPreview);


 // Generate Page:
Y.one('#generateButton').on('click', function() {

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
   var Posx = screen.width /2;
   var Posy = screen.height /2;
   Posx -= (this.windowWidth/2);
   Posy -= (this.windowHeight/2);

   var formPage = window.open("",'InputExForm','left='+Posx+',top='+Posy+
																								 ',width=850,height=600,toolbar=no,scrollbars,resizable=yes');

   formPage.document.write(html.join("\n"));
   formPage.document.close();
});


// Add a popup and a load button
Example1 = {};

Y.one("#loadButton").on("click", function() {Example1.myPanel.show();}); 

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

         try {
					  var value = Example1.myPanel.get('field').getValue();
					
						try {
					  	var code = eval('('+value.code+')');
						} catch(ex) {
							alert("Error during JSON evaluation");
							return;
						}
					
						// Build using JSON Schema
						if(value.format == "JSON Schema") {
							
							try {
							var builder = new Y.inputEx.JsonSchema.Builder({
								'schemaIdentifierMap': code,
							  'defaultOptions':{
							     'showMsg':true
							  }
						  });
						  
							var lastSchema = (function(o){
							   var r;
							   for(var k in o) {
							      if(o.hasOwnProperty(k)) {
							         r = o[k];
						         }
							   } 
							   return r;
							})(code);
							
							var m = builder.schemaToInputEx(lastSchema);
							g.setValue(m);
							
							} catch(ex) {
								return;
							}
							
						} // OR standard inputEx JSON
						else { // value.format == "inputEx JSON"
							g.setValue(code);
						}
						
						Example1.myPanel.hide();
						
					}catch(ex) {
					  if(window.console && Y.Lang.isFunction(console.log)) {
					    console.log(ex);
				    }
					}
						
						return false;
			 }},
       {type: 'link', value: 'Cancel', onClick: function() { Example1.myPanel.hide(); return false; } }
    ]
 };
	
	Example1.myPanel = new Y.inputEx.Panel({
		inputEx: formConfig,
		title: 'Copy/Paste your inputEx JSON or JSON Schema here :',
//		panelConfig: {
					constraintoviewport: true, 
					underlay:"shadow", 
					close:true, 
					fixedcenter: true,
					visible:false, 
//					draggable:true,
					plugins: [Y.Plugin.Drag],
					modal: true,
					render: true
//		}
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
        "inputex-visus",
        "dd-plugin"
    ],
    "skinnable": true
});
