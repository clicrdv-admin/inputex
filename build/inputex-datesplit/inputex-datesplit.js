YUI.add('inputex-datesplit', function (Y, NAME) {

/**
 * @module inputex-datesplit
 */
var lang = Y.Lang,
    inputEx = Y.inputEx;

/**
 * inputEx.DateSplitField
 * @class inputEx.DateSplitField
 * @extends inputEx.CombineField
 */
inputEx.DateSplitField = function(options) {

   // The ressource bundle is loaded here because
   // DateSplitField needs them to construct his fields

   // this.messages will be overridden by the constructor of Field and re-loaded and mix in setOptions
   this.messages = Y.Intl.get("inputex-datesplit");

   if(!options.dateFormat) {options.dateFormat = this.messages.defaultDateFormat; }
   
   var formatSplit = options.dateFormat.split("/");
   this.yearIndex = inputEx.indexOf('Y',formatSplit);
   this.monthIndex = inputEx.indexOf('m',formatSplit);
   this.dayIndex = inputEx.indexOf('d',formatSplit);

    if(options && options.initValues){
        var map = options.initValues;
        this.initDayValue = map.day;
        this.initMonthValue = map.month;
        this.initYearValue = map.year;
    }

    options.fields = [];
    for(var i = 0 ; i < 3 ; i++) {
        if(i == this.dayIndex) {
            options.fields.push({type: 'integer', typeInvite: this.messages.dayTypeInvite, size: 2, value: this.initDayValue,  trim: true });
        }
        else if(i == this.yearIndex) {
            options.fields.push({type: 'integer', typeInvite: this.messages.yearTypeInvite, size: 4, value: this.initYearValue,  trim: true });
        }
        else {
            options.fields.push({type: 'integer', typeInvite: this.messages.monthTypeInvite, size: 2, value: this.initMonthValue,  trim: true });
        }
    }

   options.separators = options.separators || [false,"&nbsp;","&nbsp;",false];
   
   inputEx.DateSplitField.superclass.constructor.call(this,options);

   this.initAutoTab();
};

Y.extend(inputEx.DateSplitField, inputEx.CombineField, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      inputEx.DateSplitField.superclass.setOptions.call(this, options);

      //I18N
      this.messages = Y.mix(this.messages, Y.Intl.get("inputex-datesplit"));
   },

   /**
    * Set the value. Format the date according to options.dateFormat
    * @method setValue
    * @param {Date} val Date to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      var values = [];
      
      // !value catches "" (empty field), and invalid dates
      if (!value || !lang.isFunction(value.getTime) || !lang.isNumber(value.getTime()) ) {
         values[this.monthIndex] = "";
         values[this.yearIndex] = "";
         values[this.dayIndex] = "";
      } else {
         for(var i = 0 ; i < 3 ; i++) {
            values.push( i === this.dayIndex ?   this.ensureTwoChars(value.getDate()) :
                         i === this.monthIndex ? this.ensureTwoChars(value.getMonth() + 1) :
                                                 value.getFullYear());
         }
      }
      inputEx.DateSplitField.superclass.setValue.call(this, values, sendUpdatedEvt);
   },
   
   /**
    * @method ensureTwoChars
    */
   ensureTwoChars: function (val) {
      
      val = val + ""; // convert into string if not
      
      // prefix with "0" if 1-char string
      if (val.length === 1) {
         val = "0" + val;
      }
      
      return val;
   },
   
   /**
    * @method getValue
    */
   getValue: function () {

      // if all sub-fields are empty (isEmpty method is inherited from inputEx.Group)
      if (this.isEmpty()) { return ""; }
      
      var values = inputEx.DateSplitField.superclass.getValue.call(this);

      var year = values[this.yearIndex]; // from the input field

      if (lang.isNumber(year)) {
         var now_full_year  = (new Date()).getFullYear(), // 2014
            now_short_year = now_full_year % 100, // 14
            now_century    = Math.floor(now_full_year / 100); // 20

         if (year < 100) {
            if (year > now_short_year) {
               year = (now_century - 1) * 100 + year;
            } else {
               year = now_century * 100 + year;
            }
         }
      }

      return new Date(year, values[this.monthIndex]-1, values[this.dayIndex] );
   },
   
   /**
    * @method validate
    */
   validate: function() {
      var subFieldsValidation = inputEx.DateSplitField.superclass.validate.call(this);
      if (!subFieldsValidation) { return false; }
      
      var values = inputEx.DateSplitField.superclass.getValue.call(this);
      var day = values[this.dayIndex];
      var month = values[this.monthIndex];
      var year = values[this.yearIndex];
      
      var val = this.getValue();
      //console.log("datesplit value = ",val);
      
      // 3 empty fields (validate only if field is not required)
      if (val === "") { return !this.options.required; }
      
      // if at least one field is empty, it will be set by default (day : 31, month:12, year: 1899/1900)
      //   -> !== "" MUST be ensured!
      if (day === "" || month === "" || year === "") { return false; }
      
      if (year < 0 || year > 9999 || day < 1 || day > 31 || month < 1 || month > 12) { return false; }
      
      // val == any date -> true
      // val == "Invalid Date" -> false
      return (val != "Invalid Date");
   },
   
   /**
    * @method initAutoTab
    */
   initAutoTab: function() {
      // "keypress" event codes for numeric keys (keyboard & numpad)
      //  (warning : "keydown" codes are different with numpad)
      var numKeyCodes = [48,49,50,51,52,53,54,55,56,57];
      
      // verify charCode (don't auto tab when pressing "tab", "arrow", etc...)
      var checkNumKey = function(charCode) {
         for (var i=0, length=numKeyCodes.length; i < length; i++) {
            if (charCode == numKeyCodes[i]) return true;
         }
         return false;       
      };
      
      // Function that checks charCode and execute tab action
      var that = this;
      var autoTab = function(inputIndex) {
         // later to let input update its value
         lang.later(0, that, function() {
            var input = that.inputs[inputIndex];
            
            // check input.el.value (string) because getValue doesn't work
            // example : if input.el.value == "06", getValue() == 6 (length == 1 instead of 2)
            if (input.el.value.length == input.options.size) {
               that.inputs[inputIndex+1].focus();
            }
         });
      };
      
      // add listeners on inputs
      Y.one(this.inputs[0].el).on("keypress", function(e) {
         if (checkNumKey(e.charCode)) {
            autoTab(0);
         }
      }, this, true);
      Y.one(this.inputs[1].el).on("keypress", function(e) {
         if (checkNumKey(e.charCode)) {
            autoTab(1);
         }
      }, this, true);
   }
   
});

// Register this class as "datesplit" type
inputEx.registerType("datesplit", inputEx.DateSplitField);


}, '@VERSION@', {
    "requires": [
        "inputex-combine",
        "inputex-integer"
    ],
    "ix_provides": "datesplit",
    "lang": [
        "en",
        "fr",
        "de",
        "ca",
        "es",
        "fr",
        "it",
        "nl",
        "pl",
        "pt-BR"
    ]
});
