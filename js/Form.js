(function () {
   var util = YAHOO.util, lang = YAHOO.lang, Event = YAHOO.util.Event, inputEx = YAHOO.inputEx, Dom = util.Dom;

/**
 * @class Create a group of fields within a FORM tag and adds buttons
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options The following options are added for Forms:
 * <ul>
 *   <li>buttons: list of button definition objects {value: 'Click Me', type: 'submit'}</li>
 *   <li>ajax: send the form through an ajax request (submit button should be present): {method: 'POST', uri: 'myScript.php', callback: same as YAHOO.util.Connect.asyncRequest callback}</li>
 *   <li>showMask: adds a mask over the form while the request is running (default is false)</li>
 * </ul>
 */
inputEx.Form = function(options) {
   inputEx.Form.superclass.constructor.call(this, options);
};

lang.extend(inputEx.Form, inputEx.Group,
/**
 * @scope inputEx.Form.prototype
 */
{

   /**
    * Adds buttons and set ajax default parameters
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.Form.superclass.setOptions.call(this, options);

      this.buttons = [];

      this.options.buttons = options.buttons || [];

      this.options.action = options.action;
   	this.options.method = options.method;

      if(options.ajax) {
         this.options.ajax = {};
         this.options.ajax.method = options.ajax.method || 'POST';
         this.options.ajax.uri = options.ajax.uri || 'default.php';
         this.options.ajax.callback = options.ajax.callback || {};
         this.options.ajax.callback.scope = options.ajax.callback.scope || this;
         this.options.ajax.showMask = lang.isUndefined(options.ajax.showMask) ? false : options.ajax.showMask;
      }
   },

    /**
     * Render the group
     */
    render: function() {
        var formId = this.options.id? this.options.id:YAHOO.util.Dom.generateId();

        // Create the div wrapper for this group
        this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
        this.divEl.id = formId+'-div';

        // Create the FORM element
        this.form = inputEx.cn('form', {id: formId, method: this.options.method || 'POST', action: this.options.action || '', className: this.options.className || 'inputEx-Form'});
        this.divEl.appendChild(this.form);

        // Set the autocomplete attribute to off to disable firefox autocompletion
        this.form.setAttribute('autocomplete', 'off');

        // Set the name of the form
        if (this.options.formName) { this.form.name = this.options.formName; }

        if (YAHOO.lang.isArray(this.options.fields)) {
            // check if there will be more than one fieldset
            var groupCount = 0, isPrevFieldAGroup = false, hasGroup=false;
            for (var i = 0,f; f = this.options.fields[i]; i++) {
                if (f.type=='group') hasGroup=true;
                if (i==0 || isPrevFieldAGroup){
                    groupCount++;
                }else if (isPrevFieldAGroup && f.type != 'group'){ // standalone field after a group
                    groupCount++;
                }
                isPrevFieldAGroup = (f.type=='group')
            }

            if (groupCount>1||hasGroup){ // create a LI for every group
                var groupIndex = 0;
                var ul = inputEx.cn('ul',{id:formId+'-list'});
                var fieldset = []
                for (var i = 0,f; f = this.options.fields[i]; i++) {

                    if (f.type == 'group'){ fieldset = f.fields; }else{ fieldset.push(f); }

                    /**
                     * perform renderFields in the following conditions:
                     * 1. when it's the last field
                     * 2. when it's a group
                     * 3. when the next field is a group
                     */
                    if (i==this.options.fields.length-1 || f.type=='group' || this.options.fields[i+1].type=='group'){
                        var groupId = formId+'-group'+groupIndex;
                        var li = inputEx.cn('li',{id:groupId+'-li'});


                        //TODO: refactor the form and group rendering logic
                        var groupCfg = (f.type=='group')?f:{fields:fieldset}
                        groupCfg.parentEl = li
                        groupCfg.id = groupId

                        //for simple form, create the header as H3, or other form, such as tabView, create it differently
                        if (groupCfg.header){
                            var groupHeader = inputEx.cn('h3')
                            groupHeader.innerHTML = groupCfg.header
                            li.appendChild(groupHeader);
                        }

                        new YAHOO.inputEx.Group(groupCfg); //TODO: consider to store the references to the group in the form
                        fieldset = [];
                        ul.appendChild(li);
                        groupIndex++;
                    }
                }

                this.form.appendChild(ul);

            }else{
                var groupId = formId+'-group0';
                var groupCfg = this.options.fields.length==1?this.options.fields[0]:this.options; //if fiels is a single group or fields without group
                groupCfg.parentEl = this.form
                groupCfg.id = groupId

                new YAHOO.inputEx.Group(groupCfg);
            }
        } else { // a form with a single field
            this.renderFields(this.form);
        }

        this.renderButtons();

        if (this.options.disabled) {
            this.disable();
        }
    },

   /**
    * Render the buttons
    */
   renderButtons: function() {

      this.buttonDiv = inputEx.cn('div', {className: 'inputEx-Form-buttonBar'});

	   var button, buttonEl;
	   for(var i = 0 ; i < this.options.buttons.length ; i++ ) {
	      button = this.options.buttons[i];
	      buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
	      if( button.onClick ) { buttonEl.onclick = button.onClick; }
	      this.buttons.push(buttonEl);
	      this.buttonDiv.appendChild(buttonEl);
	   }

	   this.form.appendChild(this.buttonDiv);
   },


   /**
    * Init the events
    */
   initEvents: function() {
      inputEx.Form.superclass.initEvents.call(this);

      // Handle the submit event
      Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
   },

   /**
    * Intercept the 'onsubmit' event and stop it if !validate
    * If the ajax option object is set, use YUI async Request to send the form
    * @param {Event} e The original onSubmit event
    */
   onSubmit: function(e) {
	   if ( !this.validate() ) {
		   Event.stopEvent(e);
	   }
	   if(this.options.ajax) {
		   Event.stopEvent(e);
	      this.asyncRequest();
	   }
   },

   /**
    * Send the form value in JSON through an ajax request
    */
   asyncRequest: function() {

      if(this.options.ajax.showMask) { this.showMask(); }
	   var postData = "value="+lang.JSON.stringify(this.getValue());
      util.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, {
         success: function(o) {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.success) ) {
               this.options.ajax.callback.success.call(this.options.ajax.callback.scope,o);
            }
         },

         failure: function(o) {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.failure) ) {
               this.options.ajax.callback.failure.call(this.options.ajax.callback.scope,o);
            }
         },

         scope:this
      }, postData);
   },

   /**
    * Create a Mask over the form
    */
   renderMask: function() {
      if(this.maskRendered) return;

      // position as "relative" to position formMask inside as "absolute"
      Dom.setStyle(this.divEl, "position", "relative");

      // set zoom = 1 to fix hasLayout issue with IE6/7
      if (YAHOO.env.ua.ie) { Dom.setStyle(this.divEl, "zoom", 1); }

      // Render mask over the divEl
      this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'},
         {
            display: 'none',
            // Use offsetWidth instead of Dom.getStyle(this.divEl,"width") because
            // would return "auto" with IE instead of size in px
            width: this.divEl.offsetWidth+"px",
            height: this.divEl.offsetHeight+"px"
         },
         "<div/><center><br /><img src='../images/spinner.gif'/><br /><span>"+inputEx.messages.ajaxWait+"</span></center>");
      this.divEl.appendChild(this.formMask);
      this.maskRendered = true;
   },

   /**
    * Show the form mask
    */
   showMask: function() {
      this.renderMask();

      // Hide selects in IE 6
      this.toggleSelectsInIE(false);

      this.formMask.style.display = '';
   },

   /**
    * Hide the form mask
    */
   hideMask: function() {

      // Show selects back in IE 6
      this.toggleSelectsInIE(true);

      this.formMask.style.display = 'none';
   },

   /*
   * Method to hide selects in IE 6 when masking the form (else they would appear over the mask)
   */
   toggleSelectsInIE: function(show) {
      // IE 6 only
      if (!!YAHOO.env.ua.ie && YAHOO.env.ua.ie < 7) {
         var method = !!show ? YAHOO.util.Dom.removeClass : YAHOO.util.Dom.addClass;
         var that = this;
         YAHOO.util.Dom.getElementsBy(
            function() {return true;},
            "select",
            this.divEl,
                 function(el) {method.call(that,el,"inputEx-hidden");}
         );
      }
   },


   /**
    * Enable all fields and buttons in the form
    */
   enable: function() {
      inputEx.Form.superclass.enable.call(this);
      for (var i = 0 ; i < this.buttons.length ; i++) {
 	      this.buttons[i].disabled = false;
      }
   },

   /**
    * Disable all fields and buttons in the form
    */
   disable: function() {
      inputEx.Form.superclass.disable.call(this);
      for (var i = 0 ; i < this.buttons.length ; i++) {
 	      this.buttons[i].disabled = true;
      }
   }

});


// Specific waiting message in ajax submit
inputEx.messages.ajaxWait = "Please wait...";;

/**
* Register this class as "form" type
*/
inputEx.registerType("form", inputEx.Form);


})();
