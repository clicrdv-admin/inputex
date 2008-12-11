(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('selectfield', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * @class SelectField
         * @extends Field
         * @constructor
         */
        var SelectField = function(cfg) {
            SelectField.superclass.constructor.apply(this, arguments);
        };

        SelectField.NAME = "selectfield";
        SelectField.ATTRS = {
            className:{
                value:'inputEx-Field inputEx-SelectField'
            },

            /**
             * @attribute selectValues
             * @description contains the list of options values
             * @type Array
             * @default selectOptions
             */
            selectValues:{
            },

            /**
             * @attribute selectOptions
             * @description list of option element texts, if no selectOptions is defined, the select box will be shown as empty
             * @type Array
             * @default []
             */
            selectOptions:{
            },

            /**
             * @attribute multiple
             * @description  boolean to allow multiple selections
             * @default false
             */
            multiple:{
                value:false
            },

            /**
             * @attribute size
             * @description  number of 'row'
             * @type Integer
             * @default 1
             */
            size:{
                value:1
            },

            /**
             * @attribute selectedIndex
             */
            selectedIndex:{
                value:null
            }
        }

        Y.extend(SelectField, Y.inputEx.Field, {
            initializer : function(cfg) {
                if (this.get('selectValues').length <= 0)
                    Y.log(this + '.initializer() - no selectValues, select box will be empty - selectValues.length: ' + this.get('selectValues').length, 'warn', 'inputEx')

                if (this.get('selectedIndex') && this.get('selectedIndex') + 1 > this.get('selectValues').length)
                    throw new Error('selectedIndex is invalid, selectedIndex: ' + this.get('selectedIndex') + ', selectValues.length: ' + this.get('selectValues').length)


                if (!this.get('selectedIndex') && !this.get('value')) {
                    //if neither selectedIndex or value are defined, set selectIndex to 0
                    this.set('selectedIndex', 0)
                } else if (this.get('value')) {
                    var selectedIndex = Y.Array.indexOf(this.get('selectValues'), this.get('value'))
                    if (selectedIndex == -1) {
                        Y.log(this + '.initializer() - selectedIndex is -1, use 0 as default - value: ' + this.get('value') + ', selectValues: ' + this.get('selectValues'), 'warn', 'inputEx')
                        selectedIndex = 0;
                    }
                    this.set('selectedIndex', selectedIndex);
                }

                Y.log(this + '.initializer() - SelectField - initialized', 'debug', 'inputEx');
            },

            /**
             * Render the checkbox and the hidden field
             */
            renderComponent: function() {
                if (!this._inputEl) this._inputEl = Y.Node.create('<select></select>')

                if (this.get('name')) this._inputEl.set('name', this.get('name'))
                this._inputEl.set('multiple', this.get('multiple'))
                this._inputEl.set('size', this.get('size'))
                
                var values = this.get('selectValues'), options = this.get('selectOptions')
                for (var i = 0; i < values.length; i++) {
                    var label = "" + ((options) ? options[i] : values[i])
                    var selected = i === this.get('selectedIndex') ? ' selected="selected"' : ''; //for generating a correct HTML, it's not taking effect
                    var option = Y.Node.create('<option value="' + values[i] + '"' + selected + '>' + label + '</option>')
                    //if (i === this.get('selectedIndex')) option.set('selected', true) //can't use https://sourceforge.net/tracker2/?func=detail&aid=2391291&group_id=165715&atid=836476
                    this._inputEl.appendChild(option);
                }
                this._inputEl.set('selectedIndex', this.get('selectedIndex'))

                this.get('el').appendChild(this._inputEl);

            }
        }
                );

        Y.namespace('inputEx');
        Y.inputEx.SelectField = SelectField;
        Y.inputEx.registerType("select", SelectField);

    }, '3.0.0pr2', {requires:['field']});
})();
