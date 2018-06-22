![](http://yuilibrary.com/img/yui-logo.png) inputEx
===================================================

Developer's Guide
-----------------

inputEx is a library, so it is meant to be used by developers. Here are
some of the prerequisites before starting to use the library :

-   You should be able to serve the files locally (setup a local HTTP
    server or embed into your application)
-   Have a good knowledge of Javascript
-   Have a good knowledge of the [YUI library](http://yuilibrary.com/)
-   It is strongly recommanded to have Node.js installed

### Install tooling

Install all the dev dependencies with npm :
```bash
npm install -g
```

### Building components

We use [shifter](http://yui.github.io/shifter/) to build inputEx's
modules.

You will need to install shifter if it's not already done.

To build the 'container' module :

```bash
cd src/container
shifter
```

To build all modules at once :

```bash
cd src/container
shifter --watch
```

### Building user guides and examples pages

We are using [selleck](http://rgrove.github.com/selleck/) to build the
examples and user guide pages.

To build all docs :

```bash
selleck --out docs
```

### Building the API documentation

The API documentation is build using
[YUIDocJS](https://github.com/yui/yuidoc).


From the main directory, type :

```bash
$ yuidoc src
```

It should generate the doc in the api/ folder.

### How to run the tests

Tests are executed with [Yogi](https://github.com/yui/yogi) on the continious integration servers of [Travis](https://travis-ci.org).

To launch all test, from the main directory, type :

```bash
grunt test
```

In order to test with coverage you will need to run yeti and istanbul by hand (for the moment):

```bash
mkdir coverage-result
yeti src/*/tests/unit/*.html --server --query 'filter=coverage' --coverage-dump coverage-result
# Target a browser to the yeti server
istanbul report --root coverage-results
```


Translations
------------

The translations are managed on LocaleApp: https://www.localeapp.com/projects/8788

To pull the new translations, you'll get to be registered as 'Developer' in the inputex project on localeapp and the look in the settings section for the API key.

Then install https://github.com/neyric/node-yui-localeapp :

    sudo npm install -g git://github.com/neyric/node-yui-localeapp

`cd` into the inputex root directory.

You can now run the "localeapp-to-project" command with your PROJET_API_KEY as an argument.

Rebuild modules. You're done!


Release
-------

Merge every change into gh-pages.

Use [Jekyll](https://help.github.com/articles/using-jekyll-with-pages/) to test and publish the site.
