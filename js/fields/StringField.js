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
            initializer : function(cfg) {
                if (this.get('typeInvite')) {
                    this.on('field:render', this._updateTypeInvite, this)
                    this.on('field:focus', this._updateTypeInvite, this)
                    this.on('field:blur', this._updateTypeInvite, this)
                    Y.log(this + '.initializer() - StringField - initialized - subscribed _updateTypeInvite to render,focus & blur', 'debug', 'inputEx');
                } else {
                    Y.log(this + '.initializer() - StringField - initialized', 'debug', 'inputEx');
                }
            },

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
                    Y.log(this + '.renderComponent() - StringField - done', 'debug', 'inputEx');
                } catch(e) {
                    Y.log(this + '.renderComponent() - StringField - e: ' + e, 'error', 'inputEx');
                }
            },

            _initEvents:function() {
                StringField.superclass._initEvents.apply(this, arguments);
                var el = this.get('el'), id = this.get('el').get('id'), field = el.query('#' + id + '-field')

                /*if (Y.UA.ie) { // refer to inputEx-95
                 new YAHOO.util.KeyListener(this.el, {keys:[13]}, {fn:function() {
                 field.blur();
                 field.focus();
                 }}).enable()
                 }*/
            },

            _updateTypeInvite: function() {
                if (!this.get('el').hasClass('inputEx-focused')) {
                    if (this.isEmpty()) {// show type invite if field is empty
                        Y.log(this + '._updateTypeInvite() - StringField - value is empty, set to typeInvite, value: ' + this.get('value'), 'debug', 'inputEx');
                        this.get('el').addClass('inputEx-typeInvite');
                        this.getField().set('value', this.get('typeInvite')); //TODO see if we should use this.set('value') instead
                        // important for setValue to work with typeInvite
                    } else {
                        this.get('el').removeClass('inputEx-typeInvite');
                    }
                } else {
                    if (this.get('el').hasClass('inputEx-typeInvite')) {
                        this.getField().set('value', ''); // remove test
                        this.previousState = null; // remove the "empty" state and class
                        this.get('el').removeClass('inputEx-typeInvite');
                    }
                }
            },

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

    }, '3.0.0pr1', {requires:['field']});

    //    YUI.add('inputex', function(Y) {
    //    }, '3.0.0pr1', {use:['inputex','field'],skinnable:true})
})();


/*
 if(this.options.typeInvite) {
 this.updateTypeInvite();

 /*
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

 inputEx.messages.stringTooShort = ["This field should contain at least "," numbers or characters"];

 */
