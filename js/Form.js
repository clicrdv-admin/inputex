(function () {
    YUI.add('form', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        var FM = Y.inputEx.FM,  //TODO review this
            /**
             * @event field:render
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_RENDER = 'form:render',
            /**
             * @event field:change
             * @description
             * @preventable TODO DUMMY, REMOVE THIS
             * @param {Event} node
             * @bubbles TODO DUMMY, REMOVE THIS
             * @type Event.Custom
             */
                EV_CHANGE = 'form:change'


        /**
         * @class Form
         * @extends Group
         * @constructor
         */
        var Form = function(cfg) {
            Form.superclass.constructor.apply(this, arguments);
            this.publish(EV_RENDER);
            this.publish(EV_CHANGE);
        };

        Form.NAME = "form";
        Form.ATTRS = {

            action:{
                value:''
            },
            method:{
                value:'POST'
            },
            /**
             * @attribute elClass
             * @description for overriding the class of the outer element, default as 'inputEx-fieldWrapper' for Field
             * @type String
             */
            elClass:{
                value:'inputEx-Form inputEx-Group' //,writeOnce:true cannot use writeOnce 
            },

            /**
             * @attribute formEl
             * @description readOnly field for getting the <form> element. by default, 'el' is a div wrapper and 'formEl' is its direct child
             * @type Node
             */
            inputEl:{
                get:function() {return this._formEl},
                readOnly:true
            }
        };

        Y.extend(Form, Y.inputEx.Group, {
            _formEl:null,
            initializer : function(cfg) {
                Y.log(this + '.initializer() - Form -  initialized', 'debug', 'inputEx');
            },

            render:function() {
                try {
                    var el = this.get('el'), id = el.get('id');
                    el.addClass(this.get('elClass'))

                    this._formEl = Y.Node.create('<form id="' + id + '-form"></form>')
                    if (this.get('name')) this._formEl.set('name', this.get('name'))
                    if (this.get('method')) this._formEl.set('method', this.get('method'))
                    if (this.get('action')) this._formEl.set('action', this.get('action'))
                    el.appendChild(this._formEl);

                    this._renderFields(this._formEl);

                    if (this.get('disabled')) this.disable();

                    Y.log(this + '.render() - Form - rendered - el.innerHTML: ' + this.get('el').get('innerHTML'), 'debug', 'inputEx')
                    this.fire(EV_RENDER, null, this.get('el'));
                    this._rendered = true;

                } catch(e) {
                    Y.log(this + '.render() Form -  - e: ' + e, 'error', 'inputEx');
                }
            }     ,
            _renderFields: function(parentEl, inputFields) {
                parentEl = parentEl ? parentEl : this.get('el')

                var fieldsCfg = (inputFields) ? inputFields : this.get('fields');
                if (fieldsCfg && fieldsCfg.length > 0) {
                    // Iterate this.createInput on input fields
                    for (var i = 0,fieldCfg; fieldCfg = fieldsCfg[i]; i++) {
                        fieldCfg.inputParams = Y.merge({parentEl:parentEl}, fieldCfg.inputParams)
                        var field = this._renderField(fieldCfg); // Render the field
                    }
                }

                Y.log(this + '._renderFields() - Form - rendered - fieldsCfg.length: ' + (fieldsCfg ? fieldsCfg.length : fieldsCfg) + ', _inputs.length: ' + this._inputs.length, 'debug', 'inputEx')
            }

        });

        Y.namespace('inputEx');
        Y.inputEx.Form = Form;
        Y.inputEx.registerType("form", Form);

    }, '3.0.0pr2', {requires:['group']});

})();


/*
 (function () {
 var util = YAHOO.util, lang = YAHOO.lang, Event = YAHOO.util.Event, inputEx = YAHOO.inputEx, Dom = util.Dom;

 */
/**
 * @class Create a group of fields within a FORM tag and adds buttons
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options The following options are added for Forms:
 * <ul>
 *   <li>buttons: list of button definition objects {value: 'Click Me', type: 'submit'}</li>
 *   <li>ajax: send the form through an ajax request (submit button should be present): {method: 'POST', uri: 'myScript.php', callback: same as YAHOO.util.Connect.asyncRequest callback}</li>
 *   <li>showMask: adds a mask over the form while the request is running (default is false)</li>
 * </ul>
 */
/*
 inputEx.Form = function(options) {
 inputEx.Form.superclass.constructor.call(this, options);
 };

 lang.extend(inputEx.Form, inputEx.Group,
 */
/**
 * @scope inputEx.Form.prototype
 */
/*
 {

 */
/**
 * Adds buttons and set ajax default parameters
 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
 */
/*
 setOptions: function(options) {
 inputEx.Form.superclass.setOptions.call(this, options);

 this.buttons = [];

 this.options.buttons = options.buttons || [];


 if(options.ajax) {
 this.options.ajax = {};
 this.options.ajax.method = options.ajax.method || 'POST';
 this.options.ajax.uri = options.ajax.uri || 'default.php';
 this.options.ajax.callback = options.ajax.callback || {};
 this.options.ajax.callback.scope = options.ajax.callback.scope || this;
 this.options.ajax.showMask = lang.isUndefined(options.ajax.showMask) ? false : options.ajax.showMask;
 }
 },


 */
/**
 * Render the group
 */
/*
 render: function() {
 // Create the div wrapper for this group
 this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
 if(this.options.id) {
 this.divEl.id = this.options.id;
 }

 // Create the FORM element
 this.form = inputEx.cn('form', {method: this.options.method || 'POST', action: this.options.action || '', className: this.options.className || 'inputEx-Form'});
 this.divEl.appendChild(this.form);

 // Set the autocomplete attribute to off to disable firefox autocompletion
 this.form.setAttribute('autocomplete','off');

 // Set the name of the form
 if(this.options.formName) { this.form.name = this.options.formName; }

 this.renderFields(this.form);

 this.renderButtons();

 if(this.options.disabled) {
 this.disable();
 }
 },


 */
/**
 * Render the buttons
 */
/*
 renderButtons: function() {

 this.buttonDiv = inputEx.cn('div', {className: 'inputEx-Form-buttonBar'});

 var button, buttonEl;
 for(var i = 0 ; i < this.options.buttons.length ; i++ ) {
 button = this.options.buttons[i];
 buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
 if( button.onClick ) { buttonEl.onclick = button.onClick; }
 this.buttons.push(buttonEl);
 this.buttonDiv.appendChild(buttonEl);
 }

 this.form.appendChild(this.buttonDiv);
 },


 */
/**
 * Init the events
 */
/*
 initEvents: function() {
 inputEx.Form.superclass.initEvents.call(this);

 // Handle the submit event
 Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
 },

 */
/**
 * Intercept the 'onsubmit' event and stop it if !validate
 * If the ajax option object is set, use YUI async Request to send the form
 * @param {Event} e The original onSubmit event
 */
/*
 onSubmit: function(e) {

 // do nothing if does not validate
 if ( !this.validate() ) {
 Event.stopEvent(e); // no submit
 return; // no ajax submit
 }

 if(this.options.ajax) {
 Event.stopEvent(e);
 this.asyncRequest();
 }
 },

 */
/**
 * Send the form value in JSON through an ajax request
 */
/*
 asyncRequest: function() {

 if(this.options.ajax.showMask) { this.showMask(); }
 var postData = "value="+lang.JSON.stringify(this.getValue());
 util.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, {
 success: function(o) {
 if(this.options.ajax.showMask) { this.hideMask(); }
 if( lang.isFunction(this.options.ajax.callback.success) ) {
 this.options.ajax.callback.success.call(this.options.ajax.callback.scope,o);
 }
 },

 failure: function(o) {
 if(this.options.ajax.showMask) { this.hideMask(); }
 if( lang.isFunction(this.options.ajax.callback.failure) ) {
 this.options.ajax.callback.failure.call(this.options.ajax.callback.scope,o);
 }
 },

 scope:this
 }, postData);
 },

 */
/**
 * Create a Mask over the form
 */
/*
 renderMask: function() {
 if(this.maskRendered) return;

 // position as "relative" to position formMask inside as "absolute"
 Dom.setStyle(this.divEl, "position", "relative");

 // set zoom = 1 to fix hasLayout issue with IE6/7
 if (YAHOO.env.ua.ie) { Dom.setStyle(this.divEl, "zoom", 1); }

 // Render mask over the divEl
 this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'},
 {
 display: 'none',
 // Use offsetWidth instead of Dom.getStyle(this.divEl,"width") because
 // would return "auto" with IE instead of size in px
 width: this.divEl.offsetWidth+"px",
 height: this.divEl.offsetHeight+"px"
 },
 "<div/><center><br /><img src='../images/spinner.gif'/><br /><span>"+inputEx.messages.ajaxWait+"</span></center>");
 this.divEl.appendChild(this.formMask);
 this.maskRendered = true;
 },

 */
/**
 * Show the form mask
 */
/*
 showMask: function() {
 this.renderMask();

 // Hide selects in IE 6
 this.toggleSelectsInIE(false);

 this.formMask.style.display = '';
 },

 */
/**
 * Hide the form mask
 */
/*
 hideMask: function() {

 // Show selects back in IE 6
 this.toggleSelectsInIE(true);

 this.formMask.style.display = 'none';
 },

 */
/*
 * Method to hide selects in IE 6 when masking the form (else they would appear over the mask)
 */
/*
 toggleSelectsInIE: function(show) {
 // IE 6 only
 if (!!YAHOO.env.ua.ie && YAHOO.env.ua.ie < 7) {
 var method = !!show ? YAHOO.util.Dom.removeClass : YAHOO.util.Dom.addClass;
 var that = this;
 YAHOO.util.Dom.getElementsBy(
 function() {return true;},
 "select",
 this.divEl,
 function(el) {method.call(that,el,"inputEx-hidden");}
 );
 }
 },


 */
/**
 * Enable all fields and buttons in the form
 */
/*
 enable: function() {
 inputEx.Form.superclass.enable.call(this);
 for (var i = 0 ; i < this.buttons.length ; i++) {
 this.buttons[i].disabled = false;
 }
 },

 */
/**
 * Disable all fields and buttons in the form
 */
/*
 disable: function() {
 inputEx.Form.superclass.disable.call(this);
 for (var i = 0 ; i < this.buttons.length ; i++) {
 this.buttons[i].disabled = true;
 }
 }

 });


 // Specific waiting message in ajax submit
 inputEx.messages.ajaxWait = "Please wait...";;

 */
/**
 * Register this class as "form" type
 */
/*
 inputEx.registerType("form", inputEx.Form);


 })();
 */
