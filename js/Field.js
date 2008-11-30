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
             * @event field:update
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} newVal, oldVal
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             * //TODO consider to pass the field as param
             */
                EV_UPDATE = 'field:update',
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
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_FOCUS = 'field:focus',
            /**
             * @event field:blur
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_BLUR = 'field:blur'
        /**
         * @class Field
         * @extends Base
         * @constructor
         */
        var Field = function(cfg) {
            Field.superclass.constructor.apply(this, arguments);
            this.publish(EV_UPDATE);
            this.publish(EV_RENDER);
            this.publish(EV_FOCUS);
            this.publish(EV_BLUR);
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
                set:function(v, disableUpdateEvent) {
                    if (!Y.Lang.isUndefined(this.get('value'))) { // skip the inital set value
                        Y.log(this + '.set("value") - Field - updated from "' + this.get('value') + '" to "' + v + '", disableUpdateEvent: ' + disableUpdateEvent, 'debug', 'inputEx')
                    }
                    this._setClassFromState()
                    this.fire(EV_UPDATE, null, v, this.get('value'));//workarounded this.fire(EV_UPDATE, v, this.get('value'));
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
             * @description 'class' attribute of the top level HTML node for this field
             * @type String
             */
            className:{
                value:'inputEx-Field',
                writeOnce:true
            },

            /**
             * @attribute required
             * @description for validation, true if the field is mandatory and cannot be null or empty string. It will
             * be replaced with a validator implementation in future version
             * @type Boolean
             */
            required:{
                value:false
            },

            /**
             * @attribute showMsg
             * @description ???
             * @type Boolean
             */
            showMsg:{
                value:false
            }
        };

        /**
         * Static methods
         */
        Field.getNode = function(cfg, defaultNde) { //TODO impl defaultNode
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
            initializer : function(cfg) {
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
                    this.getField().on('focus', Y.bind(this._onFocus, this));
                    this.getField().on('blur', Y.bind(this._onBlur, this));
                    Y.log(this + '.initEvent() - Field - subscribed to focus & blur', 'debug', 'inputEx');
                } else {
                    Y.log(this + '.initEvent() - Field - no available field', 'warn', 'inputEx');
                }
                this._eventInitialized = true;
            },

            displayMessage:function(msg) {
                var el = this.get('el')
                var fieldDiv = el.query('div.inputEx-Field');
                if (!fieldDiv) {
                    return;
                }

                var msgDiv = el.query('div.inputEx-message');
                if (!msgDiv) {
                    msgDiv = Y.Node.create('<div class="inputEx-message"></div>');
                    el.appendChild(msgDiv);
                    el.insertBefore(msgDiv, el.query('div.inputEx-br'))
                }
                Y.log(this + '.displayMessage() - Field - from "' + msgDiv.get('innerHTML') + '" to "' + msg + '"', 'debug', 'inputEx')
                msgDiv.set('innerHTML', msg)
            },

            focus:function() {
                this.get('el').focus();
                return this;
            },

            /**
             * Remarks: New API
             */
            getField:function() {
                var fieldEl;
                var el = this.get('el')
                if (el) { fieldEl = el.query('#' + this.get('el').get('id') + '-field'); }
                if (!fieldEl) { Y.log(this + '.getField() - Field - return undefined', 'warn', 'inputEx'); }
                return fieldEl;
            },

            _onFocus:function() {
                this.get('el').removeClass('inputEx-empty')
                this.get('el').addClass('inputEx-focused')
                this.fire(EV_FOCUS, null, this.get('el'));//workarounded this.fire(EV_UPDATE, this.get('value'));
                Y.log(this + '._onFocus() - Field', 'debug', 'inputEx');
            },

            _onBlur:function() {
                this.get('el').removeClass('inputEx-focused')
                this._setClassFromState();
                this.fire(EV_BLUR, null, this.get('el'));//workarounded this.fire(EV_UPDATE, this.get('value'));
                Y.log(this + '._onBlur() - Field', 'debug', 'inputEx');
            },

            _previousState:null,

            /**
             * Set the styles for valid/invalide state. This is called in upon the following events:
             *  - when the field value is updated
             *  - onblur
             *
             */
            _setClassFromState:function() {
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
             * Returns the current state (given its value)
             * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
             */
            getState: function() {
                // if the field is empty :
                if (this.isEmpty()) { return this.get('required') ? Y.inputEx.stateRequired : Y.inputEx.stateEmpty; }
                return this.validate() ? Y.inputEx.stateValid : Y.inputEx.stateInvalid;
            },

            /**
             * Get the string for the given state
             */
            getStateString: function(state) {
                if (state == Y.inputEx.stateRequired) {
                    return this.get('messages').required;
                } else if (state == Y.inputEx.stateInvalid) {
                    return this.get('messages').invalid;
                } else {
                    return '';
                }
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

            validate: function() { return true; },

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
             * This method is provided for backward compatiability. Please use get('el') instead
             * @deprecated
             */
            getEl: function() { return this.get('el'); },

            /**
             * Should return true if empty
             */
            isEmpty: function() {
                var result = this.get('value') === '';
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
    }, '3.0.0pr1', {requires:['inputex','base', 'node']});
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