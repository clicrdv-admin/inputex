(function () {
    YUI.add('group', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * @class Group
         * @extends Field
         * @constructor
         */
        var Group = function(cfg) {
            Group.superclass.constructor.apply(this, arguments);
        };

        Group.NAME = "group";
        Group.ATTRS = {
            fields :{value:'text',readOnly:true},
            id :{value:null},
            name :{value:null},
            value:{value:null},
            flatten:{value:false},
            legend:{value:''},

            collapsible:{value:false},
            disabled:{value:false}                                                                             ,
            inputs:{value:[]},
            inputsNames:{value:{}}
            /**
             * Remarks: removed inputConfigs, TODO is it still needed?
             */
        };

        Y.extend(Group, Y.inputEx.Field, {
            _toggleEl:null,
            initializer : function(cfg) {
                if (this.get('collapsible')) {
                    //_toggleEl.on('click', this.collpase, this, true)
                    //Event.addListener(this.legend, "click", this.toggleCollapse, this, true);
                }
                Y.log(this + '.initializer() - initialized', 'debug', 'inputEx');
            },
            render:function() {
                try {
                    // Create the div wrapper for this group
                    /* this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
                     if(this.options.id) {
                     this.divEl.id = this.options.id;
                     }

                     this.renderFields(this.divEl);

                     if(this.options.disabled) {
                     this.disable();
                     }
                     */

                    Y.log(this + '.render() - done', 'debug', 'inputEx');
                } catch(e) {
                    Y.log(this + '.render() - e: ' + e, 'error', 'inputEx');
                }
            },

            _onchange:function() {

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
            }
        });

        Y.namespace('inputEx');
        Y.inputEx.Group = Group;

    }, '3.0.0pr1', {requires:['field']});

    //    YUI.add('inputex', function(Y) {
    //    }, '3.0.0pr1', {use:['inputex','field'],skinnable:true})
})();

/*

 if(this.hasInteractions) {
 for(var i = 0 ; i < this.inputs.length ; i++) {
 this.runInteractions(this.inputs[i],this.inputs[i].getValue());
 }
 }
 renderFields: function(parentEl, inputFields) {
 var fields = (!lang.isUndefined(inputFields)) ? inputFields : this.options.fields;

 this.fieldset = inputEx.cn('fieldset',{id:this.divEl.id?this.divEl.id+'-fieldset':YAHOO.util.Dom.generateId()});
 this.legend = inputEx.cn('legend', {className: 'inputEx-Group-legend'});

 // Option Collapsible
 if(this.options.collapsible) {
 var collapseImg = inputEx.cn('div', {className: 'inputEx-Group-collapseImg'}, null, ' ');
 this.legend.appendChild(collapseImg);
 inputEx.sn(this.fieldset,{className:'inputEx-Expanded'});
 }

 if(!lang.isUndefined(this.options.legend) && this.options.legend !== ''){
 this.legend.appendChild( document.createTextNode(" "+this.options.legend) );
 }

 if( this.options.collapsible || (!lang.isUndefined(this.options.legend) && this.options.legend !== '') ) {
 this.fieldset.appendChild(this.legend);
 }

 // Iterate this.createInput on input fields
 for (var i = 0 ; i < fields.length ; i++) {
 var input = fields[i];

 // Render the field
 var field = this.renderField(input);
 this.fieldset.appendChild(field.getEl() );
 }

 // Append the fieldset
 parentEl.appendChild(this.fieldset);
 },

 */
/**
 * Instanciate one field given its parameters, type or fieldClass
 * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
 */
/*
 renderField: function(fieldOptions) {

 // Instanciate the field
 var fieldInstance = inputEx.buildField(fieldOptions);

 this.inputs.push(fieldInstance);

 // Create an index to access fields by their name
 if(fieldInstance.options.name) {
 this.inputsNames[fieldInstance.options.name] = fieldInstance;
 }

 // Create the this.hasInteractions to run interactions at startup
 if(!this.hasInteractions && fieldOptions.interactions) {
 this.hasInteractions = true;
 }

 // Subscribe to the field "updated" event to send the group "updated" event
 fieldInstance.updatedEvt.subscribe(this.onChange, this, true);

 return fieldInstance;
 },

 */
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
 * Enable all fields in the group
 */


* /
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
     * Return an object with all the values of the fields
     */
    /*
     getValue: function() {
     var o = {};
     for (var i = 0 ; i < this.inputs.length ; i++) {
     var v = this.inputs[i].getValue();
     if(this.inputs[i].options.name) {
     if(this.inputs[i].options.flatten && lang.isObject(v) ) {
     lang.augmentObject( o, v);
     }
     else {
     o[this.inputs[i].options.name] = v;
     }
     }
     }
     return o;
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
     * Set the focus to the first input in the group
     */
    /*
     focus: function() {
     if( this.inputs.length > 0 ) {
     this.inputs[0].focus();
     }
     },

     */
    /**
     * Return the sub-field instance by its name property
     * @param {String} fieldName The name property
     */
    /*
     getFieldByName: function(fieldName) {
     if( !this.inputsNames.hasOwnProperty(fieldName) ) {
     return null;
     }
     return this.inputsNames[fieldName];
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
    /**
     * Register this class as "group" type
     */
    /*
     inputEx.registerType("group", inputEx.Group);


     })();*/
