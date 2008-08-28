(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options No added options
 */
inputEx.DateTimeField = function(options) {
   options.fields = [
      {type: 'date', inputParams: {}},
      {type: 'time', inputParams: {}}
   ];
   options.separators = options.separators || [false, "&nbsp;&nbsp;", false];
   inputEx.DateTimeField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.DateTimeField, inputEx.CombineField, 
/**
 * @scope inputEx.DateTimeField.prototype   
 */
{   
   /**
    * Concat the values to return a date
    * @return {Date} The javascript Date object
    */
   getValue: function() {
      var d = this.inputs[0].getValue();
      if( d == '' ) return null;
      var a = this.inputs[1].getValue().split(':');
      
      d.setHours(a[0]);
      d.setMinutes(a[1]);
      d.setSeconds(a[2]);
      
      return d;
   },

   /**
    * Set the value of both subfields
    * @param {Date} val Date to set
    */
   setValue: function(val) {
      this.inputs[0].setValue(val);
      this.inputs[1].setValue( ([val.getHours(), val.getMinutes(), val.getSeconds()]).join(':') );
   }

});



/**
 * Register this class as "time" type
 */
inputEx.registerType("datetime", inputEx.DateTimeField);

})();