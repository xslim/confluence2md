var Converter = function() {
}

Converter.prototype.setup = function() {
  var self = this;
  this.input = document.getElementById('input');
  this.output = document.getElementById('output');
  var submit = document.getElementById('submit');
  submit.onclick = function() {
    self.convert(1);
  };
};

Converter.prototype.convert = function(run) {
  var text = this.input.value;
  var replacement;


  text = text.replace(/(\n*){code([\s\S]+?){code}/g, '$1{startcode$2{endcode}');
  text = text.replace(/(\n*){noformat([\s\S]+?){noformat}/g, '$1{startnoformat$2{endnoformat}');

  /* Don't touch stuff inside code areas */
  text = text.replace(/[\[](?=(?:(?!{startcode)[\s\S])*?{endcode})/g, '~~STARTBRACKET~~');
  text = text.replace(/[\]](?=(?:(?!{startcode)[\s\S])*?{endcode})/g, '~~ENDBRACKET~~');
  text = text.replace(/[\\](?=(?:(?!{startcode)[\s\S])*?{endcode})/g, '~~BACKSLASH~~');
  text = text.replace(/[\*](?=(?:(?!{startcode)[\s\S])*?{endcode})/g, '~~STAR~~');

  text = text.replace(/[\[](?=(?:(?!{startnoformat)[\s\S])*?{endnoformat})/g, '~~STARTBRACKET~~');
  text = text.replace(/[\]](?=(?:(?!{startnoformat)[\s\S])*?{endnoformat})/g, '~~ENDBRACKET~~');
  text = text.replace(/[\\](?=(?:(?!{startnoformat)[\s\S])*?{endnoformat})/g, '~~BACKSLASH~~');
  text = text.replace(/[\*](?=(?:(?!{startnoformat)[\s\S])*?{endnoformat})/g, '~~STAR~~');

  /* convert confluence newlines */
  text = text.replace(/\134\134/g, "\n");

  /* remove anchors - mediawiki handles automatically */
  text = text.replace(/{anchor.*}/g, '');

  var codereplace2 = '```$2```\n';
  var codereplace1 = '```$2```\n';

  text = text.replace(/{startcode\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){endcode}/g, codereplace2 );   
  text = text.replace(/{startcode\s*:\s*title=([^}]*)}([\s\S]+?){endcode}/g, codereplace2 );
  text = text.replace(/{startcode\s*:\s*(.*)?}([\s\S]+?){endcode}/g, codereplace1 );       
  text = text.replace(/{startcode(\s*)}([\s\S]+?){endcode}/g, codereplace1 );

  var noformatreplace2 = '<h5 style="text-align:center">$1</h5><hr>\n<pre style="margin-left:20px; border:solid; border-color:#3C78B5; border-width:1px; font-size:1.4em; background-color:#fff">$2</pre>';
  var noformatreplace1 =                                          '\n<pre style="margin-left:20px; border:solid; border-color:#3C78B5; border-width:1px; font-size:1.4em; background-color:#fff">$2</pre>';
  text = text.replace(/{startnoformat\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){endnoformat}/g, noformatreplace2 );   
  text = text.replace(/{startnoformat\s*:\s*title=([^}]*)}([\s\S]+?){endnoformat}/g, noformatreplace2 );
  text = text.replace(/{startnoformat\s*:\s*(.*)?}([\s\S]+?){endnoformat}/g, noformatreplace1 );       
  text = text.replace(/{startnoformat(\s*)}([\s\S]+?){endnoformat}/g, noformatreplace1 );

  var panelreplace2 = '~~TABLESTART~~ cellpadding="10" width="100%" style="margin-left:20px; border:solid; border-color:#55a; border-width:1px; text-align:left; background-color:#f0f0f0;"\n~~ROWSTART~~\n| *$1*<hr>\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';
  var panelreplace1 = '~~TABLESTART~~ cellpadding="10" width="100%" style="margin-left:20px; border:solid; border-color:#55a; border-width:1px; text-align:left; background-color:#f0f0f0;"\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';

  text = text.replace(/{panel\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){panel}/g, panelreplace2 );   
  text = text.replace(/{panel\s*:\s*title=([^}]*)}([\s\S]+?){panel}/g, panelreplace2 );
  text = text.replace(/{panel\s*:\s*(.*)?}([\s\S]+?){panel}/g, panelreplace1 );       
  text = text.replace(/{panel(\s*)}([\s\S]+?){panel}/g, panelreplace1 );

  var tipreplace2 = '~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#ddffdd;"\n~~ROWSTART~~\n| <span style="color:#00AA00">*TIP*:</span> *$1*<hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';
  var tipreplace1 = '~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#ddffdd;"\n~~ROWSTART~~\n| <span style="color:#00AA00">*TIP*</span><hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';

  text = text.replace(/{tip\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){tip}/g, tipreplace2 );   
  text = text.replace(/{tip\s*:\s*title=([^}]*)}([\s\S]+?){tip}/g, tipreplace2 );
  text = text.replace(/{tip\s*:\s*(.*)?}([\s\S]+?){tip}/g, tipreplace1 );       
  text = text.replace(/{tip(\s*)}([\s\S]+?){tip}/g, tipreplace1 );

  var inforeplace2 = '~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#D8E4F1;"\n~~ROWSTART~~\n| <span style="color:#0000AA">*INFO*:</span> *$1*<hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">$2</div>\n~~TABLEEND~~\n<br/>';
  var inforeplace1 = '~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#D8E4F1;"\n~~ROWSTART~~\n| <span style="color:#0000AA">*INFO*</span><hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';

  text = text.replace(/{info\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){info}/g, inforeplace2 );   
  text = text.replace(/{info\s*:\s*title=([^}]*)}([\s\S]+?){info}/g, inforeplace2 );
  text = text.replace(/{info\s*:\s*(.*)?}([\s\S]+?){info}/g, inforeplace1 );       
  text = text.replace(/{info(\s*)}([\s\S]+?){info}/g, inforeplace1 );

  var notereplace2 = '~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#FFFFCE;"\n~~ROWSTART~~\n| <span style="color:#AAAA00">*NOTE*:</span> *$1*<hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">$2</div>\n~~TABLEEND~~\n<br/>';
  var notereplace1 = '~~TABLESTART~~   width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#FFFFCE;"\n~~ROWSTART~~\n| <span style="color:#AAAA00">*NOTE*</span><hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';

  text = text.replace(/{note\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){note}/g, notereplace2 );   
  text = text.replace(/{note\s*:\s*title=([^}]*)}([\s\S]+?){note}/g, notereplace2 );
  text = text.replace(/{note\s*:\s*(.*)?}([\s\S]+?){note}/g, notereplace1 );       
  text = text.replace(/{note(\s*)}([\s\S]+?){note}/g, notereplace1 );
       
  var warningreplace2 = '<!-- warning start -->\n~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#FFCCCC;"\n~~ROWSTART~~\n| <span style="color:#AA0000">*WARNING*:</span> *$1*<hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';
  var warningreplace1 = '<!-- warning start -->\n~~TABLESTART~~ width="100%" style="padding: 20px; margin-left:20px; border:solid; border-color:#aaa; border-width:0px; text-align:left; background-color:#FFCCCC;"\n~~ROWSTART~~\n| <span style="color:#AA0000">*WARNING*</span><hr>\n~~ROWSTART~~\n|\n<div style="white-space: pre">\n$2\n</div>\n~~TABLEEND~~\n<br/>';

  text = text.replace(/{warning\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){warning}/g, warningreplace2 );   
  text = text.replace(/{warning\s*:\s*title=([^}]*)}([\s\S]+?){warning}/g, warningreplace2 );
  text = text.replace(/{warning\s*:\s*(.*)?}([\s\S]+?){warning}/g, warningreplace1 );       
  text = text.replace(/{warning(\s*)}([\s\S]+?){warning}/g, warningreplace1 );
   
  // section   
  var sectionreplace2 = '<!-- section start -->\n~~TABLESTART~~ border=0 width="100%" cellpadding=10 align=top\n~~ROWSTART~~$1\n~~TABLEEND~~<!-- section end-->\n';
  var sectionreplace1 = '<!-- section start -->\n~~TABLESTART~~ border=0 width="100%" cellpadding=10 align=top\n~~ROWSTART~~$1\n~~TABLEEND~~<!-- section end-->\n';
  text = text.replace(/({section}([\s\S]+?)({column}([\s\S]+?){column})*?(.|\n)*?{section})/g, sectionreplace1);
  text = text.replace(/{section}([\s\S]+?){section}/g, '$1');


  // column
  var columnreplace1 = '\n<!-- column start -->\n~~CELLSTART~~$2\n<!-- column end -->\n';
  var columnreplace2 = '\n<!-- column start -->\n~~CELLSTART~~$2\n<!-- column end -->\n';
  text = text.replace(/{column\s*:\s*title=([^|}]*)[|][^}]*}([\s\S]+?){column}/g, columnreplace2 );   
  text = text.replace(/{column\s*:\s*title=([^}]*)}([\s\S]+?){column}/g, columnreplace2 );
  text = text.replace(/{column\s*:\s*(.*)?}([\s\S]+?){column}/g, columnreplace1 );       
  text = text.replace(/{column(\s*)}([\s\S]+?){column}/g, columnreplace1 );


  /* Add newline to EOF to fix issues */
  text = text + "\n";

  /* clean up confluence garbage chars - \\ */
  text = text.replace(/\\\s*\\/g, '<br/>');
  text = text.replace(/\\\\/g, '');
  text = text.replace(/\\\\/g, '');

  /* Replace escaped brackets - \[ */
  text = text.replace(/\\\[/mg, '<nowiki>[</nowiki>');

  /* Replace escape sequences - \ */
  text = text.replace(/\\(\S)/mg, '<nowiki>$1</nowiki>');

  /* Replace thumbnail images */
  text = text.replace(/\n\!([^|]+)[|]\s*thumbnail\s*\!\s*\n/, '\n~~ATTACHED_IMAGE_THUMBNAIL~~$1\n');
  text = text.replace(/\n\!\s*(http[^|]+)?\!\s*\n/, '\n~~REMOTE_IMAGE~~$1\n');
  text = text.replace(/\n\!([^|]+)?\!\s*\n/, '\n~~ATTACHED_IMAGE~~$1\n');

  // detect a table-plus
  text = text.replace(/{table-plus(.*)}\n*((.|\n)*?)\n*{table-plus}/g, '\n~~TABLEPLUS~~\n$2\n');

  /* detect a table-plus with headers */
  text = text.replace(/~~TABLEPLUS~~\n*([|][|].*[|][|])\s*\n((\|.*\n)+)\n/g, '\n<!-- table start -->\n~~TABLESTART~~ border=1  width="100%" cellspacing="0" cellpadding="4" style="border-color:#eee" class="wikitable sortable" \n<!-- header row start -->\n~~HEADERROW~~$1~~HEADEREND~~\n<!-- header row end -->\n$2\n~~TABLEEND~~<!-- table end -->\n\n<br/>\n');

  /* detect a table with headers with split lines within same cell */
  text = text.replace(/([|][|].*[|][|])\s*\n(([|][^|}-][^|]+\n[^|]+?[|]\s*\n)+)/g, '\n<!-- table start -->\n~~TABLESTART~~ border=1  width="100%" cellspacing="0" cellpadding="4" style="border-color:#eee" class="wikitable sortable"\n<!-- header row start -->\n~~HEADERROW~~$1~~HEADEREND~~\n<!-- header row end -->\n$2\n~~TABLEEND~~<!-- table end -->\n\n<br/>\n');

  /* detect a table with headers */
  text = text.replace(/\n([|][|].*[|][|])\s*\n((\|.*\n)+)\n*/g, '\n<!-- table start -->\n~~TABLESTART~~ border=1  width="100%" cellspacing="0" cellpadding="4" style="border-color:#eee" class="wikitable sortable" \n<!-- header row start -->\n~~HEADERROW~~$1~~HEADEREND~~\n<!-- header row end -->\n$2\n~~TABLEEND~~<!-- table end -->\n\n<br/>\n');

  /* Create table elements in header row*/
  text = text.replace(/[|][|]/g, '!!');
    
  /* Clean up beginning of header row */
  text = text.replace(/\n~~HEADERROW~~\!\!/g, '\n~~HEADERROW~~');

  /* Clean up end of header row */
  text = text.replace(/\!\!~~HEADEREND~~\n/g, '~~HEADEREND~~\n');


  text = text.replace(/[|] '''\s*\n/g, '|\n');

  
  // external links
  text = text.replace(/\[(http:\/\/[^\]|]+)\]/g, '[$1 $1]');
  text = text.replace(/\[(https:\/\/[^\]|]+)\]/g, '[$1 $1]');
  text = text.replace(/\[\[(http:\/\/[^\]|]+)\|([^\]|]+)\]\]/g, '[$1 $2]');
  text = text.replace(/\[\[(https:\/\/[^\]|]+)\|([^\]|]+)\]\]/g, '[$1 $2]');
  text = text.replace(/\[([^\n|]+?)[|]\s*(https*)([^\n]+?)\]/g, '~~LINKSTART~~$2$3 $1~~LINKEND~~');

  // internal links
  text = text.replace(/\[([^\n|]+?)[|]([^\n]+?)\]/g, '~~LINKSTART~~$2~~LINKSEPARATOR~~$1~~LINKEND~~');
  text = text.replace(/\[(BeanDev|MODDOCS):(.+?)\]/g, '~~LINKSTART~~$2~~LINKEND~~');
  text = text.replace(/\[([^\]]*)+\]/g, '~~LINKSTART~~$1~~LINKEND~~');

  /* detect regular rows that haven't been detected yet*/
  text = text.replace(/\n(([|][^|\n}-][^|}]*)+)[|]/g, '\n~~ROWSTART~~$1');

  /* Internal links with line break*/
  text = text.replace(/\[([^\]|])?\n([^\]|])?]\n/g, '~~LINKSTART~~$1$2~~LINKEND~~<br>');

  /* Internal links without break */
  text = text.replace(/\[([^\]|]*)?\n([^\]|])?]/g, '~~LINKSTART~~$1$2~~LINKEND~~');


  /* detect cells */
  text = text.replace(/[|]([^|\n}-][^|\n}]*)/g, '\n~~CELLSTART~~$1');
  text = text.replace(/~~CELLSTART~~([^|]*?)[|]/g, '\n~~CELLSTART~~$1');
  text = text.replace(/^[|]-\n[|] '''/g, '|- style="background-color:#f0f0f0;"\n| \'\'\'');

  // formatting
  /*text = text.replace(/\*(?!\*)(.+?)\*(?!\*)/g, "'''$1'''");*/
  text = text.replace(/(\W)\*([^\n*]+?)\*(\W)/g, "$1'''$2'''$3");
  text = text.replace(/(\W)_([\w][^\n]*?[\w])_(\W)/g, "$1''$2''$3");
  
  // headings
  text = text.replace(/^h1\. (.+)$/mg, '# $1');
  text = text.replace(/^h2\. (.+)$/mg, '## $1');
  text = text.replace(/^h3\. (.+)$/mg, '### $1');
  text = text.replace(/^h4\. (.+)$/mg, '#### $1');
  text = text.replace(/^h5\. (.+)$/mg, '##### $1');
  text = text.replace(/^h6\. (.+)$/mg, '###### $1');

  /* cleanup */
  text = text.replace(/~~LINKSEPARATOR~~/g, '|');
  text = text.replace(/~~STARTBRACKET~~/g, '[');
  text = text.replace(/~~LINKSTART~~/g, '[[');
  text = text.replace(/~~ENDBRACKET~~/g, ']');
  text = text.replace(/~~LINKEND~~/g, ']]');
  text = text.replace(/~~BACKSLASH~~/g, '\\');
  text = text.replace(/~~TABLESTART~~/g, '{|');
  text = text.replace(/~~TABLEEND~~/g, '|}');
  text = text.replace(/~~TABLEPLUS~~/g, '');
  text = text.replace(/~~HEADERROW~~/g, '!');
  text = text.replace(/~~HEADEREND~~/g, '');
  text = text.replace(/~~ROWSTART~~/g, '|-');
  text = text.replace(/\n+~~CELLSTART~~/g, '\n| ');
  text = text.replace(/~~STAR~~/g, '*');

  /* clean up multiple newlines */
  text = text.replace(/\n+[|][}]/g, '\n|}');
  text = text.replace(/\n+[|][-]\n+[|]/g, '\n|-\n|');
  text = text.replace(/\n[|][-]\n[|][-]\n/g, '\n|-\n');
  text = text.replace(/[\n\s]+[{][|]/g, '\n{|');
  text = text.replace(/[\n\s]+[!]([^!])/g, '\n!$1');
  /*text = text.replace(/\n[|]\n+[|]([^}-])/g, '\n|$1');*/           

  text = text.replace(/{{([\s\S]+?)}}/g, '`$1`');

  this.output.value = text;
};

window.onload = function() {
  window.converter = new Converter();
  window.converter.setup();
};

