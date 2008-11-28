(function () {
    if (typeof(YUI) === 'undefined') {
        alert('Error! YUI3 library is not available')
    }

    YUI.add('stringfield', function(Y) {
        //        if (!Y.inputEx){alert('Y.inputEx is not available')}
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * @class StringField
         * @extends Field
         * @constructor
         */
        var StringField = function(cfg) {
            StringField.superclass.constructor.apply(this, arguments);
        };

        StringField.NAME = "stringfield";
        StringField.ATTRS = {
            type:{value:'text',readOnly:true},
            size:{value:null},
            maxLength:{value:null},
            typeInvite:{value:null},
            readonly:{value:false},

            /**
             * @attribute minLength
             * @description for validation, it will be changed to 'validator' in future version
             * @type Integer
             */
            minLength:{value:0},

            /**
             * @attribute regexp
             * @description for validation, it will be changed to 'validator' in future version
             * @type String
             */
            regexp:{value:'text'}

        };

        Y.extend(StringField, Y.inputEx.Field, {
            renderComponent:function(parentEl) {
                try {
                    var el = parentEl ? parentEl : this.get('el'), id = el.get('id');
                    var fieldEl = Y.Node.create('<div class="inputEx-StringField-wrapper"></div>')

                    var field = Y.Node.create('<input id="' + id + '-field" type="' + this.get('type') + '" class="inputEx-Field inputEx-StringField"/>')

                    if (this.get('name')) field.set('name', this.get('name'))
                    if (this.get('size')) field.set('size', this.get('size'))
                    if (this.get('readonly')) field.set('readonly', this.get('readonly'))
                    if (this.get('maxLength')) field.set('maxLength', this.get('maxLength'))
                    if (this.get('value')) field.set('value', this.get('value'))

                    fieldEl.appendChild(field);
                    el.appendChild(fieldEl);
                    Y.log(this + '.renderComponent() - done', 'debug', 'inputEx');
                } catch(e) {
                    Y.log(this + '.renderComponent() - e: ' + e, 'error', 'inputEx');
                }

            }
        });

        Y.namespace('inputEx');
        Y.inputEx.StringField = StringField;

    }, '3.0.0pr1', {requires:['field']});

    //    YUI.add('inputex', function(Y) {
    //    }, '3.0.0pr1', {use:['inputex','field'],skinnable:true})
})();


/*
 this.options.messages.required = (options.messages && options.messages.required) ? options.messages.required : inputEx.messages.required;
 this.options.messages.invalid = (options.messages && options.messages.invalid) ? options.messages.invalid : inputEx.messages.invalid;
 //this.options.messages.valid = (options.messages && options.messages.valid) ? options.messages.valid : inputEx.messages.valid;

 setValue: function(value, sendUpdatedEvt) {
 // to be inherited

 // set corresponding style
 this.setClassFromState();

 if(sendUpdatedEvt !== false) {
 // fire update event
 this.fireUpdatedEvt();
 }
 },

 */
/**
 * Set the styles for valid/invalide state
 */
/*
 setClassFromState: function() {

 // remove previous class
 if( this.previousState ) {
 // remove invalid className for both required and invalid fields
 var className = 'inputEx-'+((this.previousState == inputEx.stateRequired) ? inputEx.stateInvalid : this.previousState)
 Dom.removeClass(this.divEl, className);
 }

 // add new class
 var state = this.getState();
 if( !(state == inputEx.stateEmpty && Dom.hasClass(this.divEl, 'inputEx-focused') ) ) {
 // add invalid className for both required and invalid fields
 var className = 'inputEx-'+((state == inputEx.stateRequired) ? inputEx.stateInvalid : state)
 Dom.addClass(this.divEl, className );
 }

 if(this.options.showMsg) {
 this.displayMessage( this.getStateString(state) );
 }

 this.previousState = state;
 },

 */
/**
 * Get the string for the given state
 */
/*
 getStateString: function(state) {
 if(state == inputEx.stateRequired) {
 return this.options.messages.required;
 }
 else if(state == inputEx.stateInvalid) {
 return this.options.messages.invalid;
 }
 else {
 return '';
 }
 },

 */
/**
 * Returns the current state (given its value)
 * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
 */
/*
 getState: function() {
 // if the field is empty :
 if( this.isEmpty() ) {
 return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
 }
 return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
 },

 */
/**
 * Function called on the focus event
 * @param {Event} e The original 'focus' event
 */
/*
 onFocus: function(e) {
 var el = this.getEl();
 Dom.removeClass(el, 'inputEx-empty');
 Dom.addClass(el, 'inputEx-focused');
 },

 */
/**
 * Function called on the blur event
 * @param {Event} e The original 'blur' event
 */
/*
 onBlur: function(e) {
 Dom.removeClass(this.getEl(), 'inputEx-focused');

 // Call setClassFromState on Blur
 this.setClassFromState();
 },

 */
/**
 * onChange event handler
 * @param {Event} e The original 'change' event
 */
/*
 onChange: function(e) {
 this.fireUpdatedEvt();
 },

 close: function() {
 },

 /**
 * Disable the field
 */
/**
 * Purge all event listeners and remove the component from the dom
 */
/*
 destroy: function() {
 var el = this.getEl();

 // Unsubscribe all listeners on the updatedEvt
 this.updatedEvt.unsubscribeAll();

 // Remove from DOM
 if(Dom.inDocument(el)) {
 el.parentNode.removeChild(el);
 }

 // recursively purge element
 util.Event.purgeElement(el, true);
 },

 */
/**
 * Update the message
 * @param {String} msg Message to display
 */
/*
 displayMessage: function(msg) {
 if(!this.fieldContainer) { return; }
 if(!this.msgEl) {
 this.msgEl = inputEx.cn('div', {className: 'inputEx-message'});
 try{
 var divElements = this.divEl.getElementsByTagName('div')
 this.divEl.insertBefore(this.msgEl, divElements[(divElements.length-1>=0)?divElements.length-1:0]); //insertBefore the clear:both div
 }catch(e){alert(e)}
 }
 this.msgEl.innerHTML = msg;
 },

 */
/**
 * Show the field
 */
/*
 show: function() {
 this.divEl.style.display = '';
 },

 */
/**
 * Hide the field
 */
/*
 hide: function() {
 this.divEl.style.display = 'none';
 },

 */
/**
 * Clear the field by setting the field value to this.options.value
 * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
 */
/*
 clear: function(sendUpdatedEvt) {
 this.setValue(lang.isUndefined(this.options.value) ? '' : this.options.value, sendUpdatedEvt);
 },

 */
/**
 * Should return true if empty
 */
/*
 isEmpty: function() {
 return this.getValue() === '';
 }

 };

 })();*/


/*
 (function() {

 var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

 */
/**
 * @class Basic string field (equivalent to the input type "text")
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *      <li>regexp: regular expression used to validate (otherwise it always validate)</li>
 *   <li>size: size attribute of the input</li>
 *   <li>maxLength: maximum size of the string field (no message display, uses the maxlength html attribute)</li>
 *   <li>minLength: minimum size of the string field (will display an error message if shorter)</li>
 *   <li>typeInvite: string displayed when the field is empty</li>
 *   <li>readonly: set the field as readonly</li>
 * </ul>
 */
/*
 inputEx.StringField = function(options) {
 inputEx.StringField.superclass.constructor.call(this, options);

 if(this.options.typeInvite) {
 this.updateTypeInvite();
 }
 };

 lang.extend(inputEx.StringField, inputEx.Field,
 */
/**
 * @scope inputEx.StringField.prototype
 */
/*
 {
 */
/**
 * Set the default values of the options
 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
 */
/*
 setOptions: function(options) {
 inputEx.StringField.superclass.setOptions.call(this, options);

 this.options.regexp = options.regexp;
 this.options.size = options.size;
 this.options.maxLength = options.maxLength;
 this.options.minLength = options.minLength;
 this.options.typeInvite = options.typeInvite;
 this.options.readonly = options.readonly;
 },


 */
/**
 * Register the change, focus and blur events
 */
/*
 initEvents: function() {
 Event.addListener(this.el, "change", this.onChange, this, true);

 if (YAHOO.env.ua.ie){ // refer to inputEx-95
 var field = this.el;
 new YAHOO.util.KeyListener(this.el, {keys:[13]}, {fn:function(){
 field.blur();
 field.focus();
 }}).enable()
 }

 Event.addFocusListener(this.el, this.onFocus, this, true);
 Event.addBlurListener(this.el, this.onBlur, this, true);

 Event.addListener(this.el, "keypress", this.onKeyPress, this, true);
 Event.addListener(this.el, "keyup", this.onKeyUp, this, true);
 },

 */
/**
 * Return the string value
 * @param {String} The string value
 */
/*
 getValue: function() {
 return (this.options.typeInvite && this.el.value == this.options.typeInvite) ? '' : this.el.value;
 },

 */
/**
 * Function to set the value
 * @param {String} value The new value
 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
 */
/*
 setValue: function(value, sendUpdatedEvt) {
 this.el.value = value;

 // call parent class method to set style and fire updatedEvt
 inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
 },

 */
/**
 * Uses the optional regexp to validate the field value
 */
/*
 validate: function() {
 var val = this.getValue();

 // empty field
 if (val == '') {
 // validate only if not required
 return !this.options.required;
 }

 // Check regex matching and minLength (both used in password field...)
 var result = true;

 // if we are using a regular expression
 if( this.options.regexp ) {
 result = result && val.match(this.options.regexp);
 }
 if( this.options.minLength ) {
 result = result && val.length >= this.options.minLength;
 }
 return result;
 },

 */
/**
 * Disable the field
 */
/*
 disable: function() {
 this.el.disabled = true;
 },

 */
/**
 * Enable the field
 */
/*
 enable: function() {
 this.el.disabled = false;
 },

 */
/**
 * Set the focus to this field
 */
/*
 focus: function() {
 // Can't use lang.isFunction because IE >= 6 would say focus is not a function, even if it is !!
 if(!!this.el && !lang.isUndefined(this.el.focus) ) {
 this.el.focus();
 }
 },

 */
/**
 * Return (stateEmpty|stateRequired)
 */
/*
 getState: function() {
 var val = this.getValue();

 // if the field is empty :
 if( val === '') {
 return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
 }

 return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
 },

 */
/**
 * Add the minLength string message handling
 */
/*
 getStateString: function(state) {
 if(state == inputEx.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
 return inputEx.messages.stringTooShort[0]+this.options.minLength+inputEx.messages.stringTooShort[1];
 }
 return inputEx.StringField.superclass.getStateString.call(this, state);
 },

 */
/**
 * Display the type invite after setting the class
 */
/*
 setClassFromState: function() {
 inputEx.StringField.superclass.setClassFromState.call(this);

 // display/mask typeInvite
 if(this.options.typeInvite) {
 this.updateTypeInvite();
 }
 },

 updateTypeInvite: function() {

 // field not focused
 if (!Dom.hasClass(this.divEl, "inputEx-focused")) {

 // show type invite if field is empty
 if(this.isEmpty()) {
 Dom.addClass(this.divEl, "inputEx-typeInvite");
 this.el.value = this.options.typeInvite;

 // important for setValue to work with typeInvite
 } else {
 Dom.removeClass(this.divEl, "inputEx-typeInvite");
 }

 // field focused : remove type invite
 } else {
 if(Dom.hasClass(this.divEl,"inputEx-typeInvite")) {
 // remove text
 this.el.value = "";

 // remove the "empty" state and class
 this.previousState = null;
 Dom.removeClass(this.divEl,"inputEx-typeInvite");
 }
 }
 },

 */
/**
 * Clear the typeInvite when the field gains focus
 */
/*
 onFocus: function(e) {
 inputEx.StringField.superclass.onFocus.call(this,e);

 if(this.options.typeInvite) {
 this.updateTypeInvite();
 }
 },

 onKeyPress: function(e) {
 // override me
 },

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


 inputEx.messages.stringTooShort = ["This field should contain at least "," numbers or characters"];

 */
/**
 * Register this class as "string" type
 */
/*
 inputEx.registerType("string", inputEx.StringField);

 })();
 */
