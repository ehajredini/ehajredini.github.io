/**
 * Payrexx Modal (http://payrexx.com)
 * Copyright 2015 Payrexx AG
 */

(function($) {
    var forceHide = false;
    var redirectUrl = "";
    var lastPostMessageHeight = 0;

    var getMaxPossibleHeight = function () {
        return (window.innerWidth <= 590) ? window.innerHeight : window.innerHeight -
            parseInt($("#payrexx-modal.px-modal").css("top")) -
            parseInt($("#payrexx-modal.px-modal").css("bottom"));
    };

    var postMessage = function(e) {
        if (typeof e.data === 'string') {
            var data = {};
            try {
                data = JSON.parse(e.data);
            } catch (e) {}

            if (data.payrexx) {
                jQuery.each(data.payrexx, function(name, value) {
                    switch (name) {
                        case 'height':
                            var height = parseInt(value) + 10;
                            lastPostMessageHeight = height;
                            if (window.innerWidth <= 590) {
                                $("#payrexx-modal-iframe").css("height", "100%");
                            } else {
                                var maxPossibleHeight = getMaxPossibleHeight();
                                if (height > maxPossibleHeight) {
                                    height = maxPossibleHeight;
                                }
                                $("#payrexx-modal-iframe").css("height", height + "px");
                            }
                            break;
                        case 'transaction':
                            if (typeof value === 'object') {
                                $.fn.payrexxModal.transaction = value;
                            }
                            break;
                        case 'closeModal':
                            if (value) {
                                redirectUrl = value;
                            }
                            $.fn.payrexxModal.modalInstance.modalPx("hide");
                            break;
                    }
                });
            }
        }
    };

    window.addEventListener("message", postMessage, false);

    $.fn.payrexxModal = function(options) {
        var opts = $.extend({}, $.fn.payrexxModal.defaults, options);

        // Bootstrap Modal CSS
        $("head").append($('' +
            '<style type="text/css">' +
            'html.payrexx-modal-open,html.payrexx-modal-open>body{\n' +
            '    overflow:hidden\n' +
            '}\n' +
            '#payrexx-modal #payrexx-modal-iframe{\n' +
            '    display:block;\n' +
            '    visibility:hidden;\n' +
            '    width:100%;\n' +
            '    border:0;\n' +
            '    border-radius:7px;\n' +
            '    position:relative;\n' +
            '    bottom:1px\n' +
            '}\n' +
            '#payrexx-modal html{\n' +
            '    font-family:sans-serif;\n' +
            '    -ms-text-size-adjust:100%;\n' +
            '    -webkit-text-size-adjust:100%\n' +
            '}\n' +
            '#payrexx-modal article,#payrexx-modal aside,#payrexx-modal details,#payrexx-modal figcaption,#payrexx-modal figure,#payrexx-modal footer,#payrexx-modal header,#payrexx-modal hgroup,#payrexx-modal main,#payrexx-modal nav,#payrexx-modal section,#payrexx-modal summary{\n' +
            '    display:block\n' +
            '}\n' +
            '#payrexx-modal audio,#payrexx-modal canvas,#payrexx-modal progress,#payrexx-modal video{\n' +
            '    display:inline-block;\n' +
            '    vertical-align:baseline\n' +
            '}\n' +
            '#payrexx-modal audio:not([controls]){\n' +
            '    display:none;\n' +
            '    height:0\n' +
            '}\n' +
            '#payrexx-modal [hidden],#payrexx-modal template{\n' +
            '    display:none\n' +
            '}\n' +
            '#payrexx-modal a{\n' +
            '    background:0;\n' +
            '    color:#428bca;\n' +
            '    text-decoration:none\n' +
            '}\n' +
            '#payrexx-modal a:active,#payrexx-modal a:hover{\n' +
            '    outline:0\n' +
            '}\n' +
            '#payrexx-modal abbr[title]{\n' +
            '    border-bottom:1px dotted\n' +
            '}\n' +
            '#payrexx-modal b,#payrexx-modal optgroup,#payrexx-modal strong{\n' +
            '    font-weight:700\n' +
            '}\n' +
            '#payrexx-modal dfn{\n' +
            '    font-style:italic\n' +
            '}\n' +
            '#payrexx-modal h1{\n' +
            '    font-size:2em;\n' +
            '    margin:.67em 0\n' +
            '}\n' +
            '#payrexx-modal mark{\n' +
            '    background:#ff0;\n' +
            '    color:#000\n' +
            '}\n' +
            '#payrexx-modal .btn,#payrexx-modal .btn-danger.active,#payrexx-modal .btn-danger:active,#payrexx-modal .btn-default.active,#payrexx-modal .btn-default:active,#payrexx-modal .btn-info.active,#payrexx-modal .btn-info:active,#payrexx-modal .btn-primary.active,#payrexx-modal .btn-primary:active,#payrexx-modal .btn-success.active,#payrexx-modal .btn-success:active,#payrexx-modal .btn-warning.active,#payrexx-modal .btn-warning:active,#payrexx-modal .open>.dropdown-toggle.btn-danger,#payrexx-modal .open>.dropdown-toggle.btn-default,#payrexx-modal .open>.dropdown-toggle.btn-info,#payrexx-modal .open>.dropdown-toggle.btn-primary,#payrexx-modal .open>.dropdown-toggle.btn-success,#payrexx-modal .open>.dropdown-toggle.btn-warning{\n' +
            '    background-image:none\n' +
            '}\n' +
            '#payrexx-modal small{\n' +
            '    font-size:80%\n' +
            '}\n' +
            '#payrexx-modal sub,#payrexx-modal sup{\n' +
            '    font-size:75%;\n' +
            '    line-height:0;\n' +
            '    position:relative;\n' +
            '    vertical-align:baseline\n' +
            '}\n' +
            '#payrexx-modal sup{\n' +
            '    top:-.5em\n' +
            '}\n' +
            '#payrexx-modal sub{\n' +
            '    bottom:-.25em\n' +
            '}\n' +
            '#payrexx-modal img{\n' +
            '    border:0;\n' +
            '    vertical-align:middle\n' +
            '}\n' +
            '#payrexx-modal svg:not(:root){\n' +
            '    overflow:hidden\n' +
            '}\n' +
            '#payrexx-modal hr{\n' +
            '    -moz-box-sizing:content-box;\n' +
            '    box-sizing:content-box;\n' +
            '    height:0\n' +
            '}\n' +
            '#payrexx-modal pre,#payrexx-modal textarea{\n' +
            '    overflow:auto\n' +
            '}\n' +
            '#payrexx-modal code,#payrexx-modal kbd,#payrexx-modal pre,#payrexx-modal samp{\n' +
            '    font-family:monospace,monospace;\n' +
            '    font-size:1em\n' +
            '}\n' +
            '#payrexx-modal button,#payrexx-modal input,#payrexx-modal optgroup,#payrexx-modal select,#payrexx-modal textarea{\n' +
            '    color:inherit;\n' +
            '    font:inherit;\n' +
            '    margin:0\n' +
            '}\n' +
            '#payrexx-modal *,#payrexx-modal body{\n' +
            '    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif\n' +
            '}\n' +
            '#payrexx-modal button{\n' +
            '    overflow:visible\n' +
            '}\n' +
            '#payrexx-modal button,#payrexx-modal select{\n' +
            '    text-transform:none\n' +
            '}\n' +
            '#payrexx-modal button,#payrexx-modal html input[type=button],#payrexx-modal input[type=reset],#payrexx-modal input[type=submit]{\n' +
            '    -webkit-appearance:button;\n' +
            '    cursor:pointer\n' +
            '}\n' +
            '#payrexx-modal button[disabled],#payrexx-modal html input[disabled]{\n' +
            '    cursor:default\n' +
            '}\n' +
            '#payrexx-modal button::-moz-focus-inner,#payrexx-modal input::-moz-focus-inner{\n' +
            '    border:0;\n' +
            '    padding:0\n' +
            '}\n' +
            '#payrexx-modal input[type=checkbox],#payrexx-modal input[type=radio]{\n' +
            '    box-sizing:border-box;\n' +
            '    padding:0\n' +
            '}\n' +
            '#payrexx-modal input[type=number]::-webkit-inner-spin-button,#payrexx-modal input[type=number]::-webkit-outer-spin-button{\n' +
            '    height:auto\n' +
            '}\n' +
            '#payrexx-modal input[type=search]{\n' +
            '    -webkit-appearance:textfield;\n' +
            '    -moz-box-sizing:content-box;\n' +
            '    -webkit-box-sizing:content-box;\n' +
            '    box-sizing:content-box\n' +
            '}\n' +
            '#payrexx-modal input[type=search]::-webkit-search-cancel-button,#payrexx-modal input[type=search]::-webkit-search-decoration{\n' +
            '    -webkit-appearance:none\n' +
            '}\n' +
            '#payrexx-modal fieldset{\n' +
            '    border:1px solid silver;\n' +
            '    margin:0 2px;\n' +
            '    padding:.35em .625em .75em\n' +
            '}\n' +
            '#payrexx-modal legend{\n' +
            '    border:0;\n' +
            '    padding:0\n' +
            '}\n' +
            '#payrexx-modal table{\n' +
            '    border-collapse:collapse;\n' +
            '    border-spacing:0\n' +
            '}\n' +
            '#payrexx-modal td,#payrexx-modal th{\n' +
            '    padding:0\n' +
            '}\n' +
            '#payrexx-modal *,#payrexx-modal:after,#payrexx-modal:before{\n' +
            '    -webkit-box-sizing:border-box;\n' +
            '    -moz-box-sizing:border-box;\n' +
            '    box-sizing:border-box\n' +
            '}\n' +
            '#payrexx-modal html{\n' +
            '    font-size:10px;\n' +
            '    -webkit-tap-highlight-color:transparent\n' +
            '}\n' +
            '#payrexx-modal body{\n' +
            '    margin:0;\n' +
            '    font-size:14px;\n' +
            '    line-height:1.42857143;\n' +
            '    color:#333;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal button,#payrexx-modal input,#payrexx-modal select,#payrexx-modal textarea{\n' +
            '    font-family:inherit;\n' +
            '    font-size:inherit;\n' +
            '    line-height:inherit\n' +
            '}\n' +
            '#payrexx-modal a:focus,#payrexx-modal a:hover{\n' +
            '    color:#2a6496;\n' +
            '    text-decoration:underline\n' +
            '}\n' +
            '#payrexx-modal a:focus{\n' +
            '    outline:dotted thin;\n' +
            '    outline:-webkit-focus-ring-color auto 5px;\n' +
            '    outline-offset:-2px\n' +
            '}\n' +
            '#payrexx-modal figure{\n' +
            '    margin:0\n' +
            '}\n' +
            '#payrexx-modal .img-responsive{\n' +
            '    display:block;\n' +
            '    max-width:100%;\n' +
            '    height:auto\n' +
            '}\n' +
            '#payrexx-modal .img-rounded{\n' +
            '    border-radius:6px\n' +
            '}\n' +
            '#payrexx-modal .img-thumbnail{\n' +
            '    padding:4px;\n' +
            '    line-height:1.42857143;\n' +
            '    background-color:#fff;\n' +
            '    border:1px solid #ddd;\n' +
            '    border-radius:4px;\n' +
            '    -webkit-transition:all .2s ease-in-out;\n' +
            '    -o-transition:all .2s ease-in-out;\n' +
            '    transition:all .2s ease-in-out;\n' +
            '    display:inline-block;\n' +
            '    max-width:100%;\n' +
            '    height:auto\n' +
            '}\n' +
            '#payrexx-modal .img-circle{\n' +
            '    border-radius:50%\n' +
            '}\n' +
            '#payrexx-modal hr{\n' +
            '    margin-top:20px;\n' +
            '    margin-bottom:20px;\n' +
            '    border:0;\n' +
            '    border-top:1px solid #eee\n' +
            '}\n' +
            '#payrexx-modal .sr-only{\n' +
            '    position:absolute;\n' +
            '    width:1px;\n' +
            '    height:1px;\n' +
            '    margin:-1px;\n' +
            '    padding:0;\n' +
            '    overflow:hidden;\n' +
            '    clip:rect(0,0,0,0);\n' +
            '    border:0\n' +
            '}\n' +
            '#payrexx-modal .sr-only-focusable:active,#payrexx-modal .sr-only-focusable:focus{\n' +
            '    position:static;\n' +
            '    width:auto;\n' +
            '    height:auto;\n' +
            '    margin:0;\n' +
            '    overflow:visible;\n' +
            '    clip:auto\n' +
            '}\n' +
            '#payrexx-modal .btn{\n' +
            '    display:inline-block;\n' +
            '    margin-bottom:0;\n' +
            '    font-weight:400;\n' +
            '    text-align:center;\n' +
            '    vertical-align:middle;\n' +
            '    cursor:pointer;\n' +
            '    border:1px solid transparent;\n' +
            '    white-space:nowrap;\n' +
            '    padding:6px 12px;\n' +
            '    font-size:14px;\n' +
            '    line-height:1.42857143;\n' +
            '    border-radius:4px;\n' +
            '    -webkit-user-select:none;\n' +
            '    -moz-user-select:none;\n' +
            '    -ms-user-select:none;\n' +
            '    user-select:none\n' +
            '}\n' +
            '#payrexx-modal .btn.active:focus,#payrexx-modal .btn:active:focus,#payrexx-modal .btn:focus{\n' +
            '    outline:dotted thin;\n' +
            '    outline:-webkit-focus-ring-color auto 5px;\n' +
            '    outline-offset:-2px\n' +
            '}\n' +
            '#payrexx-modal .btn:focus,#payrexx-modal .btn:hover{\n' +
            '    color:#333;\n' +
            '    text-decoration:none\n' +
            '}\n' +
            '#payrexx-modal .btn.active,#payrexx-modal .btn:active{\n' +
            '    outline:0;\n' +
            '    background-image:none;\n' +
            '    -webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);\n' +
            '    box-shadow:inset 0 3px 5px rgba(0,0,0,.125)\n' +
            '}\n' +
            '#payrexx-modal .btn.disabled,#payrexx-modal .btn[disabled],#payrexx-modal fieldset[disabled] .btn{\n' +
            '    cursor:not-allowed;\n' +
            '    pointer-events:none;\n' +
            '    opacity:.65;\n' +
            '    filter:alpha(opacity=65);\n' +
            '    -webkit-box-shadow:none;\n' +
            '    box-shadow:none\n' +
            '}\n' +
            '#payrexx-modal .btn-default{\n' +
            '    color:#333;\n' +
            '    background-color:#fff;\n' +
            '    border-color:#ccc\n' +
            '}\n' +
            '#payrexx-modal .btn-default.active,#payrexx-modal .btn-default:active,#payrexx-modal .btn-default:focus,#payrexx-modal .btn-default:hover,#payrexx-modal .open>.dropdown-toggle.btn-default{\n' +
            '    color:#333;\n' +
            '    background-color:#e6e6e6;\n' +
            '    border-color:#adadad\n' +
            '}\n' +
            '#payrexx-modal .btn-default.disabled,#payrexx-modal .btn-default.disabled.active,#payrexx-modal .btn-default.disabled:active,#payrexx-modal .btn-default.disabled:focus,#payrexx-modal .btn-default.disabled:hover,#payrexx-modal .btn-default[disabled],#payrexx-modal .btn-default[disabled].active,#payrexx-modal .btn-default[disabled]:active,#payrexx-modal .btn-default[disabled]:focus,#payrexx-modal .btn-default[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-default,#payrexx-modal fieldset[disabled] .btn-default.active,#payrexx-modal fieldset[disabled] .btn-default:active,#payrexx-modal fieldset[disabled] .btn-default:focus,#payrexx-modal fieldset[disabled] .btn-default:hover{\n' +
            '    background-color:#fff;\n' +
            '    border-color:#ccc\n' +
            '}\n' +
            '#payrexx-modal .btn-default .badge{\n' +
            '    color:#fff;\n' +
            '    background-color:#333\n' +
            '}\n' +
            '#payrexx-modal .btn-primary{\n' +
            '    color:#fff;\n' +
            '    background-color:#428bca;\n' +
            '    border-color:#357ebd\n' +
            '}\n' +
            '#payrexx-modal .btn-primary.active,#payrexx-modal .btn-primary:active,#payrexx-modal .btn-primary:focus,#payrexx-modal .btn-primary:hover,#payrexx-modal .open>.dropdown-toggle.btn-primary{\n' +
            '    color:#fff;\n' +
            '    background-color:#3071a9;\n' +
            '    border-color:#285e8e\n' +
            '}\n' +
            '#payrexx-modal .btn-primary.disabled,#payrexx-modal .btn-primary.disabled.active,#payrexx-modal .btn-primary.disabled:active,#payrexx-modal .btn-primary.disabled:focus,#payrexx-modal .btn-primary.disabled:hover,#payrexx-modal .btn-primary[disabled],#payrexx-modal .btn-primary[disabled].active,#payrexx-modal .btn-primary[disabled]:active,#payrexx-modal .btn-primary[disabled]:focus,#payrexx-modal .btn-primary[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-primary,#payrexx-modal fieldset[disabled] .btn-primary.active,#payrexx-modal fieldset[disabled] .btn-primary:active,#payrexx-modal fieldset[disabled] .btn-primary:focus,#payrexx-modal fieldset[disabled] .btn-primary:hover{\n' +
            '    background-color:#428bca;\n' +
            '    border-color:#357ebd\n' +
            '}\n' +
            '#payrexx-modal .btn-primary .badge{\n' +
            '    color:#428bca;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal .btn-success{\n' +
            '    color:#fff;\n' +
            '    background-color:#5cb85c;\n' +
            '    border-color:#4cae4c\n' +
            '}\n' +
            '#payrexx-modal .btn-success.active,#payrexx-modal .btn-success:active,#payrexx-modal .btn-success:focus,#payrexx-modal .btn-success:hover,#payrexx-modal .open>.dropdown-toggle.btn-success{\n' +
            '    color:#fff;\n' +
            '    background-color:#449d44;\n' +
            '    border-color:#398439\n' +
            '}\n' +
            '#payrexx-modal .btn-success.disabled,#payrexx-modal .btn-success.disabled.active,#payrexx-modal .btn-success.disabled:active,#payrexx-modal .btn-success.disabled:focus,#payrexx-modal .btn-success.disabled:hover,#payrexx-modal .btn-success[disabled],#payrexx-modal .btn-success[disabled].active,#payrexx-modal .btn-success[disabled]:active,#payrexx-modal .btn-success[disabled]:focus,#payrexx-modal .btn-success[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-success,#payrexx-modal fieldset[disabled] .btn-success.active,#payrexx-modal fieldset[disabled] .btn-success:active,#payrexx-modal fieldset[disabled] .btn-success:focus,#payrexx-modal fieldset[disabled] .btn-success:hover{\n' +
            '    background-color:#5cb85c;\n' +
            '    border-color:#4cae4c\n' +
            '}\n' +
            '#payrexx-modal .btn-success .badge{\n' +
            '    color:#5cb85c;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal .btn-info{\n' +
            '    color:#fff;\n' +
            '    background-color:#5bc0de;\n' +
            '    border-color:#46b8da\n' +
            '}\n' +
            '#payrexx-modal .btn-info.active,#payrexx-modal .btn-info:active,#payrexx-modal .btn-info:focus,#payrexx-modal .btn-info:hover,#payrexx-modal .open>.dropdown-toggle.btn-info{\n' +
            '    color:#fff;\n' +
            '    background-color:#31b0d5;\n' +
            '    border-color:#269abc\n' +
            '}\n' +
            '#payrexx-modal .btn-info.disabled,#payrexx-modal .btn-info.disabled.active,#payrexx-modal .btn-info.disabled:active,#payrexx-modal .btn-info.disabled:focus,#payrexx-modal .btn-info.disabled:hover,#payrexx-modal .btn-info[disabled],#payrexx-modal .btn-info[disabled].active,#payrexx-modal .btn-info[disabled]:active,#payrexx-modal .btn-info[disabled]:focus,#payrexx-modal .btn-info[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-info,#payrexx-modal fieldset[disabled] .btn-info.active,#payrexx-modal fieldset[disabled] .btn-info:active,#payrexx-modal fieldset[disabled] .btn-info:focus,#payrexx-modal fieldset[disabled] .btn-info:hover{\n' +
            '    background-color:#5bc0de;\n' +
            '    border-color:#46b8da\n' +
            '}\n' +
            '#payrexx-modal .btn-info .badge{\n' +
            '    color:#5bc0de;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal .btn-warning{\n' +
            '    color:#fff;\n' +
            '    background-color:#f0ad4e;\n' +
            '    border-color:#eea236\n' +
            '}\n' +
            '#payrexx-modal .btn-warning.active,#payrexx-modal .btn-warning:active,#payrexx-modal .btn-warning:focus,#payrexx-modal .btn-warning:hover,#payrexx-modal .open>.dropdown-toggle.btn-warning{\n' +
            '    color:#fff;\n' +
            '    background-color:#ec971f;\n' +
            '    border-color:#d58512\n' +
            '}\n' +
            '#payrexx-modal .btn-warning.disabled,#payrexx-modal .btn-warning.disabled.active,#payrexx-modal .btn-warning.disabled:active,#payrexx-modal .btn-warning.disabled:focus,#payrexx-modal .btn-warning.disabled:hover,#payrexx-modal .btn-warning[disabled],#payrexx-modal .btn-warning[disabled].active,#payrexx-modal .btn-warning[disabled]:active,#payrexx-modal .btn-warning[disabled]:focus,#payrexx-modal .btn-warning[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-warning,#payrexx-modal fieldset[disabled] .btn-warning.active,#payrexx-modal fieldset[disabled] .btn-warning:active,#payrexx-modal fieldset[disabled] .btn-warning:focus,#payrexx-modal fieldset[disabled] .btn-warning:hover{\n' +
            '    background-color:#f0ad4e;\n' +
            '    border-color:#eea236\n' +
            '}\n' +
            '#payrexx-modal .btn-warning .badge{\n' +
            '    color:#f0ad4e;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal .btn-danger{\n' +
            '    color:#fff;\n' +
            '    background-color:#d9534f;\n' +
            '    border-color:#d43f3a\n' +
            '}\n' +
            '#payrexx-modal .btn-danger.active,#payrexx-modal .btn-danger:active,#payrexx-modal .btn-danger:focus,#payrexx-modal .btn-danger:hover,#payrexx-modal .open>.dropdown-toggle.btn-danger{\n' +
            '    color:#fff;\n' +
            '    background-color:#c9302c;\n' +
            '    border-color:#ac2925\n' +
            '}\n' +
            '#payrexx-modal .btn-danger.disabled,#payrexx-modal .btn-danger.disabled.active,#payrexx-modal .btn-danger.disabled:active,#payrexx-modal .btn-danger.disabled:focus,#payrexx-modal .btn-danger.disabled:hover,#payrexx-modal .btn-danger[disabled],#payrexx-modal .btn-danger[disabled].active,#payrexx-modal .btn-danger[disabled]:active,#payrexx-modal .btn-danger[disabled]:focus,#payrexx-modal .btn-danger[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-danger,#payrexx-modal fieldset[disabled] .btn-danger.active,#payrexx-modal fieldset[disabled] .btn-danger:active,#payrexx-modal fieldset[disabled] .btn-danger:focus,#payrexx-modal fieldset[disabled] .btn-danger:hover{\n' +
            '    background-color:#d9534f;\n' +
            '    border-color:#d43f3a\n' +
            '}\n' +
            '#payrexx-modal .btn-danger .badge{\n' +
            '    color:#d9534f;\n' +
            '    background-color:#fff\n' +
            '}\n' +
            '#payrexx-modal .btn-link{\n' +
            '    color:#428bca;\n' +
            '    font-weight:400;\n' +
            '    cursor:pointer;\n' +
            '    border-radius:0\n' +
            '}\n' +
            '#payrexx-modal .btn-link,#payrexx-modal .btn-link:active,#payrexx-modal .btn-link[disabled],#payrexx-modal fieldset[disabled] .btn-link{\n' +
            '    background-color:transparent;\n' +
            '    -webkit-box-shadow:none;\n' +
            '    box-shadow:none\n' +
            '}\n' +
            '#payrexx-modal .btn-link,#payrexx-modal .btn-link:active,#payrexx-modal .btn-link:focus,#payrexx-modal .btn-link:hover{\n' +
            '    border-color:transparent\n' +
            '}\n' +
            '#payrexx-modal .btn-link:focus,#payrexx-modal .btn-link:hover{\n' +
            '    color:#2a6496;\n' +
            '    text-decoration:underline;\n' +
            '    background-color:transparent\n' +
            '}\n' +
            '#payrexx-modal .btn-link[disabled]:focus,#payrexx-modal .btn-link[disabled]:hover,#payrexx-modal fieldset[disabled] .btn-link:focus,#payrexx-modal fieldset[disabled] .btn-link:hover{\n' +
            '    color:#777;\n' +
            '    text-decoration:none\n' +
            '}\n' +
            '#payrexx-modal .btn-lg{\n' +
            '    padding:10px 16px;\n' +
            '    font-size:18px;\n' +
            '    line-height:1.33;\n' +
            '    border-radius:6px\n' +
            '}\n' +
            '#payrexx-modal .btn-sm,#payrexx-modal .btn-xs{\n' +
            '    font-size:12px;\n' +
            '    line-height:1.5;\n' +
            '    border-radius:3px\n' +
            '}\n' +
            '#payrexx-modal .btn-sm{\n' +
            '    padding:5px 10px\n' +
            '}\n' +
            '#payrexx-modal .btn-xs{\n' +
            '    padding:1px 5px\n' +
            '}\n' +
            '#payrexx-modal .btn-block{\n' +
            '    display:block;\n' +
            '    width:100%\n' +
            '}\n' +
            '#payrexx-modal .btn-block+.btn-block{\n' +
            '    margin-top:5px\n' +
            '}\n' +
            '#payrexx-modal input[type=button].btn-block,#payrexx-modal input[type=reset].btn-block,#payrexx-modal input[type=submit].btn-block{\n' +
            '    width:100%\n' +
            '}\n' +
            '#payrexx-modal .fade{\n' +
            '    opacity:0;\n' +
            '    -webkit-transition:opacity .15s linear;\n' +
            '    -o-transition:opacity .15s linear;\n' +
            '    transition:opacity .15s linear\n' +
            '}\n' +
            '#payrexx-modal .fade.in{\n' +
            '    opacity:1\n' +
            '}\n' +
            '#payrexx-modal .collapse{\n' +
            '    display:none\n' +
            '}\n' +
            '#payrexx-modal .collapse.in{\n' +
            '    display:block\n' +
            '}\n' +
            '#payrexx-modal tr.collapse.in{\n' +
            '    display:table-row\n' +
            '}\n' +
            '#payrexx-modal tbody.collapse.in{\n' +
            '    display:table-row-group\n' +
            '}\n' +
            '#payrexx-modal .collapsing{\n' +
            '    position:relative;\n' +
            '    height:0;\n' +
            '    overflow:hidden;\n' +
            '    -webkit-transition:height .35s ease;\n' +
            '    -o-transition:height .35s ease;\n' +
            '    transition:height .35s ease\n' +
            '}\n' +
            '#payrexx-modal .close{\n' +
            '    float:right;\n' +
            '    font-size:21px;\n' +
            '    font-weight:700;\n' +
            '    line-height:1;\n' +
            '    color:#fff;\n' +
            '    text-shadow:0 1px 0 #fff;\n' +
            '    filter:alpha(opacity=20)\n' +
            '}\n' +
            '#payrexx-modal .close:focus,#payrexx-modal .close:hover{\n' +
            '    text-decoration:none;\n' +
            '    cursor:pointer\n' +
            '}\n' +
            '#payrexx-modal button.close{\n' +
            '    padding:0;\n' +
            '    cursor:pointer;\n' +
            '    background:0;\n' +
            '    border:0;\n' +
            '    -webkit-appearance:none\n' +
            '}\n' +
            '#payrexx-modal .px-modal-open{\n' +
            '    overflow:hidden\n' +
            '}\n' +
            '#payrexx-modal.px-modal{\n' +
            '    display:none;\n' +
            '    overflow:hidden;\n' +
            '    position:fixed;\n' +
            '    top:30px;\n' +
            '    right:0;\n' +
            '    bottom:30px;\n' +
            '    left:0;\n' +
            '    z-index:9050;\n' +
            '    -webkit-overflow-scrolling:touch;\n' +
            '    outline:0\n' +
            '}\n' +
            '#payrexx-modal.px-modal.fade .px-modal-dialog{\n' +
            '    -webkit-transform:translate3d(0,-25%,0);\n' +
            '    transform:translate3d(0,-25%,0);\n' +
            '    -webkit-transition:-webkit-transform .3s ease-out;\n' +
            '    -moz-transition:-moz-transform .3s ease-out;\n' +
            '    -o-transition:-o-transform .3s ease-out;\n' +
            '    transition:transform .3s ease-out\n' +
            '}\n' +
            '#payrexx-modal.px-modal.in .px-modal-dialog{\n' +
            '    -webkit-transform:translate3d(0,0,0);\n' +
            '    transform:translate3d(0,0,0)\n' +
            '}\n' +
            '#payrexx-modal .px-modal-open .px-modal{\n' +
            '    overflow-x:hidden;\n' +
            '    overflow-y:auto\n' +
            '}\n' +
            '#payrexx-modal .px-modal-dialog{\n' +
            '    position:relative;\n' +
            '    width:400px;\n' +
            '    margin:0 auto;\n' +
            '    z-index:9050\n' +
            '}\n' +
            '@media(max-width:590px){\n' +
            '    #payrexx-modal.px-modal{\n' +
            '        top:0;\n' +
            '        bottom:0;\n' +
            '    }\n' +
            '    #payrexx-modal .px-modal-dialog{\n' +
            '        width:100%;\n' +
            '        height:100%;\n' +
            '        margin:0\n' +
            '    }\n' +
            '    #payrexx-modal .px-modal-header{\n' +
            '        display:none\n' +
            '    }\n' +
            '    #payrexx-modal .px-modal-content{\n' +
            '        height:100%\n' +
            '    }\n' +
            '    #payrexx-modal .px-modal-body{\n' +
            '        border-radius:0 !important;\n' +
            '        height:100%\n' +
            '    }\n' +
            '    #payrexx-modal #payrexx-modal-iframe{\n' +
            '        height:100%;\n' +
            '        border-radius:0 !important\n' +
            '    }\n' +
            '}\n' +
            '#payrexx-modal .px-modal-content{\n' +
            '    position:relative;\n' +
            '    border-radius:0;\n' +
            '    background-clip:padding-box;\n' +
            '    outline:0\n' +
            '}\n' +
            '.px-modal-backdrop{\n' +
            '    position:fixed;\n' +
            '    top:0;\n' +
            '    right:0;\n' +
            '    bottom:0;\n' +
            '    left:0;\n' +
            '    z-index:9000;\n' +
            '    background-color:rgba(48,48,56,.7)\n' +
            '}\n' +
            '.px-modal-backdrop.fade{\n' +
            '    opacity:0;\n' +
            '    filter:alpha(opacity=0)\n' +
            '}\n' +
            '.px-modal-backdrop.in{\n' +
            '    opacity:1;\n' +
            '    filter:alpha(opacity=100)\n' +
            '}\n' +
            '#payrexx-modal .px-modal-header{\n' +
            '    padding:10px 0 18px !important;\n' +
            '    border-bottom:0;\n' +
            '    min-height:16.43px\n' +
            '}\n' +
            '#payrexx-modal .px-modal-header .close{\n' +
            '    position:relative;\n' +
            '    bottom:6px;\n' +
            '    margin-top:-2px\n' +
            '}\n' +
            '#payrexx-modal .px-modal-title{\n' +
            '    margin:0;\n' +
            '    line-height:1.42857143\n' +
            '}\n' +
            '#payrexx-modal .px-modal-body{\n' +
            '    float:none;\n' +
            '    position:relative;\n' +
            '    padding:0;\n' +
            '    background:url(https://media.payrexx.com/modal/v1/iframe-spinner.gif) center center no-repeat #fff;\n' +
            '    -webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);\n' +
            '    box-shadow:0 5px 15px rgba(0,0,0,.5);\n' +
            '    border-radius:7px;\n' +
            '    width:100%;\n' +
            '    overflow-x:hidden\n' +
            '}\n' +
            '#payrexx-modal .px-modal-footer{\n' +
            '    padding:15px;\n' +
            '    text-align:right;\n' +
            '    border-top:1px solid #e5e5e5\n' +
            '}\n' +
            '#payrexx-modal .px-modal-footer .btn+.btn{\n' +
            '    margin-left:5px;\n' +
            '    margin-bottom:0\n' +
            '}\n' +
            '#payrexx-modal .px-modal-footer .btn-group .btn+.btn{\n' +
            '    margin-left:-1px\n' +
            '}\n' +
            '#payrexx-modal .px-modal-footer .btn-block+.btn-block{\n' +
            '    margin-left:0\n' +
            '}\n' +
            '#payrexx-modal .px-modal-scrollbar-measure{\n' +
            '    position:absolute;\n' +
            '    top:-9999px;\n' +
            '    width:50px;\n' +
            '    height:50px;\n' +
            '    overflow:scroll\n' +
            '}\n' +
            '#payrexx-modal .clearfix:after,#payrexx-modal .clearfix:before,#payrexx-modal .px-modal-footer:after,#payrexx-modal .px-modal-footer:before{\n' +
            '    content:" ";\n' +
            '    display:table\n' +
            '}\n' +
            '#payrexx-modal .clearfix:after,#payrexx-modal .px-modal-footer:after{\n' +
            '    clear:both\n' +
            '}\n' +
            '#payrexx-modal .center-block{\n' +
            '    display:block;\n' +
            '    margin-left:auto;\n' +
            '    margin-right:auto\n' +
            '}\n' +
            '#payrexx-modal .pull-right{\n' +
            '    float:right !important\n' +
            '}\n' +
            '#payrexx-modal .pull-left{\n' +
            '    float:left !important\n' +
            '}\n' +
            '#payrexx-modal .hide{\n' +
            '    display:none !important\n' +
            '}\n' +
            '#payrexx-modal .show{\n' +
            '    display:block !important\n' +
            '}\n' +
            '#payrexx-modal .invisible{\n' +
            '    visibility:hidden\n' +
            '}\n' +
            '#payrexx-modal .text-hide{\n' +
            '    font:0/0 a;\n' +
            '    color:transparent;\n' +
            '    text-shadow:none;\n' +
            '    background-color:transparent;\n' +
            '    border:0\n' +
            '}\n' +
            '#payrexx-modal .hidden{\n' +
            '    display:none !important;\n' +
            '    visibility:hidden !important\n' +
            '}\n' +
            '#payrexx-modal .affix{\n' +
            '    position:fixed;\n' +
            '    -webkit-transform:translate3d(0,0,0);\n' +
            '    transform:translate3d(0,0,0)\n' +
            '}\n' +
            '</style>'));

        // Bootstrap Modal JavaScript
        if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
        (function($) {
            'use strict';

            var Modal = function (element, options) {
                this.options        = options
                this.$body          = $(document.body)
                this.$element       = $(element)
                this.$backdrop      =
                    this.isShown        = null
                this.scrollbarWidth = 0

                if (this.options.remote) {
                    this.$element
                        .find('.px-modal-content')
                        .load(this.options.remote, $.proxy(function () {
                            this.$element.trigger('loaded.bs.modal.px')
                        }, this))
                }
            }

            Modal.VERSION  = '3.2.0'

            Modal.DEFAULTS = {
                backdrop: true,
                keyboard: true,
                show: true
            }

            Modal.prototype.toggle = function (_relatedTarget) {
                return this.isShown ? this.hide() : this.show(_relatedTarget)
            }

            Modal.prototype.show = function (_relatedTarget) {
                var that = this
                var e    = $.Event('show.bs.modal.px', { relatedTarget: _relatedTarget })

                this.$element.trigger(e)

                if (this.isShown || e.isDefaultPrevented()) return

                this.isShown = true

                this.checkScrollbar()
                this.$body.addClass('px-modal-open')
                this.$body.addClass('disable-scrolling')

                $(document).on('touchmove', function ( event ) {

                    var isTouchMoveAllowed = true, target = that.$body[0];
                    console.log('event target', target);

                    while ( target !== null ) {
                        if ( target.classList && target.classList.contains( 'disable-scrolling' ) ) {
                            isTouchMoveAllowed = false;
                            break;
                        }
                        target = target.parentNode;
                    }

                    if ( !isTouchMoveAllowed ) {
                        event.preventDefault();
                    }

                });


                this.setScrollbar()
                this.escape()

                this.$element.on('click.dismiss.bs.modal.px', '[data-dismiss="px-modal"]', $.proxy(this.hide, this))

                this.backdrop(function () {
                    var transition = $.support.transition && that.$element.hasClass('fade')

                    if (!that.$element.parent().length) {
                        that.$element.appendTo(that.$body) // don't move modals dom position
                    }

                    that.$element
                        .show()
                        .scrollTop(0)

                    if (transition) {
                        that.$element[0].offsetWidth // force reflow
                    }

                    that.$element
                        .addClass('in')
                        .attr('aria-hidden', false)

                    that.enforceFocus()

                    var e = $.Event('shown.bs.modal.px', { relatedTarget: _relatedTarget })

                    transition ?
                        that.$element.find('.px-modal-dialog') // wait for modal to slide in
                            .one('bsTransitionEnd', function () {
                                that.$element.trigger('focus').trigger(e)
                            })
                            .emulateTransitionEnd(300) :
                        that.$element.trigger('focus').trigger(e)
                })
            }

            Modal.prototype.hide = function (e) {
                if (e) e.preventDefault()

                e = $.Event('hide.bs.modal.px')

                this.$element.trigger(e)

                if (!this.isShown || e.isDefaultPrevented()) return

                this.isShown = false

                this.$body.removeClass('px-modal-open')

                this.resetScrollbar()
                this.escape()

                $(document).off('focusin.bs.modal.px')

                this.$element
                    .removeClass('in')
                    .attr('aria-hidden', true)
                    .off('click.dismiss.bs.modal.px')

                $.support.transition && this.$element.hasClass('fade') ?
                    this.$element
                        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                        .emulateTransitionEnd(300) :
                    this.hideModal()
            }

            Modal.prototype.enforceFocus = function () {
                $(document)
                    .off('focusin.bs.modal.px') // guard against infinite focus loop
                    .on('focusin.bs.modal.px', $.proxy(function (e) {
                        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                            this.$element.trigger('focus')
                        }
                    }, this))
            }

            Modal.prototype.escape = function () {
                if (this.isShown && this.options.keyboard) {
                    this.$element.on('keyup.dismiss.bs.modal.px', $.proxy(function (e) {
                        e.which == 27 && this.hide()
                    }, this))
                } else if (!this.isShown) {
                    this.$element.off('keyup.dismiss.bs.modal.px')
                }
            }

            Modal.prototype.hideModal = function () {
                var that = this
                this.$element.hide()
                this.backdrop(function () {
                    that.$element.trigger('hidden.bs.modal.px')
                })
            }

            Modal.prototype.removeBackdrop = function () {
                this.$backdrop && this.$backdrop.remove()
                this.$backdrop = null
            }

            Modal.prototype.backdrop = function (callback) {
                var that = this
                var animate = this.$element.hasClass('fade') ? 'fade' : ''

                if (this.isShown && this.options.backdrop) {
                    var doAnimate = $.support.transition && animate

                    this.$backdrop = $('<div class="px-modal-backdrop ' + animate + '" />')
                        .appendTo(this.$body)

                    this.$element.on('click.dismiss.bs.modal.px', $.proxy(function (e) {
                        if (e.target !== e.currentTarget) return
                        this.options.backdrop == 'static'
                            ? this.$element[0].focus.call(this.$element[0])
                            : this.hide.call(this)
                    }, this))

                    if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

                    this.$backdrop.addClass('in')

                    if (!callback) return

                    doAnimate ?
                        this.$backdrop
                            .one('bsTransitionEnd', callback)
                            .emulateTransitionEnd(150) :
                        callback()

                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass('in')

                    var callbackRemove = function () {
                        that.removeBackdrop()
                        callback && callback()
                    }
                    $.support.transition && this.$element.hasClass('fade') ?
                        this.$backdrop
                            .one('bsTransitionEnd', callbackRemove)
                            .emulateTransitionEnd(150) :
                        callbackRemove()

                } else if (callback) {
                    callback()
                }
            }

            Modal.prototype.checkScrollbar = function () {
                if (document.body.clientWidth >= window.innerWidth) return
                this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
            }

            Modal.prototype.setScrollbar = function () {
                var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
                if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
            }

            Modal.prototype.resetScrollbar = function () {
                this.$body.css('padding-right', '')
            }

            Modal.prototype.measureScrollbar = function () { // thx walsh
                var scrollDiv = document.createElement('div')
                scrollDiv.className = 'px-modal-scrollbar-measure'
                this.$body.append(scrollDiv)
                var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
                this.$body[0].removeChild(scrollDiv)
                return scrollbarWidth
            }


            // MODAL PLUGIN DEFINITION
            // =======================

            function Plugin(option, _relatedTarget) {
                return this.each(function () {
                    var $this   = $(this)
                    var data    = $this.data('bs.modal.px')
                    var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

                    if (!data) $this.data('bs.modal.px', (data = new Modal(this, options)))
                    if (typeof option == 'string') data[option](_relatedTarget)
                    else if (options.show) data.show(_relatedTarget)
                })
            }

            var old = $.fn.modalPx

            $.fn.modalPx             = Plugin
            $.fn.modalPx.Constructor = Modal


            // MODAL NO CONFLICT
            // =================

            $.fn.modalPx.noConflict = function () {
                $.fn.modalPx = old
                return this
            }


            // MODAL DATA-API
            // ==============

            $(document).on('click.bs.modal.data-api.px', '[data-toggle="px-modal"]', function (e) {
                var $this   = $(this)
                var href    = $this.attr('href')
                var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
                var option  = $target.data('bs.modal.px') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

                if ($this.is('a')) e.preventDefault()

                $target.one('show.bs.modal.px', function (showEvent) {
                    if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
                    $target.one('hidden.bs.modal.px', function () {
                        $this.is(':visible') && $this.trigger('focus')
                    })
                })
                Plugin.call($target, option, this)
            })

        }(jQuery));

        return this.each(function() {
            $(this).click(function () {
                var iFrameUrl = $(this).data("href");
                iFrameUrl += "&appview=1";

                $.fn.payrexxModal.modalInstance = $(
                    '<div class="px-modal fade" id="payrexx-modal" tabindex="-1" role="dialog" aria-labelledby="payrexx-modal-label" aria-hidden="true">' +
                    '<div class="px-modal-dialog">' +
                    '<div class="px-modal-content nano">' +
                    '<div class="px-modal-body nano-content">' +
                    '<iframe id="payrexx-modal-iframe" src="' + iFrameUrl + '"></iframe>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                ).on("show.bs.modal.px",
                    function (e) {
                        $('html').addClass('payrexx-modal-open');
                        return opts.show(e);
                    }
                ).on("shown.bs.modal.px",
                    function () {
                        $("#payrexx-modal-iframe").load(function () {
                            if (!window.location.origin) {
                                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                            }
                            try {
                                var configurationData = {
                                    origin: window.location.origin,
                                    integrationMode: 'modal-gateway',
                                    hideObjects: opts.hideObjects
                                };

                                function adjustIframeHeight() {
                                    if (window.innerWidth <= 590) {
                                        $("#payrexx-modal-iframe").css("height", "100%");
                                    } else {
                                        var height = lastPostMessageHeight;
                                        var maxPossibleHeight = getMaxPossibleHeight();
                                        if (height > maxPossibleHeight) {
                                            height = maxPossibleHeight;
                                        }
                                        if (height) {
                                            $("#payrexx-modal-iframe").css("height", height + "px");
                                        }
                                    }
                                }

                                $(window).resize(adjustIframeHeight);
                                adjustIframeHeight();

                                $(this).get(0, 1).contentWindow.postMessage(JSON.stringify(configurationData), iFrameUrl);
                                $(this).css("visibility", "visible");

                                opts.shown();
                            } catch (e) {
                            }
                        });
                    }
                ).on("hide.bs.modal.px",
                    function() {
                        if ($.isEmptyObject($.fn.payrexxModal.transaction) && !forceHide) {
                            var confirmed = confirm("Wollen Sie die Zahlung wirklich abbrechen?");
                            if (!confirmed) return false;
                        }
                        opts.hide($.fn.payrexxModal.transaction);
                        if (redirectUrl) {
                            window.location = redirectUrl;
                        }
                    }
                ).on("hidden.bs.modal.px",
                    function () {
                        $(this).remove();
                        opts.hidden($.fn.payrexxModal.transaction);
                        $('html').removeClass('payrexx-modal-open');
                    }
                ).modalPx(
                    {
                        backdrop: "static",
                        keyboard: false
                    }
                );
            });
        });
    }

    $.fn.payrexxModal.modalInstance = null;
    $.fn.payrexxModal.transaction = new Object();
    $.fn.payrexxModal.defaults = {
        hideObjects: [],
        show: function(e) {},
        shown: function() {},
        hide: function(transaction) {},
        hidden: function(transaction) {}
    }
})(jQuery);
