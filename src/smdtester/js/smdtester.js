/**
 * @module inputex-smdtester
 */
var inputEx = Y.inputEx;

/**
 * Creates a form to test various SMD files
 * @class inputEx.RPC.SMDTester
 */
inputEx.RPC.SMDTester = function(parentEl, smdList) {
   
   this.el = document.getElementById(parentEl);
   
   var selectStr = 'select smd';
   inputEx({
      type: 'select',
      label: "SMD",
      parentEl: this.el,
      choices: [{ value: selectStr }].concat((function() {
         var arr = [], i, length;
         if(!smdList){
            throw new Error("Missing 'smdList' property in options");
         }
         for (i = 0, length = smdList.length; i < length; i += 1) {
            arr.push({ value: smdList[i] });
         }
         return arr;
      }())),
      description: "Select the Service Mapping Description file"
   }).on('updated', function(value) {
      var smdFile = value;
      if(smdFile !== selectStr) {
         this.loadSMD(smdFile);
      }
      /*else {
         // TODO: clear the form ?
      }*/
   }, this, true);
   
   this.smdDescriptionEl = inputEx.cn('p');
   this.el.appendChild( this.smdDescriptionEl );
   
   this.serviceMethodEl = inputEx.cn('div');
   this.el.appendChild( this.serviceMethodEl );
   
   this.methodDescriptionEl = inputEx.cn('p');
   this.el.appendChild( this.methodDescriptionEl );
   
   this.formContainerEl = inputEx.cn('div');
   this.el.appendChild( this.formContainerEl );
   
   
   this.treeContainerEl = inputEx.cn('div');
   this.treeContainerEl.appendChild( inputEx.cn('p', null, null, 'Results :') );
   this.el.appendChild( this.treeContainerEl );
};
   
inputEx.RPC.SMDTester.prototype = {
   
   /**
    * When the user select a SMD in the select
    * @method loadSMD
    */
   loadSMD: function(smdFile) {

      this.serviceMethodEl.innerHTML = "";
      this.formContainerEl.innerHTML = "";
      
      this.service = new inputEx.RPC.Service(smdFile, { success: this.onServiceLoaded, scope: this });
   },
   
   /**
    * When the SMD has been loaded
    * @method onServiceLoaded
    */
   onServiceLoaded: function() {
      
      var selectStr, genMethods, select, key;

      // Set SMD Description :
      this.smdDescriptionEl.innerHTML = Y.Lang.isString(this.service._smd.description) ? this.service._smd.description : "";
      
      // Method Select
      selectStr = 'select a method';
      genMethods = [selectStr];
      for (key in this.service) {
         if (this.service.hasOwnProperty(key) && Y.Lang.isFunction(this.service[key])) {
            genMethods.push({ value: key });
         }
      }
      select = inputEx({
         type: 'select',
         parentEl: this.serviceMethodEl,
         choices: genMethods,
         label: 'Method',
         description: "Select the method"
      });
      
      select.on('updated', function(value) {
         var methodName = value;
         if (methodName !== selectStr) {
            this.onServiceMethod(methodName);
         }
      }, this, true);
      
      if (genMethods.length === 2) {
         select.setValue(genMethods[1]);
      }
      
   },
   
   /**
    * When a method has been selected :
    * @method onServiceMethod
    */
   onServiceMethod: function(methodName) {
      
      // Set Method Description :
      this.methodDescriptionEl.innerHTML = Y.Lang.isString(this.service[methodName].description) ? this.service[methodName].description : "";
      
      // generate the form for the given method
      this.formContainerEl.innerHTML = "";
      inputEx.RPC.generateServiceForm(this.service[methodName], { parentEl: this.formContainerEl }, {
         success: function(results) {
            this.treeContainerEl.innerHTML = "";
            new inputEx.widget.JsonTreeInspector(this.treeContainerEl, results);
         },
         scope: this
      });
   }
   
};
