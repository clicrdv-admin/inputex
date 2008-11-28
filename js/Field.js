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
             * @param {Event} TODO DUMMY, REMOVE THIS
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_UPDATE = 'field:update',
            /**
             * @event field:rendered
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} TODO DUMMY, REMOVE THIS
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_RENDERED = 'field:rendered'
        /**
         * @class Field
         * @extends Base
         * @constructor
         */
        var Field = function(cfg) {
            Field.superclass.constructor.apply(this, arguments);
            this.publish("field:updated");
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
                        if (!Y.Lang.isUndefined(this.get('parentEl'))) {
                            this.get('parentEl').appendChild(el);
                        }//else, the node must be manually appended to the DOM

                    }
                    Y.log(this + '.set("el") - el: ' + el + ', cfg: ' + cfg + ', parentEl: ' + this.get('parentEl') + ', name: ' + this.get('name'), 'debug', 'inputEx')
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
                    if (!Y.Lang.isUndefined(this.get('value')))
                        Y.log(this + '.set("value") - updated from "' + this.get('value') + '" to "' + v + '"', 'debug', 'inputEx')
                    //TODO set value
                    this.fire(EV_UPDATE, null, v, this.get('value'));//workarounded this.fire(EV_UPDATE, v, this.get('value')); 
                    return v;
                }
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
                        Y.log(this + '.set("label") - updated from "' + this.get('label') + '" to "' + v + '"', 'debug', 'inputEx')

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
                        Y.log(this + '.set("description") - updated from "' + this.get('description') + '" to "' + v + '"', 'debug', 'inputEx')
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
            _state:{},
            initializer : function(cfg) {
                Y.log(this + '.initializer() - initialized', 'debug', 'inputEx');
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

                    this.renderComponent();

                    if (this.get('description')) {
                        var desc = Y.Node.create('<div id="' + id + '-description" class="inputEx-description"></div>')
                        desc.set('innerHTML', this.get('description'))
                        fieldDiv.appendChild(desc)
                        //TODO update docs: use description instead of 'desc', unless we change them all globally, always be consistent in naming
                    }

                    el.appendChild(fieldDiv);

                    var floatBreaker = Y.Node.create('<div style="clear:both"/>')
                    el.appendChild(floatBreaker)

                    Y.log(this + '.render() - rendered - el.innerHTML: ' + this.get('el').get('innerHTML'), 'debug', 'inputEx')
                } catch(e) {
                    Y.log(this + '.render() - ' + e, 'error', 'inputEx');
                }
            },

            renderComponent:function() {

            },

            focus:function() {
                this.get('el').focus();
            },

            enable:function() {
                this.get('el').set('disabled', false);
            },

            disable:function() {
                this.get('el').set('disabled', true);
            },

            validate: function() {
                return true;
            },

            /**
             * This method is provided for backward compatiability. Please use get('el') instead
             * @deprecated
             */
            getEl: function() {
                return this.get('el')
            },

            destructor : function() {
                Y.log(this + 'destructor() - destroyed', 'debug', 'inputEx');
            }
        });

        Y.namespace('inputEx');
        Y.inputEx.Field = Field;
    }, '3.0.0pr1', {requires:['base', 'node']});
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
