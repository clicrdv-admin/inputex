(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('checkbox', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * @class CheckBox
         * @extends Field
         * @constructor
         */
        var CheckBox = function(cfg) {
            CheckBox.superclass.constructor.apply(this, arguments);
        };

        CheckBox.NAME = "checkbox";
        CheckBox.ATTRS = {
            className:{
                value:'inputEx-Field inputEx-CheckBox'
            },
            value:{
                value:false
            },
            rightLabel:{
                value:''
            },

            /**
             * 2D vector of values for checked/unchecked states (default is [true, false])
             */
            sentValues:{
                set:function(v) {
                    if (!Y.Lang.isArray(v) && v.length != 2) { throw new Error('sendValue must be an array with 2 values')}
                    this._checkedValue = v[0];
                    this._uncheckedValue = v[1];
                },
                value:[true,false]
            }
        }


        Y.extend(CheckBox, Y.inputEx.Field, {
            _checkedValue:null,
            _uncheckedValue:null,
            _hiddenInputEl:null,
            initializer : function(cfg) {
                Y.log(this + '.initializer() - CheckBox - initialized - checkValue: ' + this.get('checkValue') + ', uncheckValue: ' + this.get('uncheckValue'), 'debug', 'inputEx');
            },

            /**
             * Render the checkbox and the hidden field
             */
            renderComponent: function() {

                var checkBoxId = this.getID() + 'field'
                this._inputEl = Y.Node.create('<input id="' + checkBoxId + '" type="checkbox" checked="' + this.get('value') + '"/>');
                this._inputWrapperEl.appendChild(this._inputEl);

                var rightLabelEl = Y.Node.create('<label for="' + checkBoxId + '" class="inputEx-CheckBox-rightLabel">' + this.get('rightLabel') + '</label>');
                this._inputWrapperEl.appendChild(rightLabelEl);

                // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
                this._hiddenInputEl = Y.Node.create('<input type="hidden" name="' + (this.get('name') || '') + '" value="' + (this.get('value') ? this.get('checkedValue') : this.get('uncheckedValue')) + '"/>')

                this._inputWrapperEl.appendChild(this._hiddenInputEl);
            },

            _initEvent:function() {
                CheckBox.superclass._initEvents.apply(this, arguments);
            }


        });

        Y.namespace('inputEx');
        Y.inputEx.CheckBox = CheckBox;
        Y.inputEx.registerType("boolean", CheckBox);

    }, '3.0.0pr1', {requires:['field']});
})();


/**
 * Clear the previous events and listen for the "change" event
 */
/*
 initEvents: function() {
 Event.addListener(this.el, "change", this.onChange, this, true);

 // Awful Hack to work in IE6 and below (the checkbox doesn't fire the change event)
 // It seems IE 8 removed this behavior from IE7 so it only works with IE 7 ??
 */
/*if( YAHOO.env.ua.ie && parseInt(YAHOO.env.ua.ie,10) != 7 ) {
 Event.addListener(this.el, "click", function() { this.fireUpdatedEvt(); }, this, true);
 }*/
/*
 if( YAHOO.env.ua.ie ) {
 Event.addListener(this.el, "click", function() { YAHOO.lang.later(10,this,this.fireUpdatedEvt); }, this, true);
 }

 Event.addFocusListener(this.el, this.onFocus, this, true);
 Event.addBlurListener(this.el, this.onBlur, this, true);
 },

 */
/**
 * Function called when the checkbox is toggled
 * @param {Event} e The original 'change' event
 */
/*
 onChange: function(e) {
 this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;

 // In IE the fireUpdatedEvent is sent by the click ! We need to send it only once !
 if( !YAHOO.env.ua.ie ) {
 inputEx.CheckBox.superclass.onChange.call(this,e);
 }
 },

 */
/**
 * Get the state value
 * @return {Any} one of [checkedValue,uncheckedValue]
 */
/*
 getValue: function() {
 return this.el.checked ? this.checkedValue : this.uncheckedValue;
 },

 */
/**
 * Set the value of the checkedbox
 * @param {Any} value The value schould be one of [checkedValue,uncheckedValue]
 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
 */
/*
 setValue: function(value, sendUpdatedEvt) {
 if (value===this.checkedValue) {
 this.hiddenEl.value = value;
 this.el.checked = true;
 }
 else {
 // DEBUG :
 */
/*if (value!==this.uncheckedValue && lang.isObject(console) && lang.isFunction(console.log) ) {
 console.log("inputEx.CheckBox: value is *"+value+"*, schould be in ["+this.checkedValue+","+this.uncheckedValue+"]");
 }*/
/*
 this.hiddenEl.value = value;
 this.el.checked = false;
 }

 // Call Field.setValue to set class and fire updated event
 inputEx.CheckBox.superclass.setValue.call(this,value, sendUpdatedEvt);
 }

 });

 */
