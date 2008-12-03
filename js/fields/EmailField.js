(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('emailfield', function(Y) {
        Y.inputEx = Y.inputEx || {};

        /**
         * @module inputEx
         */
        /**
         * @class Adds an url regexp, and display the favicon at this url
         * @extends StringField
         * @constructor
         * @param {Object} options inputEx.Field options object
         * <ul>
         *   <li>favicon: boolean whether the domain favicon.ico should be displayed or not (default is true, except for https)</li>
         * </ul>
         */
        var EmailField = function(cfg) {
            EmailField.superclass.constructor.apply(this, arguments);
        };

        EmailField.NAME = "emailfield";
        EmailField.ATTRS = {
            /**
             * @attribute value
             * @type String
             */
            value:{
                set:function(v) {
                    var lowercase = (Y.Lang.isUndefined(v)) ? '' : v.toLowerCase();
                    if (!Y.Lang.isUndefined(this.get('value'))) {
                        Y.log(this + '.set("value") - Field - updated from "' + this.get('value') + '" to "' + lowercase + '"', 'debug', 'inputEx')
                    }
                    if (this._rendered) this._updateInputEl(lowercase); // ensure the inputEl is in sync
                    this.fire('field:change', null, lowercase, this.get('value'));//workarounded this.fire(EV_UPDATE, v, this.get('value'));
                    return lowercase;

                    // cannot call parent setter: https://sourceforge.net/tracker2/?func=detail&atid=836476&aid=2378327&group_id=165715
                    //return EmailField.superclass.set.call(this, lowercase).get('value');

                },
                value:''
            } ,
            validator:{
                set:function(v) {
                    if (!Y.inputEx.any(v, function(v) {return !Y.Lang.isUndefined(v.regexp)})) {
                        v.push({regexp:Y.inputEx.regexps.email, message:'Invalid email, ex: sample@test.com'})
                    }
                    return v;
                },
                value:[]//set default at set()
            },
            messages:{
                value:{invalid:'invalid URL'}
            }
        };

        Y.extend(EmailField, Y.inputEx.StringField, {
            initializer : function(cfg) {
                Y.log(this + '.initializer() - EmailField - initialized - validator: ' + Y.inputEx.find(this.get('validator'), function(v) {if (!Y.Lang.isUndefined(v.regexp)) return v}).regexp, 'debug', 'inputEx');
            }
        });

        Y.namespace('inputEx');
        Y.inputEx.EmailField = EmailField;
        Y.inputEx.registerType("email", EmailField);

    }, '3.0.0pr1', {requires:['stringfield']});

})();
