#!/bin/sh
#
#  - Concatenate all js files into build/inputex.js
#  - minify it using YUI compressor to build/inputex-min.js
#  - minify the CSS file to build/inputex-min.css

# Remove previous files
rm -f inputex.js inputex-min.js inputex-min.css

# Concatenate all the js files
cat ../license.txt ../js/inputex.js ../js/Visus.js ../js/json-schema.js ../js/Field.js ../js/Group.js ../js/Form.js ../js/fields/CombineField.js ../js/fields/StringField.js ../js/fields/AutoComplete.js ../js/fields/CheckBox.js ../js/fields/ColorField.js ../js/fields/DateField.js ../js/fields/DateSplitField.js ../js/fields/DatePickerField.js ../js/fields/EmailField.js ../js/fields/HiddenField.js ../js/fields/InPlaceEdit.js ../js/fields/IntegerField.js ../js/fields/ListField.js ../js/fields/NumberField.js ../js/fields/PairField.js ../js/fields/PasswordField.js ../js/fields/RadioField.js ../js/fields/RTEField.js ../js/fields/SelectField.js ../js/fields/Textarea.js ../js/fields/TimeField.js ../js/fields/DateTimeField.js ../js/fields/UneditableField.js ../js/fields/UrlField.js ../js/widgets/ddlist.js ../js/fields/MultiSelectField.js ../js/fields/AutoComplete.js ../js/fields/MultiAutoComplete.js ../js/fields/UneditableField.js ../js/fields/SliderField.js > inputex.js

# Minify using yui compressor
java -jar tools/yuicompressor-2.3.6.jar inputex.js -o inputex-temp-min.js --charset utf8

# Minify CSS using yui compressor
java -jar tools/yuicompressor-2.3.6.jar ../css/inputEx.css -o inputex-temp-min.css --charset utf8

# Add the license
cat ../license.txt inputex-temp-min.js > inputex-min.js
rm -f inputex-temp-min.js

cat ../license.txt inputex-temp-min.css > inputex-min.css
rm -f inputex-temp-min.css