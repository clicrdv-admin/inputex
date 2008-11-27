(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class Create a select field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>selectValues: contains the list of options values</li>
 *	   <li>selectOptions: list of option element texts</li>
 *    <li>multiple: boolean to allow multiple selections</li>
 * </ul>
 */
inputEx.SelectField = function(options) {
	inputEx.SelectField.superclass.constructor.call(this,options);
 };
lang.extend(inputEx.SelectField, inputEx.Field, 
/**
 * @scope inputEx.SelectField.prototype   
 */   
{
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
	setOptions: function(options) {
	   inputEx.SelectField.superclass.setOptions.call(this,options);
	   
	   this.options.multiple = lang.isUndefined(options.multiple) ? false : options.multiple;
	   this.options.selectValues = options.selectValues;
	   this.options.selectOptions = options.selectOptions;
   },
   
   /**
    * Build a select tag with options
    */
   renderComponent: function() {

      this.el = inputEx.cn('select', {id: this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId(), name: this.options.name || ''});
      
      if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
      
      this.optionEls = [];
      for( var i = 0 ; i < this.options.selectValues.length ; i++) {
         // ""+  hack to convert into text (values may be 0 for example)
         this.optionEls[i] = inputEx.cn('option', {value: this.options.selectValues[i]}, null, ""+((this.options.selectOptions && !lang.isUndefined(this.options.selectOptions[i])) ? this.options.selectOptions[i] : this.options.selectValues[i]));
         this.el.appendChild(this.optionEls[i]);
      }
      this.fieldContainer.appendChild(this.el);
   },  
   
   /**
    * Register the "change" event
    */
   initEvents: function() {
      Event.addListener(this.el,"change", this.onChange, this, true);
	   Event.addFocusListener(this.el, this.onFocus, this, true);
	   Event.addBlurListener(this.el, this.onBlur, this, true);
   },
   
   /**
    * Set the value
    * @param {String} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      var index = 0;
      var option;
      for(var i = 0 ; i < this.options.selectValues.length ; i++) {
         if(value === this.options.selectValues[i]) {
            option = this.el.childNodes[i];
		      option.selected = "selected";
         }
      }
      
		// Call Field.setValue to set class and fire updated event
		inputEx.SelectField.superclass.setValue.call(this,value, sendUpdatedEvt);
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.options.selectValues[this.el.selectedIndex];
   },
   
   /**
    * Disable the field
    */
   disable: function() {
      this.el.disabled = true;
   },

   /**
    * Enable the field
    */
   enable: function() {
      this.el.disabled = false;
   }
   
});

/**
 * Register this class as "select" type
 */
inputEx.registerType("select", inputEx.SelectField);

})();