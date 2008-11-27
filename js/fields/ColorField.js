(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class Create a Color picker input field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options for ColorField :
 * <ul>
 *   <li>auto: default color grid to be used</li>
 *   <li>colors: list of colors to choose from</li>
 * </ul>
 */
inputEx.ColorField = function(options) {
	inputEx.ColorField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.ColorField, inputEx.Field, 
/**
 * @scope inputEx.ColorField.prototype   
 */
{
   
	/**
	 * Adds the 'inputEx-ColorField' default className
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
   setOptions: function(options) {
   	inputEx.ColorField.superclass.setOptions.call(this, options);
   	
   	// Overwrite options
   	this.options.className = options.className ? options.className : 'inputEx-Field inputEx-ColorField inputEx-PickerField';
   	
   	// Added options
   	this.options.auto = options.auto;
   	this.options.colors = options.colors;
   },
   
	/**
	 * Render the color button and the colorpicker popup
	 */
	renderComponent: function() {
	   
	   // A hidden input field to store the color code 
	   this.el = inputEx.cn('input', {
	      type: 'hidden', 
	      name: this.options.name || '', 
	      value: this.options.value || '#DD7870' });
	   	   
	   // Create a colored area
	   this.colorEl = inputEx.cn('div', {className: 'inputEx-ColorField-button'}, {backgroundColor: this.el.value});
	
      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-PickerField-wrapper'});
	   this.wrapEl.appendChild(this.el);
	   this.wrapEl.appendChild(this.colorEl);

	   // Create overlay
      this.oOverlay = new YAHOO.widget.Overlay(Dom.generateId(), { visible: false });
      this.oOverlay.setBody(" ");
      this.oOverlay.body.id = Dom.generateId();
      
      // Create button
      this.button = new YAHOO.widget.Button({ type: "menu", menu: this.oOverlay, label: "&nbsp;&nbsp;&nbsp;&nbsp;" });       
      this.button.appendTo(this.wrapEl);
            
      // Render the overlay
      this.oOverlay.render(this.wrapEl);
      // HACK: Set position absolute to the overlay
      Dom.setStyle(this.oOverlay.body.parentNode, "position", "absolute");
      
      // toggle Menu when clicking on colorEl
      Event.addListener(this.colorEl,'mousedown',function(e){
         
         if (!this.oOverlay.cfg.getProperty("visible")) {
            
            // Stop event to prevent following "click" event to hide the menu !
            Event.stopEvent(e); 
            
            // palette may not have been rendered yet
            this.renderPalette();
            
            // Show menu
            this.button._showMenu();
         }
      },this,true);
      
      
      // Lazy load palette
      //   -> "mousedown" and not "click" because sometimes "click" is not fired !
      this.button.on('mousedown', this.renderPalette, this, true);

	   // Elements are bound to divEl
      this.fieldContainer.appendChild(this.wrapEl);
	},
	
	renderPalette: function() {
      
      // render once !
      if (this.paletteRendered) return;

      // set default color grid to be used
      var defaultGrid = this.options.auto || 1;

      // set colors available
      this.colors = this.options.colors || this.setDefaultColors(defaultGrid);
      this.length = this.colors.length;

      // set PopUp size ratio (default 16/9 ratio)
      this.ratio = this.options.ratio || [16,9];

      // set color grid dimensions
      this.cellPerLine = this.options.cellPerLine || Math.ceil(Math.sqrt(this.length*this.ratio[0]/this.ratio[1]));
      this.cellPerColumn = Math.ceil(this.length/this.cellPerLine);
      this.overlayPadding = this.options.overlayPadding || 7;

      // set cell dimensions
      this.cellWidth = this.options.cellWidth || 17;
      this.cellHeight = this.options.cellHeight || 17;
      this.cellMargin = this.options.cellMargin || 4;

      // Render the color grid
      var overlayBody = document.getElementById(this.oOverlay.body.id);
      var colorGrid = this.renderColorGrid();
      overlayBody.appendChild(colorGrid);

      // Set overlay dimensions
      var width = (this.cellWidth + 2*this.cellMargin) * this.cellPerLine + (YAHOO.env.ua.ie == 6 ? 3*this.overlayPadding : 0);
      var height = (this.cellHeight + 2*this.cellMargin) * this.cellPerColumn + (YAHOO.env.ua.ie == 6 ? 3*this.overlayPadding : 0);

      Dom.setStyle(overlayBody, "width", width+"px");
      Dom.setStyle(overlayBody, "height", height+"px");
      Dom.setStyle(overlayBody, "padding", this.overlayPadding+"px");

      // Unsubscribe the event so this function is called only once
      this.button.unsubscribe("mousedown", this.renderPalette); 

      this.paletteRendered = true;
	},
	
	/**
	 * Set the colors to set in the picker 
	 * @param {int} index Index of the palette to use
	 * @return {Array} List of colors to choose from
	 */
	setDefaultColors: function(index) {
		return inputEx.ColorField.palettes[index-1];
	},
	      
	/**
	 * This creates a color grid
	 */
	renderColorGrid: function() {
	   var grid = inputEx.cn('div');
	   for(var i = 0 ; i < this.length ; i++) {
	      var square = inputEx.cn('div', {className: 'inputEx-ColorField-square'},{backgroundColor: '#'+this.colors[i], width:this.cellWidth+"px", height:this.cellHeight+"px", margin:this.cellMargin+"px" });
	   	Event.addListener(square, "mousedown", this.onColorClick, this, true );
	   	grid.appendChild(square);
      }
	   return grid;
	},
	   
	/**
	 * Handle a color selection
	 * @param {Event} e The original click event
	 */
	onColorClick: function(e) {
	   
		var square = Event.getTarget(e);
		
		// Stop the event to prevent a selection
		Event.stopEvent(e);
	   		   	
	   // Overlay closure
      this.oOverlay.hide();
       
	   // SetValue
		var color = Dom.getStyle(square,'background-color');
		var hexaColor = inputEx.ColorField.ensureHexa(color);
	   this.setValue(hexaColor);
	},
	
	/**
	 * Set the value
	 * @param {String} value Color to set
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(value, sendUpdatedEvt) {
	   this.el.value = value;
	   Dom.setStyle(this.colorEl, 'background-color', this.el.value);

		// Call Field.setValue to set class and fire updated event
		inputEx.ColorField.superclass.setValue.call(this,value, sendUpdatedEvt);
	},
	   
	/**
	 * Return the color value
	 * @return {String} Color value
	 */
	getValue: function() {
	   return this.el.value;
	},
	
	/**
	 * Call overlay when field is removed
	 */
	close: function() {
	  this.oOverlay.hide();
	}
	  
}); 
	
// Specific message for the container
inputEx.messages.selectColor = "Select a color :";
	
/**
 * Default palettes
 */
inputEx.ColorField.palettes = [
   ["FFEA99","FFFF66","FFCC99","FFCAB2","FF99AD","FFD6FF","FF6666","E8EEF7","ADC2FF","ADADFF","CCFFFF","D6EAAD","B5EDBC","CCFF99"],
   ["55AAFF","FFAAFF","FF7FAA","FF0202","FFD42A","F9F93B","DF8181","FEE3E2","D47FFF","2AD4FF","2AFFFF","AAFFD4"],
   ["000000","993300","333300","003300","003366","000080","333399","333333","800000","FF6600","808000","008000","008080","0000FF","666699","808080","FF0000","FF9900","99CC00","339966","33CCCC","3366FF","800080","969696","FF00FF","FFCC00","FFFF00","00FF00","00FFFF","00CCFF","993366","C0C0C0","FF99CC","FFCC99","FFFF99","CCFFCC","CCFFFF","99CCFF","CC99FF","F0F0F0"]
];	

//  -> ensure color has hexadecimal format like "#FF8E00"
inputEx.ColorField.ensureHexa = function (color) {
   var rgb, hexaColor;
   
   // remove spaces
   color = color.replace(/\s/g, "");
   
   // Firefox, Safari
   //   -> format "rgb(255,143,28)"
   if (!!color.match(/^rgb\((?:\d{1,3},){2}\d{1,3}\)$/)) {
      
	   // Convert integer (int or string) to hexadecimal (2 chars)
	   //   ex: "214" -> "d6"
      var DecToHex = function(dec) {
         var r = parseInt(dec,10).toString(16);
         if (r.length == 1) r = "0"+r;
         return r;
      };
   
      rgb = color.split(/([(,)])/);
      hexaColor = '#'+DecToHex(rgb[2])+DecToHex(rgb[4])+DecToHex(rgb[6]);
   
   // IE, Opera
   //   -> format "#FE6D34"
   } else if (!!color.match(/^#[\da-fA-F]{6}$/)) {
      hexaColor = color;
      
   } else {
      // defaults to white if invalid color
      hexaColor = "#FFFFFF";
   }
   
   return hexaColor;
};

/**
 * Register this class as "color" type
 */
inputEx.registerType("color", inputEx.ColorField);
	
})();