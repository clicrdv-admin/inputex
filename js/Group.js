(function () {
    YUI.add('group', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        var GP = Y.inputEx.GP,  //TODO review this
            /**
             * @event field:render
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_RENDER = 'group:render',
            /**
             * @event field:change
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_CHANGE = 'group:change'


        /**
         * @class Group
         * @extends Field
         * @constructor
         */
        var Group = function(cfg) {
            Group.superclass.constructor.apply(this, arguments);
            this.publish(EV_RENDER);
            this.publish(EV_CHANGE);
        };

        Group.NAME = "group";
        Group.ATTRS = {
            fields :{
                value:[],
                writeOnce:true},
            name :{value:null},
            value:{value:null},
            flatten:{value:false},
            legend:{value:''},

            collapsible:{value:false},
            disabled:{value:false}                                                                             ,

            inputsNames:{value:{}},
            /**
             * Remarks: removed inputConfigs, TODO is it still needed?
             */

            /**
             * @attribute elClass
             * @description for overriding the class of the outer element, default as 'inputEx-fieldWrapper' for Field
             * @type String
             */
            elClass:{
                value:'inputEx-Group' //,writeOnce:true cannot use writeOnce 
            }

        };

        /**
         * TODO:
         *  - port interactions
         *  - port collapse/expand
         */
        Y.extend(Group, Y.inputEx.Field, {
            /**
             * An Array of inputEx Fields. The inputs are constructed upon the first render()
             */
            _inputs:[],
            _toggleEl:null,
            initializer : function(cfg) {
                if (this.get('collapsible')) {
                    //_toggleEl.on('click', this.collpase, this, true)
                    //Event.addListener(this.legend, "click", this.toggleCollapse, this, true);
                }
                Y.log(this + '.initializer() - Group -  initialized', 'debug', 'inputEx');
            },
            renderUI:function() {
                try {
                    var el = this.get('contentBox'), id = el.get('id');
                    el.addClass(this.get('elClass'))

                    this._renderFields(el);

                    if (this.get('disabled')) this.disable();

                    Y.log(this + '.renderUI() - Group - rendered - el.innerHTML: ' + this.get('contentBox').get('innerHTML'), 'debug', 'inputEx')
                    this.fire(EV_RENDER, null, this.get('contentBox'));
                    this._rendered = true;

                } catch(e) {
                    Y.log(this + '.renderUI() Group -  - e: ' + e, 'error', 'inputEx');
                }
            },

            _renderFields: function(parentEl, inputFields) {
                parentEl = parentEl ? parentEl : this.get('contentBox')
                var fieldset = Y.Node.create('<fieldset id="' + this.getID() + '-fieldset"></fieldset>')

                if (this.get('collapsible')) {// Option Collapsible
                    var collapseImg = Y.Node.create('<div class="inputEx-Group-collapseImg"></div>')
                    legend.appendChild(collapseImg)
                    fieldset.addClass('inputEx-Expanded')
                }

                if (this.get('legend') && this.get('legend') !== '') {
                    var legend = Y.Node.create('<legend class="inputEx-Group-legend"></legend>')
                    if (this.get('legend')) legend.set('innerHTML', this.get('legend'))
                    fieldset.appendChild(legend)
                }

                var fieldsCfg = (inputFields) ? inputFields : this.get('fields');
                if (fieldsCfg && fieldsCfg.length > 0) {
                    // Iterate this.createInput on input fields
                    for (var i = 0,fieldCfg; fieldCfg = fieldsCfg[i]; i++) {
                        var field = this._renderField(fieldCfg, fieldset); // Render the field
                        //if (field && field.get('el')) fieldset.appendChild(field.get('el'))
                    }
                }

                parentEl.appendChild(fieldset); // Append the fieldset

                Y.log(this + '._renderFields() - Group - rendered - fieldsCfg.length: ' + (fieldsCfg ? fieldsCfg.length : fieldsCfg) + ', _inputs.length: ' + this._inputs.length, 'debug', 'inputEx')
            },

            /**
             * Instanciate one field given its parameters, type or fieldClass
             * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
             */
            _renderField: function(fieldOptions,fieldset) {
                // Instanciate the field
                var field = new Y.inputEx(fieldOptions);

                if (!field || !field.get) {
                    //Y.log(this + '._renderField() - Group - invalid field, field: ' + Y.JSON.stringify(field) + ', fieldOptions: ' + Y.JSON.stringify(fieldOptions), 'warn', 'inputEx')
                    return;
                }

                field.render(fieldset);
                this._inputs.push(field);

                // Create the this.hasInteractions to run interactions at startup
                if (!this.hasInteractions && this.get('interactions')) {
                    this.hasInteractions = true;
                }

                // Subscribe to the "field:change" event to send the "group:change" event
                //field.on('field:change', this._onChange, this)  //TODO double check the argument
                return field;
            },

            _inputElOnChange:function(field) {
                Y.log(this + '._onChange() - field: ' + field + ', to fire group:change event', 'debug', 'inputEx');
                this.fire(EV_CHANGE, null, field); //pass in the field that is changed
            },

            /**
             * Convenient method for getting a Object of name and value pairs of every field in the group.
             *
             * Remarks: renamed from the previous getValue() method
             */
            getValues:function() {
                var values = {};
                Y.each(this._inputs, function(v) {
                    /* TODO from previous version, port it
                     if(this.inputs[i].options.flatten && lang.isObject(v) ) {
                     lang.augmentObject( o, v);
                     }*/

                    values[v.get('name')] = v.get('value')
                })
                Y.log(this + '.getValues() - return: ' + Y.JSON.stringify(values), 'debug', 'inputEx');
                return values;
            },

            //TODO add a setValues method

            /**
             * Get a field from the group
             *
             * Notice that:
             * 1. when arg is a node id, it still will return the field instance rather than the node
             * 2. when arg is a node id, it refers to the id of the field's el but not id of the field's inputEl
             *
             * Remarks: it replaced getFieldByName in the previous version
             *
             * @param arg if starts with '#', lookup by field's el id, otherwise, lookup by field name
             */
            getField:function(arg) {
                if (!arg) throw new Error(this + '.getField() - invalid arg - arg: ' + arg);
                if (arg.charAt(0) === '#') { // lookup by node id
                    var id = arg.substring(1, arg.length)
                    return Y.inputEx.find(this._inputs, function(v) { if (v.get('el').get('id') === id) return v;})
                } else {
                    return Y.inputEx.find(this._inputs, function(v) { if (v.get('name') === arg) return v;})
                }
            },

            /**
             * Get a inputEl of a field from the group
             *
             * Notice that:
             * 1. when arg is a field name, it returns the inputEl node rather than the field instance
             * 2. when arg is a node id, it refers to the node id of the input el
             *
             * @param arg
             */
            getInputEl:function(arg) {
                if (!arg) throw new Error(this + '.getInputEl() - invalid arg - arg: ' + arg);
                if (arg.charAt(0) === '#') { // lookup by node id
                    var id = arg.substring(1, arg.length)
                    return Y.inputEx.find(this._inputs, function(v) { if (v.get('inputEl').get('id') === id) return v;})
                } else {
                    var field = this.getField(arg)
                    if (field) return field.get('inputEl')
                }
            },

            enable: function() {
                for (var i = 0; i < this.get('inputs').length; i++) {
                    this.get('inputs')[i].enable();
                }
            },

            disable: function() {
                for (var i = 0; i < this.get('inputs').length; i++) {
                    this.get('inputs')[i].disable();
                }
            },

            /**
             * Set the focus to the first input in the group
             */
            focus: function() {
                if (this.get('inputs').length > 0) {
                    this.inputs[0].focus();
                }
            }

        });

        Y.namespace('inputEx');
        Y.inputEx.Group = Group;
        Y.inputEx.registerType("group", Group);

    }, '3.0.0pr2', {requires:['field']});

})();

/*

 if(this.hasInteractions) {
 for(var i = 0 ; i < this.inputs.length ; i++) {
 this.runInteractions(this.inputs[i],this.inputs[i].getValue());
 }
 }


 /**
 * Toggle the collapse state
 */
/*
 toggleCollapse: function() {
 if(Dom.hasClass(this.fieldset, 'inputEx-Expanded')) {
 Dom.replaceClass(this.fieldset, 'inputEx-Expanded', 'inputEx-Collapsed');
 }
 else {
 Dom.replaceClass(this.fieldset, 'inputEx-Collapsed','inputEx-Expanded');
 }
 },

 */
/**
 * Validate each field
 * @returns {Boolean} true if all fields validate and required fields are not empty
 */
/*
 validate: function() {
 var response = true;

 // Validate all the sub fields
 for (var i = 0 ; i < this.inputs.length ; i++) {
 var input = this.inputs[i];
 input.setClassFromState(); // update field classes (mark invalid fields...)
 var state = input.getState();
 if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
 response = false; // but keep looping on fields to set classes
 }
 }
 return response;
 },

 */
/**
 * Set the values of each field from a key/value hash object
 * @param {Any} value The group value
 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
 */
/*
 setValue: function(oValues, sendUpdatedEvt) {
 if(!oValues) {
 return;
 }
 for (var i = 0 ; i < this.inputs.length ; i++) {
 var field = this.inputs[i];
 var name = field.options.name;
 if(name && !lang.isUndefined(oValues[name]) ) {
 field.setValue(oValues[name], false); // don't fire the updated event !
 }
 else {
 field.clear(false);
 }
 }

 if(sendUpdatedEvt !== false) {
 // fire update event
 this.fireUpdatedEvt();
 }
 },

 */
/**
 * Close the group (recursively calls "close" on each field, does NOT hide the group )
 * Call this function before hidding the group to close any field popup
 */
/*
 close: function() {
 for (var i = 0 ; i < this.inputs.length ; i++) {
 this.inputs[i].close();
 }
 },

 */

/**
 * Called when one of the group subfields is updated.
 * @param {String} eventName Event name
 * @param {Array} args Array of [fieldValue, fieldInstance]
 */
/*
 onChange: function(eventName, args) {

 // Run interactions
 var fieldValue = args[0];
 var fieldInstance = args[1];
 this.runInteractions(fieldInstance,fieldValue);

 //this.setClassFromState();

 this.fireUpdatedEvt();
 },

 */
/**
 * Run an action (for interactions)
 * @param {Object} action inputEx action object
 * @param {Any} triggerValue The value that triggered the interaction
 */
/*
 runAction: function(action, triggerValue) {
 var field = this.getFieldByName(action.name);
 if( YAHOO.lang.isFunction(field[action.action]) ) {
 field[action.action].call(field);
 }
 else if( YAHOO.lang.isFunction(action.action) ) {
 action.action.call(field, triggerValue);
 }
 else {
 throw new Error("action "+action.action+" is not a valid action for field "+action.name);
 }
 },

 */
/**
 * Run the interactions for the given field instance
 * @param {inputEx.Field} fieldInstance Field that just changed
 * @param {Any} fieldValue Field value
 */
/*
 runInteractions: function(fieldInstance,fieldValue) {

 var index = inputEx.indexOf(fieldInstance, this.inputs);
 var fieldConfig = this.options.fields[index];
 if( YAHOO.lang.isUndefined(fieldConfig.interactions) ) return;

 // Let's run the interactions !
 var interactions = fieldConfig.interactions;
 for(var i = 0 ; i < interactions.length ; i++) {
 var interaction = interactions[i];
 if(interaction.valueTrigger === fieldValue) {
 for(var j = 0 ; j < interaction.actions.length ; j++) {
 this.runAction(interaction.actions[j], fieldValue);
 }
 }
 }

 },

 */
/**
 * Clear all subfields
 * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
 */
/*
 clear: function(sendUpdatedEvt) {
 for(var i = 0 ; i < this.inputs.length ; i++) {
 this.inputs[i].clear(false);
 }
 if(sendUpdatedEvt !== false) {
 // fire update event
 this.fireUpdatedEvt();
 }
 }


 });
 */