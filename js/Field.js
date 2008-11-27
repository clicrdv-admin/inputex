(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available')}

    YUI.add('field', function(Y) {
        Y.inputEx = Y.inputEx || {};


        /**
         * @module inputEx
         */
        /**
         * @class Field
         * @extends Base
         * @constructor
         */


        var FD = Y.inputEx.FD,
            /**
             * @event field:rendered
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} TODO DUMMY, REMOVE THIS
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_RENDERED = 'field:rendered'


        var Field = function(el, cfg) {
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
                set:function(cfg) { return Field.getNode(cfg); },
                //value: Y.Node.get('body'),
                writeOnce:true
            },

            /**
             *
             */
            el:{
                set:function(cfg) {
                    var el;
                    if (!Y.Lang.isNull(cfg)) { el = Field.getNode(cfg) }

                    if (!el) { //create a new el under parent
                        var id = Y.Lang.isUndefined(this.get('name')) ? Y.guid('div') : this.get('name')
                        el = Y.Node.create('<div id="'+id+'"></div>'); //TODO generate an id if name is not available
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
                set:function(e) {
                    if (!Y.Lang.isUndefined(this.get('value')))
                        Y.log(this + '.value - updated from "' + this.get('value') + '" to "' + e + '"', 'debug', 'inputEx')
                    /**
                     * @event updated
                     * @param {Event} ev, {String} newVal, {String} oldVal
                     * @type Event.Custom
                     */
                    //this.fire('field:updated', e, this.get('value'));
                    this.fire('field:updated', null, e, this.get('value')); //workaround
                    return e;
                }
            },

            /**
             * @attribute id
             * @type String
             * //TODO check what's the YUI3 way to manage id
             * // TODO auto generate ID
             */
            id:{},

            /**
             * @attribute label
             * @description a short descriptive text for a field, normally show at the left hand side of the field element
             * @type String
             */
            label:{},

            /**
             * @attribute description
             * @description a long descriptive text for a field, normally show at the bottom of the field element
             * @type String
             */
            description:{},

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
                value:'inputEx-Field'
            },

            /**
             * @attribute required
             * @description for validation, true if the field is mandatory and cannot be null or empty string. It will
             * be replaced with a validator implementation in future version
             * @type Boolean
             */
            required:{value:false},

            /**
             * @attribute showMsg
             * @description ???
             * @type Boolean
             */
            showMsg:{value:false}

        }

        /**
         * Static methods
         */
        Field.getNode = function(cfg, defaultNde) { //TODO impl defaultNode
            var node;
            if (Y.Lang.isString(cfg)) { node = Y.Node.get(cfg.charAt(0) == '#' ? cfg : '#' + cfg);}
            else if (cfg instanceof Y.Node) { node = cfg}
            else { try {node = Y.Node.get(cfg)} catch(e) {} }
            /*if (Y.Lang.isUndefined(parentNode)) {
             Y.log(this + ' parentEl cannot be identified, parentNode is set to BODY, cfg: ' + cfg, 'warn', 'inputEx');
             parentNode = Y.Node.get('body');
             }*/
            return node;
        }

        Y.extend(Field, Y.Base, {
            _state:{dom:false,com:false,demo:false},
            initializer : function(cfg) {
                Y.stamp(this);
                Y.log('initializer() - ' + this + ' is initialized', 'debug', 'inputEx');
            },

            render:function() {

            },

            renderComponent:function() {

            },

            debug:function() {
                //alert(Y.JSON.stringify(this.get('required')))
                alert(this.get('name'))
            },

            destructor : function() { Y.log('destructor() - ' + this + ' is destroyed', 'debug', 'inputEx'); }
        });

        Y.namespace('inputEx');
        Y.inputEx.Field = Field;

    }, '3.0.0pr1', {requires:['base', 'io', 'node', 'json','queue','cookie']});

    YUI.add('inputEx', function(Y) {}, '3.0.0pr1', {use:['field','json','node'],skinnable:true})
})();


/*
 this.options.messages.required = (options.messages && options.messages.required) ? options.messages.required : inputEx.messages.required;
 this.options.messages.invalid = (options.messages && options.messages.invalid) ? options.messages.invalid : inputEx.messages.invalid;
 //this.options.messages.valid = (options.messages && options.messages.valid) ? options.messages.valid : inputEx.messages.valid;

 * Default render of the dom element. Create a divEl that wraps the field.
 */
/*
 render: function() {

 // Create a DIV element to wrap the editing el and the image
 this.divEl = inputEx.cn('div', {className: 'inputEx-fieldWrapper'});
 if(this.options.id) {
 this.divEl.id = this.options.id;
 }
 if(this.options.required) {
 Dom.addClass(this.divEl, "inputEx-required");
 }

 // Label element
 if(this.options.label) {
 this.labelDiv = inputEx.cn('div', {id: this.divEl.id+'-label', className: 'inputEx-label', 'for': this.divEl.id+'-field'});
 this.labelEl = inputEx.cn('label');
 this.labelEl.appendChild( document.createTextNode(this.options.label) );
 this.labelDiv.appendChild(this.labelEl);
 this.divEl.appendChild(this.labelDiv);
 }

 this.fieldContainer = inputEx.cn('div', {className: this.options.className}); // for wrapping the field and description

 // Render the component directly
 this.renderComponent();

 // Description
 if(this.options.description) {
 this.fieldContainer.appendChild(inputEx.cn('div', {id: this.divEl.id+'-desc', className: 'inputEx-description'}, null, this.options.description));
 }

 this.divEl.appendChild(this.fieldContainer);

 // Insert a float breaker
 this.divEl.appendChild( inputEx.cn('div',null, {clear: 'both'}," ") );

 },

 */
/**
 * Render the interface component into this.divEl
 */
/*
 renderComponent: function() {
 // override me
 },

 */
/**
 * The default render creates a div to put in the messages
 * @return {HTMLElement} divEl The main DIV wrapper
 */
/*
 getEl: function() {
 return this.divEl;
 },

 */
/*
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
 * Validation of the field
 * @return {Boolean} field validation status (true/false)
 */
/*
 validate: function() {
 return true;
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

 */
/**
 * Close the field and eventually opened popups...
 */
/*
 close: function() {
 },

 */
/**
 * Disable the field
 */
/*
 disable: function() {
 },

 */
/**
 * Enable the field
 */
/*
 enable: function() {
 },

 */
/**
 * Focus the field
 */
/*
 focus: function() {
 },

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
