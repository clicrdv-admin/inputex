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
        };

        Y.extend(AccordionForm, Y.inputEx.Form, {
            initializer : function(cfg) {
                Y.log(this + '.initializer() - AccordionForm -  initialized', 'debug', 'inputEx');
            },

            render:function() {
                AccordionForm.superclass.render.apply(this, arguments);
                this._renderAccordionView();
            },

            _renderAccordionView:function() {
                Y.log(this + '._renderAccordionView() - AccordionForm', 'warn', 'inputEx')
                var accordion = new YAHOO.widget.AccordionView(this.getID() + '-list',
                {collapsible: false,width: '600px',expandItem: 0,animationSpeed: '0.3',animate: true,effect: YAHOO.util.Easing.easeBothStrong});
            },

            _renderFields: function(parentEl, inputFields) {
                parentEl = parentEl ? parentEl : this.get('el')

                var fieldsCfg = (inputFields) ? inputFields : this.get('fields');
                if (fieldsCfg && fieldsCfg.length > 0) {
                    // Iterate this.createInput on input fields
                    var list = Y.Node.create('<ul id="' + this.getID() + '-list"></ul>');
                    for (var i = 0,fieldCfg; fieldCfg = fieldsCfg[i]; i++) {
                        var li;
                        if (fieldCfg.type && fieldCfg.type === 'group') {
                            li = Y.Node.create('<li></li>')
                            fieldCfg.inputParams = Y.merge({parentEl:li}, fieldCfg.inputParams)
                            list.appendChild(li)
                        } else {
                            fieldCfg.inputParams = Y.merge({parentEl:parentEl}, fieldCfg.inputParams)
                        }
                        var field = this._renderField(fieldCfg); // Render the field
                        if (fieldCfg.type && fieldCfg.type === 'group') {
                            list.appendChild(li)
                        }
                    }

                    // TODO add condition
                    parentEl.appendChild(list)
                }

                Y.log(this + '._renderFields() - AccordionForm - fieldsCfg.length: ' + (fieldsCfg ? fieldsCfg.length : fieldsCfg) + ', _inputs.length: ' + this._inputs.length, 'warn', 'inputEx')
            },

            /**
             * Instanciate one field given its parameters, type or fieldClass
             * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
             */
            _renderField: function(fieldOptions) {
                var field = AccordionForm.superclass._renderField.apply(this, arguments);

                /**
                 * Some DOM transformation works are done to generate an AccordionView
                 */
                if (field instanceof Y.inputEx.Group) {
                    Y.log(this + '._renderField() - AccordionForm - rendered - field: ' + field, 'warn', 'inputEx');
                    var legend = field.get('el').query('legend')
                    var legendText = legend.get('text')
                    legend.get('parentNode').removeChild(legend)
                    var h3 = Y.Node.create('<h3>' + legendText + '</h3>')
                    var li = field.get('parentEl')
                    li.insertBefore(h3, li.get('firstChild'))
                }
                return field;
            }


        });

        Y.namespace('inputEx');
        Y.inputEx.AccordionForm = AccordionForm;
        Y.inputEx.registerType("accordionform", AccordionForm);

    }, '3.0.0pr1', {requires:['form','accordionform-accordionview']});

})();
