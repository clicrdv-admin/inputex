(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

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
             * @event field:blur
             * @description An abstraction of the JavaScript event of the field, user shall use this instead of listen directly to the field
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_BLUR = 'field:blur',

            /**
             * @event field:validated
             * @description after performed validation, if it is valid, violations.length shall be zero
             * @param value, {Array} violations
             * @type Event.Custom
             */
                EV_VALIDATED = 'field:validated'
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
            this.publish(EV_VALIDATED);

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
             * ID is the key reference of every field. It's identical to the id of the boundingBox, and every component,
             * e.g. label, inputBox, input field etc. uses the ID as ID prefix. e.g. if the field ID is field0, the
             * label ID is field0-label.
             *
             * Field ID is determined in the following sequence:
             * 1. 'id' attribute
             * 2. 'id' of boundingBox, if presence
             * 3. 'name' attribute, if presence
             * 4. a generated ID by Y.guid('inputEx')
             *
             * Notice that ID is not the same as the ID of input element (<input>)
             *
             * @attribute id
             * @type String
             *
             * //TODO implement this
             */
            id:{
                valueFn:function() {
                    var id;
                    id = this._boundingBoxOriginalID
                    id = id || this.get('name')
                    id = id || Y.guid('inputEx')
                    return id;
                },
                writeOnce:true
            },

            /**
             * @attribute value
             * @type String
             */
            value:{
                set:function(newVal) {
                    if (!Y.Lang.isUndefined(this.get('value'))) {
                        Y.log(this + '.set("value") - Field - updated from "' + this.get('value') + '" to "' + newVal + '"', 'debug', 'inputEx')
                    }

                    // when value is updated by API, sync the value to the inputEl; it shall be set b4 any change event
                    if (this.get('rendered') === true) { this._updateToInputEl(newVal) }

                    this.fire(EV_CHANGE, null, newVal, this.get('value'));//workarounded with the null argument
                    return newVal;
                },
                value:null
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

                    var labelEl = this.get('contentBox').query('#' + this.get('contentBox').get('id') + '-label')
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
                    var descEl = this.get('contentBox').query('#' + this.get('contentBox').get('id') + '-description')
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
             * @attribute elClass
             * @description for overriding the class of the outer element, default as 'inputEx-fieldWrapper' for Field
             * @type String
             */
            boundingBoxClass:{
                value:'inputEx-fieldWrapper'//,writeOnce:true cannot use writeOnce https://sourceforge.net/tracker2/?func=detail&atid=836476&aid=2378327&group_id=165715
            },

            contentBoxClass:{
                value:'inputEx-contentBox'
            },

            /**
             * @attribute className
             * @description
             * @type String
             *
             * //TODO: comment: it seems to be more useful to define the class for the wrapping-div, e.g.
             * user may set a margin for a field, or position it specially.
             * //TODO: rename to fieldElClass?
             */
            className:{
                value:'inputEx-Field'//,writeOnce:true
            },

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
            },

            /**
             * @attribute validateOnRender
             * @description validate *after* rendered
             * @type boolean
             * @default true
             */
            validateOnRender:{
                set:function(newVal) {
                    Y.log(this + '.set("validateOnRender") - Field - newVal: ' + newVal, 'debug', 'inputEx')
                    if (newVal === true) { this.after('render', Y.bind(function() {this.validate();}, this), this) }
                },
                value:true,
                writeOnce:true
            },

            /**
             * @attribute validateOnChange
             * @type boolean
             * @default true
             */
            validateOnChange:{
                set:function(newVal) {
                    var oldVal = this.get('validateOnChange')
                    Y.log(this + '.set("validateOnChange") - Field - newVal: ' + newVal + ', oldVal: ' + oldVal, 'debug', 'inputEx')
                    if (!this._fnValidate) this._fnValidate = Y.bind(function() {this.validate();}, this)

                    if (oldVal !== newVal) {
                        if (newVal === true) {
                            this.on(EV_CHANGE, this._fnValidate, this)
                        } else {
                            this.unsubscribe(EV_CHANGE, this._fnValidate, this)
                        }
                    }
                },
                value:true
                //TODO add validate to ensure only true or false are used
            },
            /**
             * @attribute inputEl
             * @description readOnly field for getting the <input> element. value of the inputEl may not be the same as the value of
             * the field. e.g. when typeInvite is being shown.
             * @type Node
             */
            inputEl:{
                get:function() {return this._inputEl},
                readOnly:true
            }
        };

        Y.extend(Field, Y.Widget, {
            /**
             * The Node of the Input Wrapper. by default, it's a <div>. Notice that an inputElement may have more than
             * one wrapper. e.g. for StringField, it has two wrappers. This el reference to the outer wrapper. The
             * inner wrapper is not accessible by Field. This element is created by Field on render() and is accessible
             * in renderComponent()
             *
             * //TODO rename it ti _inputBox or inputElBox
             */
            _inputBox:null,

            /**
             * The Node of the Input element, e.g. <input ... />
             * Avoid direct reference to this, use _getInputEl() instead. _getInputEl() will attemp to look up the field
             * by id if _inputEl is null.
             */
            _inputEl:null, //reference to the Field node

            _previousState:null,
            /**
             * _state.validated - indicate the field has been validated. it doesn't mean it is valid.
             */
            _validated:false,
            /**
             * store a full copy of any violated validation rule(s). Before validate() is called, it's an empty array.
             */
            _violations:[],
            /**
             * If an event handling function return false, the next event will not fire. So validate() is wrapped
             * and not to return false in invalid case to avoid skipping the next event.
             */
            _fnValidate:null,

            initializer : function(cfg) {
                this._initID(this.get('id'))
                this.on(EV_CHANGE, this.syncUI, this);
                //remarks: the following hasFocusChange handling override the widget default, and no yui-xxx-focus class will be set
                /*
                 this.on('hasFocusChange', function(evt) {
                 if (evt.prevVal !== evt.newVal && evt.newVal === true) {
                 var inputEl = this._getInputEl()
                 if (inputEl) inputEl.focus();
                 }
                 return true;
                 }, this)
                 */
                Y.log(this + '.initializer() - Field - Field initialized', 'debug', 'inputEx');
            },


            /**
             * Called by ID attribute
             */
            _initID:function(id) {
                if (this.get('boundingBox')) this.get('boundingBox').set('id', id)
                if (this.get('contentBox')) this.get('contentBox').set('id', id + '-content')
                if (this._inputBox) this._inputBox.set('id', id + '-inputBox')
                if (this._getInputEl()) this._getInputEl().set('id', id + '-field')
                Y.log(this + '._initID() - id: ' + id, 'info', 'inputEx')
            },

            /**
             * YUI Widget protected method
             */
            _renderBoxClassNames:function() {
                Field.superclass._renderBoxClassNames.apply(this, arguments);
                this.get('boundingBox').addClass(this.get('boundingBoxClass'))
            },

            /**
             * YUI Widget protected method. Overriden to disable the default focus behavior
             */
            _bindDOMListeners : function() {
                Y.log(this + '._bindDOMListener() - _inputEl: ' + this._inputEl, 'debug', 'inputEx');
                this.get('boundingBox').on('focus', Y.bind(function() {
                    if (this._inputEl) {
                        this.blur();
                        this._inputEl.focus();
                    }
                }, this))
            },

            CONTENT_TEMPLATE:'<div id="{id}-content" class="{className}"></div>',

            CONTENT_COMPONENTS:{
                label:'<div><labe></label></div>',
                message:'<div><labe></label></div>',
                inputElBox:'<div></div>',
                description:'<div><labe></label></div>'
            },

            /**
             * Due to a bug in PR2 that writeOnce attribute cannot be overridden, 'boundingBox' will be loaded before 'id'.
             * When id is loaded, and if id is not defined, _boundingBoxOriginalID will be checked to define field ID
             *
             * TODO: move this logic to boundingBox attribute
             */
            _boundingBoxOriginalID:null,
            _setBoundingBox:function(node) {
                node = Y.Node.get(node)
                if (node && node.get('id')) {
                    Y.log(this + '._setBoundingBox() - node.id: ' + node.get('id'), 'debug', 'inputEx')
                    this._boundingBoxOriginalID = node.get('id')
                }
                return this._setBox(node, this.BOUNDING_TEMPLATE);
            },

            /**
             * YUI Widget protected method. Overriden to support variable
             */
            _setContentBox:function(node) {
                var template = Y.substitute(this.CONTENT_TEMPLATE, this.CONTENT_COMPONENTS)
                return this._setBox(node, template)
            },

            renderUI:function() {
                try {
                    var el = this.get('contentBox'), id = el.get('id');
                    el.addClass(this.get('boundingBoxClass'))

                    if (this.get('required')) el.addClass('inputEx-required')

                    if (this.get('label')) {
                        var labelDiv = Y.Node.create('<div class="inputEx-label"></div>')
                        var label = Y.Node.create('<label id="' + id + '-label" for="' + id + '-field">' + this.get('label') + '</label>')
                        labelDiv.appendChild(label)
                        el.appendChild(labelDiv)
                        //TODO the trunk has error. backport the label for
                    }

                    this._inputBox = Y.Node.create('<div class="' + this.get('className') + '"></div>');

                    this.renderComponent(this._inputBox);
                    this._inputEl = this._getInputEl();

                    if (this.get('description')) {
                        var desc = Y.Node.create('<div id="' + id + '-description" class="inputEx-description"></div>')
                        desc.set('innerHTML', this.get('description'))
                        this._inputBox.appendChild(desc)
                        //TODO update docs: use description instead of 'desc', unless we change them all globally, always be consistent in naming
                    }

                    el.appendChild(this._inputBox);

                    var floatBreaker = Y.Node.create('<div class="inputEx-br" style="clear:both"/>') //remarks: added inputEx-br for lookup
                    el.appendChild(floatBreaker)

                    Y.log(this + '.renderUI() - Field - rendered', 'debug', 'inputEx')
                    //this.fire(EV_RENDER, null, this.get('contentBox'));//workarounded this.fire(EV_RENDER, this.get('contentBox'));
                    return this;
                } catch(e) {
                    Y.log(this + '.renderUI() - Field - ' + e, 'error', 'inputEx');
                }
            },


            /**
             * @abstract
             */
            renderComponent:function(container) {
                Y.fail(this + '.renderComponent() - Field - Abstract renderComponent method shall be implemented');
                //a simple text field is created for development
                /*var field = Y.Node.create('<input id="' + this.getID() + '-field" type="text"/>')
                 if (this.get('name')) field.set('name', this.get('name'))
                 if (this.get('value')) field.set('value', this.get('value'))
                 container.appendChild(field)*/
            },

            _bindUIDone:false,

            bindUI:function() {
                if (this._bindUIDone) return;

                this._inputEl.on('focus', Y.bind(this._onFocus, this));
                this._inputEl.on('blur', Y.bind(this._onBlur, this));

                if (this._getInputEl()) {
                    this._getInputEl().on('change', Y.bind(this._inputElOnChange, this));
                    this._getInputEl().on('focus', Y.bind(this._inputElOnFocus, this));
                    this._getInputEl().on('blur', Y.bind(this._inputElOnBlur, this));
                    Y.log(this + '.bindUI() - Field - subscribed to change, focus & blur', 'debug', 'inputEx');
                } else {
                    Y.log(this + '.bindUI() - Field - no available field', 'warn', 'inputEx');
                }
                this._bindUIDone = true;
            },

            /**
             * Formerly named setClassFromState
             *
             * Set the styles for valid/invalide state. This is called in upon the following events:
             *  - in the last stage of rendering
             *  - when the field value is updated
             *  - onblur
             *
             */
            syncUI:function() {
                Y.log(this + '.syncUI() - Field - begin', 'debug', 'inputEx');

                //TODO move the focus class to bounding box, and utilize the YUI Widget mechanism

                // remove previous class
                if (this.previousState) {
                    // remove invalid className for both required and invalid fields
                    var className = 'inputEx-' + ((this.previousState == Y.inputEx.stateRequired) ? Y.inputEx.stateInvalid : this.previousState)
                    this.get('contentBox').removeClass(className);
                }

                // add new class
                var state = this.getState();
                if (!(state == Y.inputEx.stateEmpty && this.get('contentBox').hasClass('inputEx-focused') )) {
                    // add invalid className for both required and invalid fields
                    var className = 'inputEx-' + ((state == Y.inputEx.stateRequired) ? Y.inputEx.stateInvalid : state)
                    this.get('contentBox').addClass(className);
                }

                if (this.get('showMsg')) {
                    this.displayMessage(this.getStateString(state));
                }

                Y.log(this + '.syncUI() - Field - previousState: ' + this.previousState + ', state: ' + state, 'debug', 'inputEx');
                this.previousState = state;
            },

            displayMessage:function(msg) {
                var el = this.get('contentBox')
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

            getID:function() {
                return this.get('id') || this.get('contentBox').get('id');
            },

            /**
             * Return this._inputEl if existed. Otherwise, it tries to look for the inputEl by naming convention.
             */
            _getInputEl:function() {
                if (this._inputEl) return this._inputEl;

                if (this.get('contentBox')) { this._inputEl = this.get('contentBox').query('#' + this.getID() + '-field'); }
                return this._inputEl;
            },

            /*
             focus:function() {
             Y.log(this + '.focus() - Field - hasFocus: ' + this.get('hasFocus'), 'warn', 'inputEx')
             Field.superclass.focus.apply(this, arguments);
             Y.log(this + '.focus() - Field - hasFocus: ' + this.get('hasFocus'), 'warn', 'inputEx')
             var inputEl = this._getInputEl()
             if (inputEl) inputEl.focus();
             Y.log(this + '.focus() - Field - hasFocus: ' + this.get('hasFocus'), 'warn', 'inputEx')
             return this;
             },
             */

            _inputElOnFocus:function() {
                this.get('contentBox').removeClass('inputEx-empty')
                this.get('contentBox').addClass('inputEx-focused')
                Y.log(this + '._inputElOnFocus() - Field - hasFocus: ' + this.get('hasFocus'), 'debug', 'inputEx');
                this.fire(EV_FOCUS, null, this.get('contentBox'));//workarounded this.fire(EV_UPDATE, this.get('value'));
            },

            _inputElOnBlur:function() {
                this.get('contentBox').removeClass('inputEx-focused')
                Y.log(this + '._inputElOnBlur() - Field - value: ' + this.get('value'), 'debug', 'inputEx');
                this.fire(EV_BLUR, null, this.get('contentBox'));//workarounded this.fire(EV_UPDATE, this.get('value'));
            },

            _inputElOnChange:function() {
                var oldVal = this.get('value'), newVal = this._getInputEl().get('value');
                Y.log(this + '._inputElOnChange() - Field - from "' + oldVal + '" to "' + newVal + '"', 'debug', 'inputEx')
                this._updateFromInputEl();
            },

            /**
             * Synchronize inputEl from value. This method is called before 'value' is actually updated, so a newVal
             * argument is required.
             * @param newVal
             */
            _updateToInputEl:function(newVal) {
                var inputEl = this._getInputEl();
                if (inputEl && newVal !== inputEl.get('value')) {
                    Y.log(this + '._updateToInputEl() - Field - update inputEl from "' + this._getInputEl().get('value') + '" to "' + newVal + '"', 'debug', 'inputEx');
                    this._getInputEl().set('value', newVal)
                }
            },

            /**
             * Synchronize value from inputEl
             */
            _updateFromInputEl:function() {
                var inputEl = this._getInputEl();
                if (inputEl && inputEl.get('value') !== this.get('value')) {
                    //Y.log(this + '._updateFromInputEl() - Field - update value from "' + this.get('value') + '" to "' + inputEl.get('value') + '"', 'debug', 'inputEx');
                    this.set('value', inputEl.get('value'))
                }
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
                            var violation = obj[k]
                            if (v.message) {
                                var message = v.message.replace(/\{([\w\s\-]+)\}/g, function (x, key) { return (key in violation) ? violation[key] : ''; })
                                messages.push(message)
                            }
                        })
                        result = messages
                        break;
                    default:
                    //result = state;
                        result = '';
                }
                Y.log(this + '.getStateString() - Field - result: ' + Y.JSON.stringify(result) + ', _violations: ' + Y.JSON.stringify(this._violations), 'debug', 'inputEx');
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

            /**
             * validate depends on the validateOnChange and validateOnRender
             */
            validate: function(value) {
                try {
                    if (!this.get('rendered') || !this._getInputEl()) {
                        Y.log(this + '.validate() - Field - field is not rendered or inputEl is null, validate is skipped', 'warn', 'inputEx')
                        return;
                    }
                    value = Y.Lang.isUndefined(value) ? this._getInputEl().get('value') : value; //validate() is called before set('value')
                    var meta, result = true,validator = this.get('validator');
                    this._violations = [];

                    if (validator) {
                        //Y.log(this + '.validate() - has validator - value: ' + value + ', isUndefined? ' + Y.Lang.isUndefined(value) + ', isNull? ' + Y.Lang.isNull(value) + ', isEmpty? ' + (Y.Lang.trim(value) === ''), 'warn', 'inputEx');
                        if (Y.Lang.trim(value) !== '' || Y.inputEx.any(validator, function(v) {return v.required})) {
                            //Y.log(this + '.validate() - not empty or is required', 'warn', 'inputEx');
                            /**
                             * Validator implementation. It checks every validator and set a boolean result, and update the _validations array
                             */
                            Y.each(validator, Y.bind(function(rule) {
                                var rulePassed = true;
                                if (rule.type === 'meta') { // type='meta' is for setting global validator configurations
                                    meta = rule;
                                } else if (!Y.Lang.isUndefined(rule.required) && rule.required) {
                                    rulePassed = !Y.Lang.isUndefined(value) && !Y.Lang.isNull(value) && Y.Lang.trim(value) !== '';
                                } else if (rule.regexp) {
                                    rulePassed = new RegExp(rule.regexp).test(value);
                                } else if (!Y.Lang.isUndefined(rule.minLength) || !Y.Lang.isUndefined(rule.maxLength)) {
                                    if (!Y.Lang.isUndefined(rule.minLength)) rulePassed = rulePassed && (value.length >= rule.minLength)
                                    if (!Y.Lang.isUndefined(rule.maxLength)) rulePassed = rulePassed && (value.length <= rule.maxLength)
                                } else if (!Y.Lang.isUndefined(rule.min) || !Y.Lang.isUndefined(rule.max)) {
                                    if (!Y.Lang.isUndefined(rule.min)) rulePassed = rulePassed && (value >= rule.min)
                                    if (!Y.Lang.isUndefined(rule.max)) rulePassed = rulePassed && (value <= rule.max)
                                } else {
                                    Y.log(this + '.validate() - Field - unhandled rule - rule: ' + Y.JSON.stringify(rule), 'warn', 'inputEx');
                                }
                                if (!rulePassed) {
                                    this._violations.push(rule)
                                    Y.log(this + '.validate() - Field - failed validation rule: ' + Y.JSON.stringify(rule), 'info', 'inputEx');
                                }
                                result = result && rulePassed;
                            }, this))

                            if (!result && meta) { this._violations.unshift(meta) }
                        } else { //if the field is null and required
                            meta = Y.inputEx.find(validator, function(v) {if (v.type && v.type == 'meta') return v})
                            //Y.log(this + '.validate() - value is empty, meta: ' + Y.JSON.stringify(meta), 'warn', 'inputEx');
                            result = false;
                            this._violations.push(Y.inputEx.find(validator, function(v) { if (v.required) return v}))
                            if (!result && meta) { this._violations.unshift(meta) }
                        }
                    }

                    Y.log(this + '.validate() - Field - result: ' + result + ', ' + ((this._violations.length == 0) ? 'passed all validation rule(s), rules: ' + Y.JSON.stringify(this.get('validator')) : 'violations: ' + Y.JSON.stringify(this._violations)), 'debug', 'inputEx')
                    this._validated = true;
                    this.fire(EV_VALIDATED, null, value, this._violations);//TODO workarounded
                    this.syncUI();
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
             * @deprecated
             * The YUI3 version separated 'value' attribute and 'value' of the input element. This method is unclear
             * in telling which field it is to check.
             *
             * The current implementation checks the input element. but it should not be used.
             */
            isEmpty: function() {
                var result = this._getInputEl().get('value') === '';
                //Y.log(this + '.isEmpty() - ' + result, 'debug', 'inputEx')
                return result;
            },

            /**
             * YUI Widget public method
             */
            show:function() {
                this.get('boundingBox').setStyle('display', '')
                return Field.superclass.show.apply(this, arguments);
            },

            /**
             * YUI Widget public method
             */
            hide:function() {
                this.get('boundingBox').setStyle('display', 'none')
                return Field.superclass.hide.apply(this, arguments);
            },

            /**
             * YUI Widget public method
             */
            enable:function() {
                var field = this._getInputEl();
                if (field) field.set('disabled', false);
                return Field.superclass.enable.apply(this, arguments);
            },

            /**
             * YUI Widget public method
             */
            disable:function() {
                var field = this._getInputEl();
                if (field) field.set('disabled', true);
                return Field.superclass.disable.apply(this, arguments);
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
    }, '3.0.0pr2', {requires:['inputex','widget', 'node','json']});
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

 close: function() {
 },
 */