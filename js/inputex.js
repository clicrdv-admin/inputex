((function() {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') } //TODO load yui3 base dynamically like a Bookmarklet

    YUI.add('inputex', function(Y) {
        //Y.inputEx = Y.inputEx || {};

        /*
         * Build a field from an object like: { type: 'color' or fieldClass: inputEx.ColorField, inputParams: {} }<br />
         * The inputParams property is the object that will be passed as the <code>options</code> parameter to the field class constructor.<br />
         * If the neither type or fieldClass are found, it uses inputEx.StringField
         * @name inputEx
         * @namespace The inputEx global namespace object.
         * @static
         * @param {Object} fieldOptions
         * @return {inputEx.Field} Created field instance
         */
        Y.inputEx = function(fieldOptions) {
            var fieldClass = null;
            if (fieldOptions.type) {
                fieldClass = Y.inputEx.getFieldClass(fieldOptions.type);
                if (fieldClass === null) fieldClass = Y.inputEx.StringField;
            }
            else {
                fieldClass = fieldOptions.fieldClass ? fieldOptions.fieldClass : Y.inputEx.StringField;
            }

            // yui3: new mechanism, try to guess a class
            if (Y.Lang.isUndefined(fieldClass) && fieldOptions.type) {
                try {
                    var type = fieldOptions.type
                    var guessedClassName = 'Y.inputEx.' + type.substring(0, 1).toUpperCase() + type.substring(1, type.length) + 'Field' //capitalize
                    eval('fieldClass = guessedClassName')
                } catch(e) {}
                if (!Y.Lang.isUndefined(fieldClass)) Y.log('Y.inputEx() - guessed class: ' + fieldClass, 'debug', 'inputEx');
            }


            // Instanciate the field
            var inputInstance
            if (fieldClass && Y.Lang.isFunction(fieldClass)) {
                inputInstance = new fieldClass(fieldOptions.inputParams);
            } else {
                Y.log('Y.inputEx() - invalid fieldClass, fieldClass: ' + fieldClass + ', fieldOptions: ' + Y.JSON.stringify(fieldOptions), 'warn', 'inputEx')
            }

            // Add the flatten attribute if present in the params
            /*if(fieldOptions.flatten) {
             inputInstance._flatten = true;
             }*/

            return inputInstance;
        };


        //TODO: review this, attributes and methods are made static
        Y.inputEx.VERSION = "0.3.0";

        /**
         * Url to the spacer image. This url schould be changed according to your project directories
         * @type String
         */
        Y.inputEx.spacerUrl = "images/space.gif";// 1x1 px

        /**
         * Field empty state constant
         * @type String
         */
        Y.inputEx.stateEmpty = 'empty';

        /**
         * Field required state constant
         * @type String
         */
        Y.inputEx.stateRequired = 'required';

        /**
         * Field valid state constant
         * @type String
         */
        Y.inputEx.stateValid = 'valid';

        /**
         * Field invalid state constant
         * @type String
         */
        Y.inputEx.stateInvalid = 'invalid';

        /**
         * Associative array containing field messages
         */
        Y.inputEx.messages = {
            required: "This field is required",
            invalid: "This field is invalid",
            valid: "This field is valid",
            defaultDateFormat: "m/d/Y",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        };

        /**
         * @namespace inputEx widget namespace
         */
        Y.inputEx.widget = {};

        /**
         * Associative array containing common regular expressions
         */
        Y.inputEx.regexps = {
            email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i,
            password: /^[0-9a-zA-Z\x20-\x7E]*$/
        };

        /**
         * Hash between inputEx types and classes (ex: <code>inputEx.typeClasses.color = inputEx.ColorField</code>)<br />
         * Please register the types with the <code>registerType</code> method
         */
        Y.inputEx.typeClasses = {};

        /**
         * When you create a new inputEx Field Class, you can register it to give it a simple type.
         * ex:   inputEx.registerType("color", inputEx.ColorField);
         * @static
         */
        Y.inputEx.registerType = function(type, field) {
            if (!Y.Lang.isString(type)) {
                throw new Error("inputEx.registerType: first argument must be a string");
            }
            if (!Y.Lang.isFunction(field)) {
                throw new Error("inputEx.registerType: second argument must be a function");
            }
            this.typeClasses[type] = field;
        };

        /**
         * Returns the class for the given type
         * ex: inputEx.getFieldClass("color") returns inputEx.ColorField
         * @static
         * @param {String} type String type of the field
         */
        Y.inputEx.getFieldClass = function(type) {
            return Y.Lang.isFunction(this.typeClasses[type]) ? this.typeClasses[type] : null;
        };

        /**
         * Get the inputex type for the given class (ex: <code>inputEx.getType(inputEx.ColorField)</code> returns "color")
         * @static
         * @param {inputEx.Field} FieldClass An inputEx.Field or derivated class
         * @return {String} returns the inputEx type string or <code>null</code>
         */
        Y.inputEx.getType = function(FieldClass) {
            for (var type in this.typeClasses) {
                if (this.typeClasses.hasOwnProperty(type)) {
                    if (this.typeClasses[type] == FieldClass) {
                        return type;
                    }
                }
            }
            return null;
        };

        /**
         * Find the position of the given element. (This method is not available in IE 6)
         * @static
         * @param {Object} el Value to search
         * @param {Array} arr The array to search
         * @return {number} Element position, -1 if not found
         */
        Y.inputEx.indexOf = function(el, arr) {
            var l = arr.length,i;
            for (i = 0; i < l; i++) {
                if (arr[i] == el) return i;
            }
            return -1;
        };

        /**
         * Create a new array without the null or undefined values
         * @static
         * @param {Array} arr The array to compact
         * @return {Array} The new array
         */
        Y.inputEx.compactArray = function(arr) {
            var n = [], l = arr.length,i;
            for (i = 0; i < l; i++) {
                if (!lang.isNull(arr[i]) && !lang.isUndefined(arr[i])) {
                    n.push(arr[i]);
                }
            }
            return n;
        };


        Y.inputEx.escapeHTML = function(unescaped) {
            var escaped = unescaped.replace(/</g, '&lt;')
            escaped = escaped.replace(/>/g, '&gt;')
            return escaped;
        };


        /**
         * Static methods
         */
        Y.inputEx.findNode = function(cfg, defaultNode) { //TODO impl defaultNode
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
        },

                Y.inputEx.any = function(items, fn) {
                    if (Y.Lang.isArray(items)) {
                        for (var k = 0,v; v = items[k]; k++) {
                            if (fn(v, k, items)) {
                                return true;
                            }
                        }
                        return false;
                    } else if (Y.Lang.isObject(items)) {
                        for (var k in items) {
                            if (fn(items[k], k, items)) {
                                return true;
                            }
                        }
                    } else {
                        throw new Error('only array or object are supported')
                    }
                },
                Y.inputEx.find = function(items, fn) {
                    if (Y.Lang.isArray(items)) {
                        for (var k = 0,v; v = items[k]; k++) {
                            var result = fn(v, k, items)
                            if (!Y.Lang.isUndefined(result)) { return result; }
                        }
                        return false;
                    } else if (Y.Lang.isObject(items)) {
                        for (var k in items) {
                               var result = fn(items[k], k, items)
                            if (!Y.Lang.isUndefined(result)) { return result; }
                        }
                    } else {
                        throw new Error('only array or object are supported')
                    }
                }

    }, '3.0.0pr1', {skinnable:true}); //TODO don't know what the 'use' exactly do //use:['field','stringfield'],
})());
