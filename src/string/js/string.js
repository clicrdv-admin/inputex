/**
 * @module inputex-string
 */
   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Basic string field (equivalent to the input type "text")
 * @class inputEx.StringField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *   <li>regexp: regular expression used to validate (otherwise it always validate)</li>
 *   <li>size: size attribute of the input</li>
 *   <li>maxLength: maximum size of the string field (no message display, uses the maxlength html attribute)</li>
 *   <li>minLength: minimum size of the string field (will display an error message if shorter)</li>
 *   <li>typeInvite: string displayed when the field is empty</li>
 *   <li>readonly: set the field as readonly</li>
 * </ul>
 */
inputEx.StringField = function(options) {
   inputEx.StringField.superclass.constructor.call(this, options);

     if(this.options.typeInvite) {
        this.updateTypeInvite();
     }
};

Y.extend(inputEx.StringField, inputEx.Field, {
   /**
    * Set the default values of the options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.StringField.superclass.setOptions.call(this, options);

      // I18N
      this.messages = Y.mix(this.messages,Y.Intl.get("inputex-string"));

      this.options.regexp = options.regexp;
      this.options.size = options.size;
      this.options.maxLength = options.maxLength;
      this.options.minLength = options.minLength;

      // if supported placeholder
      if (document.createElement("input").placeholder !== undefined) {
        this.options.placeholder = options.placeholder? options.placeholder:options.typeInvite;
      }
      // if not supported typeInvite
      else {
        this.options.typeInvite = options.placeholder? options.placeholder:options.typeInvite;
      }

      this.options.readonly = options.readonly;

      // possible values: "on", "off", or "default" (= inherit from attribute set on form tag)
      // see: https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-autocomplete
      this.options.autocomplete = !lang.isUndefined(options.autocomplete) ? options.autocomplete : "default";
      this.options.trim = (options.trim === true) ? true : false;
   },


   /**
    * Render an 'INPUT' DOM node
    * @method renderComponent
    */
   renderComponent: function() {

      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});

      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      attributes.id = this.divEl.id?this.divEl.id+'-field':Y.guid();
      if(this.options.size) { attributes.size = this.options.size; }
      if(this.options.name) { attributes.name = this.options.name; }
      if(this.options.readonly) { attributes.readonly = 'readonly'; }

      if(this.options.maxLength) { attributes.maxLength = this.options.maxLength; }
      // don't set the autocomplete attribute when "default" (the input will adopt the form's behavior regarding autocomplete)
      if(this.options.autocomplete !== "default") { attributes.autocomplete = this.options.autocomplete; }

      // rsi
      if(this.options.required){
         attributes.required = "required";
         attributes["aria-required"] = true;
      }

      // placeholder
      if (this.options.placeholder) {
        attributes.placeholder = this.options.placeholder;
      }

      // Create the node
      this.el = inputEx.cn('input', attributes);

      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.fieldContainer.appendChild(this.wrapEl);
   },

   /**
    * Set the name of the field (or hidden field)
    * @method setFieldName
    */
   setFieldName: function(name) {
      this.el.name = name;
   },

   /**
    * Register the change, focus and blur events
    * @method initEvents
    */
   initEvents: function() {
     Y.on("change", this.onChange,this.el, this);

       if (Y.UA.ie > 0){ // refer to inputEx-95
            var field = this.el;
            Y.on("key", function(e){
              field.blur();
              field.focus();
            }, this.el,'down:13', this);
       }

     Y.on("focus", this.onFocus,this.el, this);
     Y.on("blur", this.onBlur,this.el, this);
     Y.on("keypress", this.onKeyPress, this.el, this);
     Y.on("keyup", this.onKeyUp, this.el, this);
   },

   /**
    * Return the string value
    * @method getValue
    * @param {String} The string value
    */
   getValue: function() {

      var value = (this.options.typeInvite && this.el.value == this.options.typeInvite) ? '' : this.el.value;

      if (this.options.trim) {
         value = lang.trim(value);
      }

      return value;
   },

   /**
    * Function to set the value
    * @method setValue
    * @param {String} value The new value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      // + check : if Null or Undefined we put '' in the stringField
      this.el.value = ( lang.isNull(value) || lang.isUndefined(value) ) ? '' : value;

      // call parent class method to set style and fire "updated" event
      inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
   },

   /**
    * Uses the optional regexp to validate the field value
    * @method validate
    */
   validate: function () {

      // NOTE: don't use this.getValue directly, so that when it's overriden
      //       in fields like IntegerField, string validations are still tested
      //       against a string.
      var value = inputEx.StringField.prototype.getValue.call(this);

      // superclass validation (e.g. will check empty + required)
      if (!inputEx.StringField.superclass.validate.call(this)) {
         return false;
      }

      // if non-required field is empty, no other validation to perform
      if (!this.options.required && this.isEmpty()) {
         return true;
      }

      // check regex matching
      if (this.options.regexp && !value.match(this.options.regexp)) {
         return false;
      }

      // check min length
      if (this.options.minLength && value.length < this.options.minLength) {
         return false;
      }

      // check max length: already constrained by the html field

      return true;
   },

   /**
    * Disable the field
    * @method disable
    */
   disable: function() {
      this.el.disabled = true;
      return inputEx.StringField.superclass.disable.call(this);
   },

   /**
    * Enable the field
    * @method enable
    */
   enable: function() {
      this.el.disabled = false;
      return inputEx.StringField.superclass.enable.call(this);
   },

   /**
    * Set the focus to this field
    * @method focus
    */
   focus: function() {
      // Can't use lang.isFunction because IE >= 6 would say focus is not a function (IE says it's an object) !!
      if(!!this.el && !lang.isUndefined(this.el.focus) ) {
         // Wrap in try/catch to silence common IE error:
         // "Can't move focus to the control because it is invisible, not enabled, or of a type that does not accept the focus."
         try {
            this.el.focus();
         } catch (e) {}
      }
   },

   /**
    * Add the minLength string message handling
    * @method getStateString
    */
   getStateString: function(state) {
      if (this.options.minLength && state === inputEx.stateInvalid && this.getValue().length < this.options.minLength) {
         return Y.Lang.sub(this.messages.stringTooShort, {number: this.options.minLength});
      }
      return inputEx.StringField.superclass.getStateString.call(this, state);
   },

   /**
    * Display the type invite after setting the class
    * @method setClassFromState
    */
   setClassFromState: function(state) {
      inputEx.StringField.superclass.setClassFromState.call(this, state);

      // display/mask typeInvite
      if(this.options.typeInvite) {
         this.updateTypeInvite();
      }

      if(Y.one(this.divEl).hasClass("inputEx-invalid")){
         Y.one(this.el).setAttribute("aria-invalid", "true");
      }else if(Y.one(this.divEl).hasClass("inputEx-valid")){
         Y.one(this.el).removeAttribute("aria-invalid", "true");
      }
   },

   /**
    * @method updateTypeInvite
    */
   updateTypeInvite: function() {

      // field not focused
      if (!Y.one(this.divEl).hasClass( "inputEx-focused")) {

         // show type invite if field is empty
         if(this.isEmpty()) {
            Y.one(this.divEl).addClass( "inputEx-typeInvite");
            this.el.value = this.options.typeInvite;

         // important for setValue to work with typeInvite
         } else {
            Y.one(this.divEl).removeClass("inputEx-typeInvite");
         }

      // field focused : remove type invite
      } else {
         if(Y.one(this.divEl).hasClass("inputEx-typeInvite")) {
            // remove text
            this.el.value = "";

            // remove the "empty" state and class
            this.previousState = null;
            Y.one(this.divEl).removeClass("inputEx-typeInvite");
         }
      }
   },

   /**
    * Clear the typeInvite when the field gains focus
    * @method onFocus
    */
   onFocus: function(e) {
      inputEx.StringField.superclass.onFocus.call(this,e);

      if(this.options.typeInvite) {
         this.updateTypeInvite();
      }
   },
   /*
    * @method onBlur
    *
    */
    onBlur : function(e){
       inputEx.StringField.superclass.onBlur.call(this,e);
    },
   /**
    * @method onKeyPress
    */
   onKeyPress: function(e) {
      // override me
   },

   /**
    * @method onKeyUp
    */
   onKeyUp: function(e) {
      // override me
      //
      //   example :
      //
      //   lang.later(0, this, this.setClassFromState);
      //
      //     -> Set style immediatly when typing in the field
      //     -> Call setClassFromState escaping the stack (after the event has been fully treated, because the value has to be updated)
   }

});




// Register this class as "string" type
inputEx.registerType("string", inputEx.StringField, [
    { type: 'string', label: 'Type invite', name: 'typeInvite', value: ''},
    { type: 'integer', label: 'Size', name: 'size', value: 20},
    { type: 'integer', label: 'Min. length', name: 'minLength', value: 0}
]);
