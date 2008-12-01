(function () {
    if (typeof(YUI) === 'undefined') {
        alert('Error! YUI3 library is not available')
    } //TODO load yui3 base dynamically like a Bookmarklet


    YUI.add('field', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        var FD = Y.inputEx.FD,  //TODO review this
            /**
             * @event field:render
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             * //TODO consider to pass the field as param
             */
                EV_RENDER = 'field:render',
            /**
             * @event field:focus
             * @description An abstraction of the JavaScript event of the field, user shall use this instead of listen directly to the field
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_FOCUS = 'field:focus',
            /**
             * @event field:blur
             * @description An abstraction of the JavaScript event of the field, user shall use this instead of listen directly to the field
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_BLUR = 'field:blur',
            /**
             * @event field:change
             * @description An abstraction of the JavaScript event of the field, user shall use this instead of listen
             * directly to the field. In addition to the JavaScript onchange behavior, this event is fired when the
             * abstract 'value' attribute is changed instead of the actual field value. e.g. setting typeInvite on the
             * text field will not cause this event to fire.
             *
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_CHANGE = 'field:change',
            /**
             * @event field:invalid
             * @description failed in validation
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_INVALID = 'field:invalid'
        /**
         * @class Field
         * @extends Base
         * @constructor
         */
        var Field = function(cfg) {
            Field.superclass.constructor.apply(this, arguments);
            this.publish(EV_RENDER);
            this.publish(EV_FOCUS);
            this.publish(EV_BLUR);
            this.publish(EV_CHANGE);
            this.publish(EV_INVALID);
            //TODO register to a page-scope inputEx manager. reference: DDM._regDrag(this);
        };
        Y.augment(Field, Y.Event.Target);

        Field.NAME = "field";
        Field.ATTRS = {
            /**
             * @attribute name
             * @type String
             */
            name:{},

            /**
             * it could be set as 'elementId', '#elementId', HTMLElement, or Y.Node, store as Y.Node, nullable, writeOnce
             * parentEl is used only during construction to define a el
             * @attribute target
             * @type Y.Node
             */
            parentEl:{
                set:function(cfg) {
                    return Field.getNode(cfg);
                },
                //value: Y.Node.get('body'),
                writeOnce:true
            },

            /**
             * el could be defined in a number of ways:
             * - if cfg is a String, we look up for a node with and without a '#' prefix. If no node is found, we create
             * one with the cfg as id.
             * - if cfg is a Node, it is used.
             * - otherwise, we try to lookup a node
             */
            el:{
                set:function(cfg) {
                    var el;
                    if (!Y.Lang.isNull(cfg)) {
                        el = Field.getNode(cfg)
                    }

                    if (!el) { //create a new el under parent
                        var id = Y.Lang.isString(cfg) ? cfg.charAt(0) == '#' ? cfg.substring(1, cfg.length) : cfg : null
                        id = (id) ? id : Y.Lang.isUndefined(this.get('name')) ? Y.guid('div') : this.get('name')
                        el = Y.Node.create('<div id="' + id + '"></div>');
                        if (this.get('parentEl')) {
                            this.get('parentEl').appendChild(el);
                        } else {
                            Y.log(this + '.set("el") - Field - parentEl is undefined or invalid, the el is NOT appended to the DOM, el: ' + el, 'warn', 'inputEx');
                        }

                    }
                    Y.log(this + '.set("el") - Field - el: ' + el + ', cfg: ' + cfg + ', parentEl: ' + this.get('parentEl') + ', name: ' + this.get('name'), 'debug', 'inputEx')
                    return el;
                },
                value:null,
                writeOnce:true},

            /**
             * @attribute value
             * @type String
             */
            value:{
                set:function(v) {
                    if (!Y.Lang.isUndefined(this.get('value'))) {
                        Y.log(this + '.set("value") - Field - updated from "' + this.get('value') + '" to "' + v + '"', 'debug', 'inputEx')
                    }
                    this.fire(EV_CHANGE, null, v, this.get('value'));//workarounded this.fire(EV_UPDATE, v, this.get('value'));
                    return v;
                },
                value:''
            },

            /**
             * @attribute id
             * @type String
             * //TODO check what's the YUI3 way to manage id
             * // TODO auto generate ID
             */
            //id:{},

            /**
             * @attribute label
             * @description a short descriptive text for a field, normally show at the left hand side of the field element
             * @type String
             */
            label:{
                set:function(v) {
                    if (!Y.Lang.isUndefined(this.get('label')))
                        Y.log(this + '.set("label") - Field - updated from "' + this.get('label') + '" to "' + v + '"', 'debug', 'inputEx')

                    var labelEl = this.get('el').query('#' + this.get('el').get('id') + '-label')
                    if (labelEl) labelEl.set('innerHTML', v);
                    return v;
                },
                value:''
            },

            /**
             * @attribute description
             * @description a long descriptive text for a field, normally show at the bottom of the field element
             * @type String
             */
            description:{
                set:function(v) {
                    if (!Y.Lang.isUndefined(this.get('description')))
                        Y.log(this + '.set("description") - Field - updated from "' + this.get('description') + '" to "' + v + '"', 'debug', 'inputEx')
                    var descEl = this.get('el').query('#' + this.get('el').get('id') + '-description')
                    if (descEl) descEl.set('innerHTML', v);
                    return v;
                },
                value:''},

            /**
             * @attribute messages
             * @type Object
             */
            messages:{
                value:{}
            },

            /**
             * @attribute className
             * @description
             * @type String
             *
             * //TODO: comment: it seems to be more useful to define the class for the wrapping-div, e.g.
             * user may set a margin for a field, or position it specially.
             */
            className:{
                value:'inputEx-Field',
                writeOnce:true
            },

            /**
             * @deprecated use validator:{required:true}
             * @attribute required
             * @description for validation, true if the field is mandatory and cannot be null or empty string. It will
             * be replaced with a validator implementation in future version
             * @type Boolean
             */
            required:{value:false},

            /**
             * @attribute showMsg
             * @description
             * @type Boolean
             * //TODO: should it be default to true?
             */
            showMsg:{value:false},

            /**
             * @attribute validator
             * @description new in 0.3, see http://code.google.com/p/inputex/wiki/Validation ;
             * @type object
             */
            validator:{
                value:{}
            }
        };

        /**
         * Static methods
         */
        Field.getNode = function(cfg, defaultNode) { //TODO impl defaultNode
            var node;
            if (Y.Lang.isString(cfg)) {
                node = Y.Node.get(cfg.charAt(0) == '#' ? cfg : '#' + cfg);
            }
            else if (cfg instanceof Y.Node) {
                node = cfg
            }
            else {
                try {
                    node = Y.Node.get(cfg)
                } catch(e) {
                }
            }
            /*if (Y.Lang.isUndefined(parentNode)) {
             Y.log(this + ' parentEl cannot be identified, parentNode is set to BODY, cfg: ' + cfg, 'warn', 'inputEx');
             parentNode = Y.Node.get('body');
             }*/
            return node;
        }

        Y.extend(Field, Y.Base, {
            _field:null, //reference to the Field node

            initializer : function(cfg) {
                /**
                 * If an event handling function return false, the next event will not fire. So validate() is wrapped
                 * and not to return false in invalid case to avoid skipping the next event.
                 */
                this.on(EV_CHANGE, Y.bind(function() { this.validate(); }, this), this);
                this.on(EV_CHANGE, this._setClassFromState, this);
                Y.log(this + '.initializer() - Field - Field initialized', 'debug', 'inputEx');
            },

            render:function() {
                try {
                    var el = this.get('el'), id = el.get('id');
                    el.addClass('inputEx-fieldWrapper')

                    if (this.get('required')) el.addClass('inputEx-required')

                    if (this.get('label')) {
                        var labelDiv = Y.Node.create('<div class="inputEx-label"></div>')
                        var label = Y.Node.create('<label id="' + id + '-label" for="' + id + '-field">' + this.get('label') + '</label>')
                        labelDiv.appendChild(label)
                        el.appendChild(labelDiv)
                        //TODO the trunk has error. backport the label for
                    }

                    var fieldDiv = Y.Node.create('<div class="' + this.get('className') + '"></div>');

                    this.renderComponent(fieldDiv);
                    this._field = this.getField();

                    if (this.get('description')) {
                        var desc = Y.Node.create('<div id="' + id + '-description" class="inputEx-description"></div>')
                        desc.set('innerHTML', this.get('description'))
                        fieldDiv.appendChild(desc)
                        //TODO update docs: use description instead of 'desc', unless we change them all globally, always be consistent in naming
                    }

                    el.appendChild(fieldDiv);

                    var floatBreaker = Y.Node.create('<div class="inputEx-br" style="clear:both"/>') //remarks: added inputEx-br for lookup
                    el.appendChild(floatBreaker)

                    if (!this._eventInitialized) { this._initEvents();}

                    Y.log(this + '.render() - Field - rendered - el.innerHTML: ' + this.get('el').get('innerHTML'), 'debug', 'inputEx')
                    this.fire(EV_RENDER, null, this.get('el'));//workarounded this.fire(EV_RENDER, this.get('el'));
                    return this;
                } catch(e) {
                    Y.log(this + '.render() - Field - ' + e, 'error', 'inputEx');
                }
            },

            renderComponent:function() {
                // override me
                Y.log(this + '.renderComponent() - Field - method should have been overidden!', 'warn', 'inputEx');
            },

            _eventInitialized:false,
            _initEvents:function() {
                if (this._eventInitialized) return;
                if (this.getField()) {
                    this.getField().on('change', Y.bind(this._onChange, this));
                    this.getField().on('focus', Y.bind(this._onFocus, this));
                    this.getField().on('blur', Y.bind(this._onBlur, this));
                    Y.log(this + '.initEvent() - Field - subscribed to change, focus & blur', 'debug', 'inputEx');
                } else {
                    Y.log(this + '.initEvent() - Field - no available field', 'warn', 'inputEx');
                }
                this._eventInitialized = true;
            },

            displayMessage:function(msg) {
                var el = this.get('el')
                var fieldDiv = el.query('div.' + this.get('className'));
                if (!fieldDiv) {
                    return;
                }

                var htmlMsg = '';
                if (Y.Lang.isArray(msg)) {
                    for (var i = 0,m; m = msg[i]; i++) {
                        if (i != 0) { htmlMsg += '<br/>'}
                        htmlMsg += m;
                    }
                } else if (Y.Lang.isString(msg)) {
                    htmlMsg = msg;
                }

                var msgDiv = el.query('div.inputEx-message');
                if (!msgDiv) {
                    msgDiv = Y.Node.create('<div class="inputEx-message"></div>');
                    el.appendChild(msgDiv);
                    el.insertBefore(msgDiv, el.query('div.inputEx-br'))
                }
                Y.log(this + '.displayMessage() - Field - from "' + msgDiv.get('innerHTML') + '" to "' + htmlMsg + '"', 'debug', 'inputEx')
                msgDiv.set('innerHTML', htmlMsg)
            },

            focus:function() {
                this.get('el').focus();
                return this;
            },

            /**
             * Remarks: New API
             */
            getField:function() {
                if (this._field) return this._field;

                var fieldEl;
                var el = this.get('el')
                if (el) { fieldEl = el.query('#' + this.get('el').get('id') + '-field'); }
                //if (!fieldEl) { Y.log(this + '.getField() - Field - return undefined', 'warn', 'inputEx'); }
                return fieldEl;
            },

            _onFocus:function() {
                this.get('el').removeClass('inputEx-empty')
                this.get('el').addClass('inputEx-focused')
                Y.log(this + '._onFocus() - Field', 'debug', 'inputEx');
                this.fire(EV_FOCUS, null, this.get('el'));//workarounded this.fire(EV_UPDATE, this.get('value'));
            },

            _onBlur:function() {
                this.get('el').removeClass('inputEx-focused')
                if (!this._state.validated) {// for the case that the field is focused then blurred without onchange
                    this.validate();
                    this._setClassFromState();
                }

                if (this.get('value') !== this.getField().get('value')) { this.set('value', this.getField().get('value'))}
                Y.log(this + '._onBlur() - Field', 'debug', 'inputEx');
                this.fire(EV_BLUR, null, this.get('el'));//workarounded this.fire(EV_UPDATE, this.get('value'));
            },

            _onChange:function() {
                var oldVal = this.get('value'), newVal = this.getField().get('value');
                Y.log(this + '._onChange() - Field - from "' + oldVal + '" to "' + newVal + '"', 'debug', 'inputEx')
                if (oldVal !== newVal) { this.set('value', newVal)}
                //this.fire(EV_CHANGE, oldVal, newVal);//workarounded this.fire(EV_UPDATE, this.get('value'));
            },

            _previousState:null,

            /**
             * Set the styles for valid/invalide state. This is called in upon the following events:
             *  - when the field value is updated
             *  - onblur
             *
             */
            _setClassFromState:function() {
                Y.log(this + '._setClassFromState() - Field - begin', 'debug', 'inputEx');
                // remove previous class
                if (this.previousState) {
                    // remove invalid className for both required and invalid fields
                    var className = 'inputEx-' + ((this.previousState == Y.inputEx.stateRequired) ? Y.inputEx.stateInvalid : this.previousState)
                    this.get('el').removeClass(className);
                }

                // add new class
                var state = this.getState();
                if (!(state == Y.inputEx.stateEmpty && this.get('el').hasClass('inputEx-focused') )) {
                    // add invalid className for both required and invalid fields
                    var className = 'inputEx-' + ((state == Y.inputEx.stateRequired) ? Y.inputEx.stateInvalid : state)
                    this.get('el').addClass(className);
                }

                if (this.get('showMsg')) {
                    this.displayMessage(this.getStateString(state));
                }

                Y.log(this + '._setClassFromState() - Field - previousState: ' + this.previousState + ', state: ' + state, 'debug', 'inputEx');
                this.previousState = state;
            },

            /**
             * Returns the current state base on the last validation results.
             *
             * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
             * Remarks: it won't return 'required' now. TODO: update docs
             */
            getState: function() {
                var state;

                if (this._violations && this._violations.length > 0) {
                    state = Y.inputEx.stateInvalid;
                } else if (this.isEmpty()) {
                    state = Y.inputEx.stateEmpty;
                } else {
                    state = Y.inputEx.stateValid;
                }
                Y.log(this + '.getState() - Field - state: ' + state, 'debug', 'inputEx');
                return state;
                /*if (this.isEmpty()) { //TODO MF: better to set the state upon validation
                 Y.log(this + '.getState() -isEmpty=true, violations: ' + Y.JSON.stringify(this._violations), 'debug', 'inputEx');
                 var required = false;
                 if (this._violations) {
                 Y.each(this._violations, function(violation) {
                 if (!Y.Lang.isUndefined(violation.required) && violation.required) { required = true}
                 })
                 }
                 state = required ? Y.inputEx.stateRequired : Y.inputEx.stateEmpty;
                 } else {
                 state = this._violations.length == 0 ? Y.inputEx.stateValid : Y.inputEx.stateInvalid;
                 }*/
            },

            /**
             * Get the string for the given state
             */
            getStateString: function(state) {
                var result;
                switch (state) {
                    case Y.inputEx.stateInvalid:
                        var messages = [];
                        Y.each(this._violations, function(v, k, obj) {
                            var violation = obj[0]
                            var message = v.message.replace(/\{([\w\s\-]+)\}/g, function (x, key) { return (key in violation) ? violation[key] : ''; })
                            messages.push(message)
                        })
                        result = messages
                        break;
                    default:
                        result = state;
                }
                Y.log(this + '.getStateString() - Field - result: ' + Y.JSON.stringify(result), 'debug', 'inputEx');
                return result;
                /* if (state == Y.inputEx.stateRequired) {
                 return this.get('messages').required;
                 } else if (state == Y.inputEx.stateInvalid) {
                 var messages = ''
                 if (this._violations.length > 0) {
                 messages = [];
                 Y.each(this._violations, function(v, k, obj) {
                 var violation = obj[0]
                 var message = v.message.replace(/\{([\w\s\-]+)\}/g, function (x, key) { return (key in violation) ? violation[key] : ''; })
                 messages.push(message)
                 })
                 this.fire(EV_INVALID, null, this._violations);//workarounded this.fire(EV_UPDATE, v, this.get('value'));
                 } else {
                 Y.log(this + '.getStateString() - invalid state but cannot find any invalid message', 'warn', 'inputEx');
                 }
                 return messages;
                 //return this.get('messages').invalid;
                 } else {
                 return '';
                 }*/
            },

            show:function() {
                this.get('el').setStyle('display', '')
                return this;
            },

            hide:function() {
                this.get('el').setStyle('display', 'none')
                return this;
            },

            enable:function() {
                var field = this.getField();
                if (field) field.set('disabled', false);
                return this;
            },

            disable:function() {
                var field = this.getField();
                if (field) field.set('disabled', true);
                return this;
            },

            /**
             * _state.validated - indicate the field has been validated. it doesn't mean it is valid.
             */
            _state:{validated:false},
            /**
             * store a full copy of any violated validation rule(s). Before validate() is called, it's an empty array.
             */
            _violations:[],

            /**
             * validate only on 'field:change'
             */
            validate: function() {
                try {
                    if (!this.getField()) return; //no validation before the field is rendered
                    var value = this.getField().get('value'), result = true;
                    var meta;
                    this._violations = [];

                    if (this.get('validator')) {
                        /**
                         * Validator implementation. It checks every validator and set a boolean result, and update the _validations array
                         */
                        Y.each(this.get('validator'), Y.bind(function(rule) {
                            var rulePassed = true;
                            if (rule.type === 'meta') { // type='meta' is for setting global validator configurations
                                meta = rule;
                            } else if (!Y.Lang.isUndefined(rule.required) && rule.required) {
                                rulePassed = !Y.Lang.isUndefined(value) && !Y.Lang.isNull(value) && value !== '';
                            } else if (rule.regex || rule.regexp) {
                                var regex = rule.regex ? rule.regex : rule.regexp;
                                rulePassed = value.match(regex);
                            } else if (!Y.Lang.isUndefined(rule.minLength) || !Y.Lang.isUndefined(rule.maxLength)) {
                                if (!Y.Lang.isUndefined(rule.minLength)) rulePassed = rulePassed && (value.length >= rule.minLength)
                                if (!Y.Lang.isUndefined(rule.maxLength)) rulePassed = rulePassed && (value.length <= rule.maxLength)
                            } else {
                                Y.log(this + '.validate() - Field - unhandled rule - rule: ' + Y.JSON.stringify(rule), 'warn', 'inputEx');
                            }
                            if (!rulePassed) {
                                this._violations.push(rule)
                                Y.log(this + '.validate() - Field - failed validation rule: ' + Y.JSON.stringify(rule), 'info', 'inputEx');
                            }
                            result = result && rulePassed;
                        }, this))

                        if (meta) { this._violations.unshift(meta) }
                    }

                    Y.log(this + '.validate() - Field - result: ' + result + ', ' + ((this._violations.length == 0) ? 'passed all validation rule(s), rules: ' + Y.JSON.stringify(this.get('validator')) : 'violations: ' + Y.JSON.stringify(this._violations)), 'debug', 'inputEx')
                    this._state.validated = true;
                    return result;
                } catch(e) {
                    Y.log(this + '.validate() - Field - e: ' + e, 'error', 'inputEx');
                }
            },

            /**
             * Clear the field by setting the field value to this.options.value
             * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
             */
            clear: function(sendUpdatedEvt) {
                /* var disableFireEvent = !sendUpdatedEvt
                 this.set('value', Y.Lang.isUndefined(this.get('value')) ? '' : )*/
                //this.setValue(lang.isUndefined(this.options.value) ? '' : this.options.value, sendUpdatedEvt);
            },

            /**
             * This method is provided for backward compatiability. Please use getField() instead
             * @deprecated
             */
            getEl: function() { return this.getField(); },

            /**
             * Should return true if empty
             */
            isEmpty: function() {
                var result = this.getField().get('value') === '';
                //Y.log(this + '.isEmpty() - ' + result, 'debug', 'inputEx')
                return result;
            },

            destructor : function() {
                /*var el = this.getEl();

                 // Unsubscribe all listeners on the updatedEvt
                 this.updatedEvt.unsubscribeAll();

                 // Remove from DOM
                 if(Dom.inDocument(el)) {
                 el.parentNode.removeChild(el);
                 }

                 // recursively purge element
                 util.Event.purgeElement(el, true);*/
                Y.log(this + 'destructor() - Field - destroyed', 'debug', 'inputEx');
            }
        });

        Y.namespace('inputEx');
        Y.inputEx.Field = Field;
    }, '3.0.0pr1', {requires:['inputex','base', 'node','json']});
    //}, '3.0.0pr1', {requires:['base', 'io', 'node', 'json','queue']});


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
 * onChange event handler
 * @param {Event} e The original 'change' event
 */
/*
 onChange: function(e) {
 this.fireUpdatedEvt();
 },

 close: function() {
 },
 */