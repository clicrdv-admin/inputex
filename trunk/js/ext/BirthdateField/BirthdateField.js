(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;

/**
 * @class A field to enter a date with 2 strings and a select
 * @extends inputEx.CombineField
 */
inputEx.BirthdateField = function(options) {
   	
   if(!options.dateFormat) {options.dateFormat = inputEx.messages.defaultDateFormat; }
   
   var formatSplit = options.dateFormat.split("/");
   this.yearIndex = inputEx.indexOf('Y',formatSplit);
   this.monthIndex = inputEx.indexOf('m',formatSplit);
   this.dayIndex = inputEx.indexOf('d',formatSplit);
   
   options.fields = [];
   for(var i = 0 ; i < 3 ; i++) {
      if(i == this.dayIndex) {
         options.fields.push({type: 'string', inputParams: { typeInvite: inputEx.messages.dayTypeInvite, size: 2} });
      }
      else if(i == this.yearIndex) {
         options.fields.push({type: 'string', inputParams: { typeInvite: inputEx.messages.yearTypeInvite, size: 4} });
      }
      else {
         options.fields.push({type: 'select', inputParams: {selectOptions: ([inputEx.messages.selectMonth]).concat(inputEx.messages.months), selectValues: [-1,0,1,2,3,4,5,6,7,8,9,10,11], value: -1} });
      }
   }

   options.separators = options.separators || [false,"&nbsp;","&nbsp;",false];
   
	inputEx.BirthdateField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.BirthdateField, inputEx.CombineField, {
   
   setValue: function(value, sendUpdatedEvt) {
      
      var values = [];
      
      // !value catches "" (empty field), and invalid dates
      if(!value || !lang.isFunction(value.getTime) || !lang.isNumber(value.getTime()) ) {
         values[this.monthIndex] = -1;
         values[this.yearIndex] = "";
         values[this.dayIndex] = "";
      } else {
         for(var i = 0 ; i < 3 ; i++) {
            values.push( i == this.dayIndex ? value.getDate() : (i==this.yearIndex ? value.getFullYear() : value.getMonth() ) );
         }
      }
      inputEx.BirthdateField.superclass.setValue.call(this, values, sendUpdatedEvt);
   },
   
   getValue: function() {
      if (this.isEmpty()) return "";
      
      var values = inputEx.BirthdateField.superclass.getValue.call(this);
      
      // if selected month index is -1, new Date(..) would create a valid date with month == December !!!)
      if (values[this.monthIndex] == -1) {
         return new Date(NaN,NaN,NaN); // "Invalid Date" 
      }
      
      return new Date(parseInt(values[this.yearIndex],10), values[this.monthIndex], parseInt(values[this.dayIndex],10) );
   },
   
   validate: function() {
      var values = inputEx.BirthdateField.superclass.getValue.call(this);
      var val = this.getValue();
      
      // val == "" -> true
      // val == any date -> true
      // val == "Invalid Date" -> false
      return (val != "Invalid Date");
   },
   
	isEmpty: function() {
	   var values = inputEx.BirthdateField.superclass.getValue.call(this);
	   return (values[this.monthIndex] == -1 && values[this.yearIndex] == "" &&  values[this.dayIndex] == "");
	}
   
});

inputEx.messages.selectMonth = "- Select Month -";
inputEx.messages.dayTypeInvite = "Day";
inputEx.messages.yearTypeInvite = "Year";

/**
* Register this class as "birthdate" type
*/
inputEx.registerType("birthdate", inputEx.BirthdateField);

})();