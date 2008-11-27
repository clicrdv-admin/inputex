(function() {
   var inputEx = YAHOO.inputEx;
/**
 * WARNING: the json-schema methods are EXPERIMENTAL.
 *
 * Conversion between inputEx json format and JSON Schema
 * based on "Json Schema Proposal Second Draft":
 * http://groups.google.com/group/json-schema/web/json-schema-proposal---second-draft
 *
 * The proposal is still under discussion and the implementation is very minimalist.
 *
 *
 * TODO:
 *    - we should provide a lot of json schema examples and instances that should/should not validate
 *    - use the $ref (async calls => provide callbacks to methods)
 *
 * Limitations:
 *    - ??? Please do not trust inputEx: the getValue may return a value which do NOT validate the schema (provide an example ?)
 *    - no tuple typing for arrays
 *    - no "Union type definition"
 *
 */
inputEx.JsonSchema = {
   
   /**
    * Convert a json schema to a inputEx group object config
    *
    * @param {Object} jsonSchema The evaled JSON schema
    * @param {String} groupName optional, used for the "object" json schema type
    */
   schemaToInputEx: function(p, propertyName) {
      
      var fieldDef = {inputParams: { label: propertyName, name: propertyName} };
      if(p.type) {
         
         var type = p.type;
         
         // If type is a "Union type definition", we'll use the first type for the field
         // "array" <=>  [] <=> ["any"]
         if(YAHOO.lang.isArray(type)) {
            if(type.length == 0 || (type.length == 1 && type[0] == "any") ) {
               type = "array";
            }
            else {
               type = type[0];
            }
         }
         else if(YAHOO.lang.isObject(type) ) {
            // What do we do ??
            //console.log("type is an object !!");
         }
         
         fieldDef.type = type;
      
         if(type == "array" ) {
            fieldDef.type = "list";
         }
         else if(type == "object" ) {
            fieldDef.type = "group";
            //fieldDef.inputParams = this.schemaToInputEx(p, propertyName);
            //fieldDef.inputParams = this._parseSchemaProperty(p, propertyName);
            var groupDef = { fields: [] };

            if(propertyName) groupDef.name = propertyName;

            for(var key in p.properties) {
               if(p.properties.hasOwnProperty(key)) {
                  groupDef.fields.push( this.schemaToInputEx(p.properties[key], key) );
               }
            }

            fieldDef.inputParams = groupDef;
            
         }
         else if(type == "string" && (!!p.options) ) {
            fieldDef.type = "select";
            fieldDef.inputParams.selectOptions = [];
            fieldDef.inputParams.selectValues = [];
            for(var i = 0 ; i < p.options.length ; i++) {
               var o = p.options[i];
               fieldDef.inputParams.selectOptions.push(o.label);
               fieldDef.inputParams.selectValues.push(o.value);
            }
         }
         else if(type == "string") {
            if( p.format ) {
               if(p.format == "html") {
                  fieldDef.type = "html";
               }
               else if(p.format == "date") {
                  fieldDef.type = "date";
                  fieldDef.inputParams.tooltipIcon = true;
               }
            }
         }
      }
      else if(p["$ref"]){
         throw new Error("$ref not implemented yet...");
      }
      
      return fieldDef;
   },
   
   
   /**
    * Create an inputEx Json form definition from a json schema instance object
    * Respect the "Self-Defined Schema Convention"
    */
   formFromInstance: function(instanceObject) {
      
      if(!instanceObject || !instanceObject["$schema"]) {
         throw new Error("Invalid json schema instance object. Object must have a '$schema' property.");
      }
      
      var formDef = YAHOO.inputEx.JsonSchema.schemaToInputEx(instanceObject["$schema"]);
      
      // Set the default value of each property to the instance value
      for(var i = 0 ; i < formDef.fields.length ; i++) {
         var fieldName = formDef.fields[i].inputParams.name;
         formDef.fields[i].inputParams.value = instanceObject[fieldName];
      }
      
      return formDef;
   },
   
   inputExToSchema: function(inputExJson) {
      
   }

};


})();