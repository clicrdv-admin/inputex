(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('stringfield', function(Y) {
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
            typeInvite:{
                value:''
            },
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
            _typeInviteOn:false,//type invite is being shown

            initializer : function(cfg) {
                if (this.get('typeInvite')) {
                    this.on('field:render', this._updateTypeInvite, this)
                    this.on('field:focus', this._updateTypeInvite, this)
                    this.on('field:blur', this._updateTypeInvite, this)
                    Y.log(this + '.initializer() - StringField - initialized - subscribed _updateTypeInvite to render,focus & blur', 'debug', 'inputEx');
                } else {
                    //Y.log(this + '.initializer() - StringField - initialized', 'debug', 'inputEx');
                }
            },

            syncUI:function() {
                StringField.superclass.syncUI.apply(this, arguments);
                this._updateTypeInvite();
            },

            renderComponent:function(container) {
                try {
                    var el = container ? container : this.get('contentBox'), id = this.getID();
                    container.addClass('inputEx-StringField')
                    var fieldEl = Y.Node.create('<div class="inputEx-StringField-wrapper"></div>')

                    //Note: for simple DOM, uses  class="inputEx-Field inputEx-StringField" on input
                    var field = Y.Node.create('<input id="' + id + '-field" type="' + this.get('type') + '"/>')

                    if (this.get('name')) field.set('name', this.get('name'))
                    if (this.get('size')) field.set('size', this.get('size'))
                    if (this.get('readonly')) field.set('readonly', this.get('readonly'))
                    if (this.get('maxLength')) field.set('maxLength', this.get('maxLength'))
                    if (this.get('value')) field.set('value', this.get('value'))

                    this._inputEl = field;
                    fieldEl.appendChild(field);
                    el.appendChild(fieldEl);

                    Y.log(this + '.renderComponent() - StringField - done, _inputEl: ' + this._inputEl, 'debug', 'inputEx');
                } catch(e) {
                    Y.log(this + '.renderComponent() - StringField - e: ' + e, 'error', 'inputEx');
                }
            },
            /*
             _initEvents:function() {
             StringField.superclass._initEvents.apply(this, arguments);
             //var el = this.get('contentBox'), id = this.getID(), field = el.query('#' + id + '-field')

             *//*if (Y.UA.ie) { // refer to inputEx-95
             new YAHOO.util.KeyListener(this.el, {keys:[13]}, {fn:function() {
             field.blur();
             field.focus();
             }}).enable()
             }*//*
             },*/

            validate:function() {
                if (this._typeInviteOn) {
                    StringField.superclass.validate.call(this, '');
                } else {
                    StringField.superclass.validate.apply(this, arguments);
                }
            },

            /*  _updateToInputEl:function(v) {
             if (!this._typeInviteOn || this.get('value') === '') {
             StringField.superclass._updateToInputEl.apply(this, arguments);
             this._updateTypeInvite();
             }
             },*/

            _updateTypeInvite: function() {
                if (!this.get('typeInvite')) return;
                //TODO: if user enter exactly the same text as typeInvite, it's treated as typeInvite but not entered text
                var el = this.get('contentBox'), inputEl = this._getInputEl(), inputValue = Y.Lang.trim(inputEl.get('value'))
                var enabled = el.hasClass('inputEx-typeInvite'), hasFocus = this.get('contentBox').hasClass('inputEx-focused'), hasValue = (inputValue !== '' && inputValue !== this.get('typeInvite'))
                Y.log(this + '._updateTypeInvite() - StringField - hasFocus: ' + hasFocus + ', enabled: ' + enabled + ', hasValue: ' + hasValue, 'warn', 'dev');

                if (!hasFocus) {
                    if (!enabled && !hasValue) { //init state, blur without change
                        Y.log(this + '._updateTypeInvite() - StringField - enable & set to typeInvite', 'warn', 'dev');
                        el.addClass('inputEx-typeInvite')
                        inputEl.set('value', this.get('typeInvite'))
                    } else if (!enabled && hasValue) { //entered some value
                        Y.log(this + '._updateTypeInvite() - StringField - disable', 'warn', 'dev');
                        el.removeClass('inputEx-typeInvite')
                    }
                } else {
                    if (enabled && !hasValue) { //focused on field without value
                        Y.log(this + '._updateTypeInvite() - StringField - disable & set to value', 'warn', 'dev');
                        el.removeClass('inputEx-typeInvite')
                        inputEl.set('value', this.get('value'))
                    }
                }
            },
            _updateFromInputEl:function() {
                var inputEl = this._getInputEl();
                var typeInviteEnabled = this.get('contentBox').hasClass('inputEx-typeInvite')
                var typeInviteMatched = (this.get('typeInvite') && inputEl.get('value') === this.get('typeInvite'))
                Y.log(this + '._updateFromInputEl() - StringField - typeInviteEnabled: ' + typeInviteEnabled + ', typeInviteMatched: ' + typeInviteMatched, 'warn', 'inputEx');
                if (typeInviteMatched) {
                    this.set('value', null)
                } else if (inputEl && inputEl.get('value') !== this.get('value')) {
                    Y.log(this + '._updateFromInputEl() - StringField - update value from "' + this.get('value') + '" to "' + inputEl.get('value') + '"', 'debug', 'inputEx');
                    this.set('value', inputEl.get('value'))
                }
            },
            /*_inputElOnChange:function() {
             var oldVal = this.get('value'), newVal = this._getInputEl().get('value');
             var isChanged = oldVal !== newVal
             Y.log(this + '._inputElOnChange() - StringField - from "' + oldVal + '" to "' + newVal + '", isChanged: ' + isChanged + ', _typeInviteOn:' + this._typeInviteOn, 'debug', 'inputEx')
             if (isChanged && !this._typeInviteOn) { this.set('value', newVal) }
             },*/
            /*
             _onFocus:function() {
             StringField.superclass._onFocus.apply(this, arguments);
             },
             */

            _onKeyPress:function() {
                // override me
            },
            _onKeyUp:function() {
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

        Y.namespace('inputEx');
        Y.inputEx.StringField = StringField;
        Y.inputEx.registerType("string", StringField);

    }, '3.0.0pr2', {requires:['field']});

    // YUI.add('inputex', function(Y) {}, '3.0.0pr2', {use:['inputex','field'],skinnable:true})
})();
