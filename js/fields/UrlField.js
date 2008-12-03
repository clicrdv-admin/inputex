(function () {
    if (typeof(YUI) === 'undefined') { alert('Error! YUI3 library is not available') }

    YUI.add('urlfield', function(Y) {
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
        var UrlField = function(cfg) {
            UrlField.superclass.constructor.apply(this, arguments);
        };

        UrlField.NAME = "urlfield";
        UrlField.ATTRS = {
            favicon:{
                /* set:function(v) {
                 return Y.Lang.isUndefined(v) ? (("https:" == document.location.protocol) ? false : true) : v;
                 },*/
                value:true
            },
            className:{
                value:'inputEx-Field inputEx-UrlField'//,writeOnce:true
            },
            validator:{
                value:[{regexp:Y.inputEx.regexps.url}]//TODO add message ?
            },
            messages:{
                value:{invalid:'invalid URL'}
            }

        };

        Y.extend(UrlField, Y.inputEx.StringField, {
            _faviconEl:null,//favicon img el
            _faviconTimer:null,

            initializer : function(cfg) {
                this.on('field:change', this.updateFavicon, this)
                Y.log(this + '.initializer() - UrlField - initialized', 'debug', 'inputEx');
            },

            /**
             * Adds a img tag before the field to display the favicon
             */
            render:function() {
                UrlField.superclass.render.call(this, arguments);

                if (this.get('el').get('size') < 27)
                    this.get('el').set('size', 27); //TODO why set to 27

                if (this.get('favicon')) {
                    this._faviconEl = Y.Node.create('<img src="' + Y.inputEx.spacerUrl + '" width="16" height="16"/>')

                    // focus field when clicking on favicon
                    this._faviconEl.on('click', this.focus, this)

                    // Create the favicon image tag
                    this._fieldEl.insertBefore(this._faviconEl, this._fieldEl.get('firstChild'));

                    this.get('el').removeClass('nofavicon'); //for use when favicon attribute is dynamically changed

                    this.updateFavicon();
                } else {
                    this._inputEl.addClass('nofavicon');
                }
            },

            updateFavicon: function() {
                if (!this.get('favicon') || !this._faviconEl) { return; }

                var url = this.getField().get('value')
                var faviconUrl = (this._validated)? url.match(/https?:\/\/[^\/]*/)+'/favicon.ico' : Y.inputEx.spacerUrl

                //Y.log(this + '.updateFavicon() - UrlField - _validated: ' + this._validated + ', url: ' + url + ', ', 'debug', 'inputEx')
                if (this._validated && faviconUrl != this._faviconEl.get('src')) {

                    // Hide the favicon
                    this._faviconEl.setStyle('visibility', 'hidden')

                    // Change the src
                    this._faviconEl.set('src', faviconUrl);

                    // Set the timer to launch displayFavicon in 1s
                    if (this._faviconTimer) { clearTimeout(this._faviconTimer); }
                    this._faviconTimer = Y.later(1000, this, this.displayFavicon)
                    Y.log(this + '.updateFavicon() - updated favicon', 'debug', 'inputEx');
                }
            },

            /**
             * Display the favicon if the icon was found (use of the naturalWidth property)
             */
            displayFavicon: function() {
                Y.log(this + '.displayFavicon() - UrlField', 'debug', 'inputEx')
                this._faviconEl.setStyle('visibility', (this._faviconEl.get('naturalWidth') != 0) ? 'visible' : 'hidden');
            }

        });

        Y.namespace('inputEx');
        Y.inputEx.UrlField = UrlField;

        Y.inputEx.registerType("url", UrlField);

    }, '3.0.0pr1', {requires:['stringfield']});

})();


/*
 inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";
 */
