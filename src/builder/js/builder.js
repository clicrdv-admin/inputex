
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
					  var value = Example1.myPanel.getForm().getValue();
					
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
