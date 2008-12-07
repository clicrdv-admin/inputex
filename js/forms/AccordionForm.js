(function () {
    YUI.add('accordionform', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */

        /**
         * @class Form
         * @extends Group
         * @constructor
         */
        var AccordionForm = function(cfg) {
            AccordionForm.superclass.constructor.apply(this, arguments);
        };

        AccordionForm.NAME = "accordionform";
        AccordionForm.ATTRS = {

            /**
             * @attribute action
             * @description submit action, i.e. your form submit target uri
             * @type String
             */
            action:{
                value:null
            },

            /**
             * @attribute method
             * @description submit method, either post or get
             * @type String
             */
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

        Y.extend(AccordionForm, Y.inputEx.Form, {
            initializer : function(cfg) {
                Y.log(this + '.initializer() - AccordionForm -  initialized', 'debug', 'inputEx');
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
        Y.inputEx.AccordionForm = AccordionForm;
        Y.inputEx.registerType("accordionform", AccordionForm);

    }, '3.0.0pr1', {requires:['form']});

})();
