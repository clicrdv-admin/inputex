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
                    EmailField.superclass.set.call(this, lowercase)
                    return lowercase;
                },
                value:''
            } ,
            validator:{
                value:[{regexp:Y.inputEx.regexps.email}]//TODO add message ?
            },
            messages:{
                value:{invalid:'invalid URL'}
            }
        };

        Y.extend(EmailField, Y.inputEx.StringField, {
        });

        Y.namespace('inputEx');
        Y.inputEx.EmailField = EmailField;
        Y.inputEx.registerType("email", EmailField);

    }, '3.0.0pr1', {requires:['stringfield']});

    //inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";
})();
