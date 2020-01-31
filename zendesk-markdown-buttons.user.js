// ==UserScript==
// @name         Zendesk Markdown Buttons
// @namespace    http://tampermonkey.net/
// @version      0.99 rev 2711
// @description  Adds some markdown buttons at the top of the editing field
// @author       Senff
// @updateURL    https://github.com/senff/Zendesk-markdown-buttons/raw/master/zendesk-markdown-buttons.user.js
// @match        https://woothemes.zendesk.com/agent/*
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

// Add buttons to editor
function addMarkdownButtons() {
    if(!$('#markdown-button-styles').length) {
        $('body').append('<style type="text/css" id="markdown-button-styles">.markdown-buttons-row button {border: solid 1px #c0c0c0; line-height: 22px; height: 32px; background:#e0e0e0; text-align: center; margin: 0 0 5px 0; cursor: pointer; font-size: 14px; padding: 5px 10px; }.markdown-buttons-row .button-left{border-right:0;border-top-left-radius:3px; border-bottom-left-radius:3px;}.markdown-buttons-row .button-middle{border-right:0;}.markdown-buttons-row .button-right{border-top-right-radius:3px; border-bottom-right-radius:3px;}.button-group{margin-right: 10px; float: left;}</style>');
    }

    $('.comment_input textarea').each(function(ind) {
        var tID = $(this).attr('id');
        if (!$(this).hasClass('buttons-added')) {
            $(this).parent().parent().parent().find('.markdown-buttons-row').remove();
            $(this).parent().parent().parent().find('.hint').after('<div class="markdown-buttons-row" style="padding:10px 0 0 0;margin-bottom: -5px; font-size: 12px; overflow: hidden;"><div class="button-group"><button data-style="bold" data-id="'+tID+'" class="markdown-bold button-left" style="font-weight:bold;">B</button><button data-style="italic" data-id="'+tID+'" class="markdown-italic button-middle" style="font-style:italic;">I</button><button data-style="link" data-id="'+tID+'" class="markdown-link button-right" style="text-decoration: underline;">LINK</button></div><div class="button-group"><button data-style="h1" data-id="'+tID+'" class="markdown-h1 button-left" style="font-size: 20px;">H1</button><button data-style="h2" data-id="'+tID+'" class="markdown-h2 button-middle" style="font-size: 16px;">H2</button><button data-style="h3" data-id="'+tID+'" class="markdown-h3 button-right" style="font-size: 12px;">H3</button></div><div class="button-group"><button data-style="line" data-id="'+tID+'" class="markdown-line button-left">---</button><button data-style="inlinecode" data-id="'+tID+'" class="markdown-inlinecode button-middle" style="font-size: 12px; font-family: Consolas, Liberation Mono, Menlo, Bitstream Vera Sans Mono, Courier, monospace;">inline code</button><button data-style="codeblock" data-id="'+tID+'" class="markdown-codeblock button-right" style="font-size: 12px; font-family: Consolas, Liberation Mono, Menlo, Bitstream Vera Sans Mono, Courier, monospace;">CODE BLOCK</button></div></div>');
            $(this).addClass('buttons-added');
        }
    });
}

// We'll work on this later, when things (including me) are in better shape
function undoContents(id) {
    var oldContent = localStorage.getItem("previouscontents-"+id);
    var $editorBox = $('#'+id);
    $editorBox.val(oldContent);
}

// Functions to actually factually literally add markup to editor
function addStyle(style,id) {
    var styleBefore = '';
    var styleAfter = '';
    var $editorBox = $('#'+id);
    var editorContents = $editorBox.val();
    localStorage.setItem("previouscontents-"+id, editorContents);
    var editor = document.getElementById(id);
    var selectionStart = 0, selectionEnd = 0;
    if (editor.selectionStart) selectionStart = editor.selectionStart;
    if (editor.selectionEnd) selectionEnd = editor.selectionEnd;
    var posAdd = 0;
    var posEnd = 0;

    if ((selectionStart == selectionEnd) && (style=='link')) {
        alert('Highlight the text that you want to make a link');
    } else {
        if(style=='bold') {
            styleBefore = '**';
            styleAfter = '**';
            posAdd = 2;
        }
        if(style=='italic') {
            styleBefore = '_';
            styleAfter = '_';
            posAdd = 1;
        }
        if(style=='link') {
            var url = prompt("Enter URL", "https://");
            if (url.startsWith("http://") || url.startsWith("https://")) {
                styleBefore = '**[';
                styleAfter = ']('+url+')**';
                posAdd = 2;
                posEnd = url.length+6;
            }
        }
        if(style=='h1') {
            styleBefore = '\n# ';
            styleAfter = '\n';
            posAdd = 3;
        }
        if(style=='h2') {
            styleBefore = '\n## ';
            styleAfter = '\n';
             posAdd = 4;
        }
        if(style=='h3') {
            styleBefore = '\n### ';
            styleAfter = '\n';
            posAdd = 5;
        }
        if(style=='inlinecode') {
            styleBefore = '`';
            styleAfter = '`';
            posAdd = 1;
        }
        if(style=='codeblock') {
            styleBefore = '\n\n```\n';
            styleAfter = '\n```\n\n';
            posAdd = 6;
        }
        if(style=='line') {
            styleBefore = '\n\n---\n';
            styleAfter = '';
            posAdd = 5;
        }
        var editorCharArray = editorContents.split("");
        editorCharArray.splice(selectionEnd, 0, styleAfter); //must do End first
        editorCharArray.splice(selectionStart, 0, styleBefore);
        editorContents = editorCharArray.join("");
        $editorBox.val(editorContents);
    }
    $editorBox.trigger('click');
    $editorBox.keyup();
    if (posEnd == 0) {
        $editorBox.selectRange(selectionStart+posAdd, selectionEnd+posAdd);
    } else {
        $editorBox.selectRange(selectionStart+posAdd, selectionEnd+posEnd);
    }
}

// Select text that was originally selected
$.fn.selectRange = function(start, end) {
    if(end === undefined) {
        end = start;
    }
    return this.each(function() {
        if('selectionStart' in this) {
            this.selectionStart = start;
            this.selectionEnd = end;
        } else if(this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

// O hey you clicked!
$("body").on('click','.markdown-buttons-row button:not(.undo)', function () {
    var theStyle = $(this).attr('data-style');
    var theText = $(this).attr('data-id');
    addStyle(theStyle, theText);
});

// I will not be taking questions at this time
$("body").on('click','.undo', function () {
    var theID = $(this).attr('data-id');
    undoContents(theID);
});

// Loop until textbox is fully loaded
window.setInterval(function(){
    addMarkdownButtons();
}, 2500);
