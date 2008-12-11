(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('checkbox', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * Check a checkbox that has options to be checked, or not checked.
         *
         * There are several difference between a HTML checkbox and a inputEx checkbox
         *
         * for HTML checkbox,
         *   - the 'value' attribute is static, and a 'checked' attribute of true/false represent the checked state
         *   - when a checkbox is unchecked, the checkbox value will not be submitted
         *
         * for inputEx checkbox
         *   - it takes a 'sentValues' attribute which is an Array with two values determine the value of the checkbox in checked and unchecked states
         *    e.g. if 'sentValues' is ['agree','disagree'], when the checkbox is checked, the field and inputEl's value is 'agree'; otherwise, it's 'disagree'
         *   - it creates a hidden field with the name, and the visible checkbox is for tracking the checked and unchecked
         *     state only. when an unchecked field is submitted, the hidden value is sent.
         *
         * @class CheckBox
         * @extends Field
         * @constructor
         */
        var CheckBox = function(cfg) {
            CheckBox.superclass.constructor.apply(this, arguments);
        };

        CheckBox.NAME = "checkbox";
        CheckBox.ATTRS = {
            /**
             * @attribute className
             * @type String
             * @default 'inputEx-Field inputEx-CheckBox'
             */
            className:{
                value:'inputEx-Field inputEx-CheckBox'
            },

            /**
             * @attribute rightLabel
             * @type String
             * @default ''
             */
            rightLabel:{
                value:''
            },

            /**
             * @attribute checked
             * @description default as checked or not
             * @type Boolean
             * @default false, i.e. unchecked
             */
            checked:{
                value:false
            },

            /**
             * @attribute checkedValue
             * @description 'value', 'checkedValue' and 'uncheckedValue' works like the following:
             *
             * validation:
             * 1. 'checkedValue', if defined, shall not be identical to 'uncheckedValue'
             *
             * 2. if 'value' and 'checkedValue' are set, 'value' shall either be 'checkedValue' or 'uncheckedValue'
             *   - remarks: 'uncheckedValue' could be undefined
             *
             * initialization:
             * 1. if 'value' is defined, but not 'checkedValue', 'checkedValue' is set to 'value'
             *   - this is known as the HTML mode that behave as similar as HTML. HTML does not have 'checkedValue' and
             *     'uncheckedValue' attributes
             *
             * 2. If not 1,
             *  - 'checkedValue' and 'uncheckedValue' are default to be true and false
             *  - 'value' is default as the 'uncheckedValue'
             *  - if 'value' is specified, it must be either
             */
            checkedValue:{
            },

            /**
             * @attribute uncheckedValue
             * @see checkedValue
             * @type any type
             * @default undefined
             */
            uncheckedValue:{
            },

            /**
             * @attribute hiddenField
             * @description allow disabling of hiddenField. This is not recommended
             * @type Boolean
             * @default true
             */
            hiddenField:{
                value:true
            }

        }


        Y.extend(CheckBox, Y.inputEx.Field, {
            _hiddenInputEl:null,
            initializer : function(cfg) {
                if (this.get('checkedValue') && this.get('checkedValue') === this.get('uncheckedValue')) {
                    throw new Error('checkedValue and uncheckedValue shall not be identical, checkedValue: ' + this.get('checkedValue')) + ', uncheckedValue: ' + this.get('uncheckedValue')
                }

                // if 'value' and 'checkedValue' are set
                if (this.get('value') && this.get('checkedValue')) {
                    // 'value' shall either be 'checkedValue' or 'uncheckedValue'
                    if (this.get('value') !== this.get('checkedValue') && this.get('value') !== this.get('uncheckedValue'))
                        throw new Error('value attribute, if specified, shall either be checkedValue or uncheckedValue, ' +
                                        'value: ' + this.get('value') + ', checkedValue: ' + this.get('checkedValue') +
                                        ', uncheckedValue: ' + this.get('uncheckedValue'))
                }

                if (!this.get('checkedValue') && this.get('value')) {
                    // if 'value' is set but not 'checkedValue', set checkedValue with 'value' to simulate default HTML behavior
                    this.set('checkedValue', this.get('value'))
                }
                else if (!this.get('value') && !this.get('checkedValue') && !this.get('uncheckedValue')) {
                    // if all 'value', 'checkedValue', and 'uncheckedValue' are not defined
                    this.set('checkedValue', true);
                    this.set('uncheckedValue', false);
                }

                if (!this.get('value')) {
                    this.set('value', (this.get('checked')) ? this.get('checkedValue') : this.get('uncheckedValue'))
                }

                Y.log(this + '.initializer() - CheckBox - initialized - checkValue: ' + this.get('checkedValue') +
                      ', uncheckValue: ' + this.get('uncheckedValue') + ', value: ' + this.get('value'), 'debug', 'inputEx');
            },

            /**
             * Render the checkbox and the hidden field
             */
            renderComponent: function() {

                var value = this.get('checked') ? this.get('checkedValue') : this.get('uncheckedValue')

                /**
                 * Render the visible input checkbox. values is kept insync with the value attribute and the hidden field
                 * so that users may use on the node attributes. However, no 'name' is set to the field as it is not
                 * used for submission.
                 *
                 * Following the global Field, it is listened for onchange so user may the input element directly, and
                 * the checkbox field handles synchronizing the value with 'value' attribute and the hidden field
                 */
                this._inputEl = Y.Node.create('<input id="' + this.getID() + '-field" type="checkbox"/>');
                this._inputEl.set('checked', this.get('checked'))
                this._inputEl.set('value', value)
                this._inputWrapperEl.appendChild(this._inputEl);

                // render right hand side label
                var rightLabelEl = Y.Node.create('<label for="' + this.getID() + '" class="inputEx-CheckBox-rightLabel">' + this.get('rightLabel') + '</label>');
                this._inputWrapperEl.appendChild(rightLabelEl);

                // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
                if (this.get('hiddenField')) {
                    this._hiddenInputEl = Y.Node.create('<input id="' + this.getID() + '-hidden" type="hidden"/>')
                    this._hiddenInputEl.set('name', this.get('name') || '')
                    this._hiddenInputEl.set('value', value);
                    this._inputWrapperEl.appendChild(this._hiddenInputEl);
                }
            },

            /**
             * @description If IE, add a dirty patch
             */
            _initEvents:function() {
                CheckBox.superclass._initEvents.apply(this, arguments);

                // Awful Hack to work in IE6 and below (the checkbox doesn't fire the change event)
                // It seems IE 8 removed this behavior from IE7 so it only works with IE 7 ??
                /*if( YAHOO.env.ua.ie && parseInt(YAHOO.env.ua.ie,10) != 7 ) {
                 Event.addListener(this.el, "click", function() { this.fireUpdatedEvt(); }, this, true);
                 }*/
                if (Y.UA.ie) {
                    this._inputEl.on('click', Y.bind(function() {
                        Y.later(10, this, this._inputElOnChange)
                    }, this))
                }

            },
            /**
             * Method for synchronizing 'value' attribute to the inputEl
             * @param v
             */
            _updateInputEl:function(v) {
                this._inputEl.set('checked', v === this.get('checkedValue'));
                this._inputEl.set('value', v);
                if (this.get('hiddenField')) this._hiddenInputEl.set('value', v);
                Y.log(this + '._updateInputEl() - CheckBox - after update -  _inputEl.checked: ' + this._inputEl.get('checked') + ', value: ' + v, 'debug', 'inputEx');
            },
            _inputElOnChange:function() {
                var oldVal = this.get('value'), newVal = this._inputEl.get('checked') ? this.get('checkedValue') : this.get('uncheckedValue');
                Y.log(this + '._inputElOnChange() - CheckBox - from "' + oldVal + '" to "' + newVal + '", checked (after change): ' + this._inputEl.get('checked'), 'debug', 'inputEx')
                if (oldVal !== newVal) { this.set('value', newVal)}
            }


        });

        Y.namespace('inputEx');
        Y.inputEx.CheckBox = CheckBox;
        Y.inputEx.registerType("boolean", CheckBox);

    }, '3.0.0pr2', {requires:['field']});
})();