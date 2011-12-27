YUI().use('node-base', 'escape', function (Y) {

   Y.on("domready",function() {
      Y.all('.exampleDiv').each(function (node) {
         var source = Y.one('#'+node.get('id')+'-source').getContent();

         source = Y.Escape.html(source);

         // Fix indentation
         source = source.replace(/\t/mg, '   ');
         var indentSize = (/^([ \t]*)\S/m).exec(source);
         if (indentSize !== null) {
            source = source.replace(new RegExp ('^'+indentSize[1], 'gm'), '');
         }

         Y.Node.create('<pre class="brush:js"></pre>').setContent(source).appendTo(node.one('.codeContainer'));
      });

      SyntaxHighlighter.highlight();
   });

});

YUI_config.groups.inputex.base = '../src/';
YUI_config.filter = 'raw';
