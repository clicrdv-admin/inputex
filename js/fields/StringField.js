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
            regexp:{value:null}

        };

        Y.extend(StringField, Y.inputEx.Field, {
            renderComponent:function(parentEl) {
                try {
                    var el = parentEl ? parentEl : this.get('el'), id = this.get('el').get('id');
                    parentEl.addClass('inputEx-StringField')
                    var fieldEl = Y.Node.create('<div class="inputEx-StringField-wrapper"></div>')

                    //Note: for simple DOM, uses  class="inputEx-Field inputEx-StringField" on input
                    var field = Y.Node.create('<input id="' + id + '-field" type="' + this.get('type') + '"/>')

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
            },

            validate:function() {
                // Check regex matching and minLength (both used in password field...)
                var result = true;

                // if we are using a regular expression
                if (this.get('regexp')) {
                    result = result && this.get('value').match(this.get('regexp'));
                }
                if (this.get('minLength')) {
                    result = result && this.get('value').length >= this.get('minLength');
                }
                return result;
            },

            _onchange:function() {

            }
        });

        Y.namespace('inputEx');
        Y.inputEx.StringField = StringField;

    }, '3.0.0pr1', {requires:['field']});

    //    YUI.add('inputex', function(Y) {
    //    }, '3.0.0pr1', {use:['inputex','field'],skinnable:true})
})();


/*
 if(this.options.typeInvite) {
 this.updateTypeInvite();

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
