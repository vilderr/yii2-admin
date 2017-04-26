/**
 * Created by vilderr on 25.04.17.
 */

if (typeof jQuery === "undefined") {
    throw new Error("VilderrAdmin requires jQuery");
}

/**
 * @type {{}}
 */
$.VilderrAdmin = {};

$.VilderrAdmin.options = {
    navbarMenuSlimscroll: true,
    navbarMenuSlimscrollWidth: "3px",
    navbarMenuHeight: "200px",
    animationSpeed: 500,
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    sidebarPushMenu: true,
    sidebarSlimScroll: true,
    sidebarExpandOnHover: false,
    enableFastclick: false,
    enableControlTreeView: true,
    controlSidebarOptions: {
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        selector: ".control-sidebar",
        slide: true
    },
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

$(function () {
    "use strict";

    $("body").removeClass("hold-transition");

    if (typeof VilderrAdminOptions !== "undefined") {
        $.extend(true,
            $.VilderrAdmin.options,
            VilderrAdminOptions);
    }

    //Easy access to options
    var o = $.VilderrAdmin.options;

    _init();

    $.VilderrAdmin.layout.activate();

    //Enable sidebar tree view controls
    if (o.enableControlTreeView) {
        $.VilderrAdmin.tree('.sidebar');
    }

    if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
        $(".navbar .menu").slimscroll({
            height: o.navbarMenuHeight,
            alwaysVisible: false,
            size: o.navbarMenuSlimscrollWidth
        }).css("width", "100%");
    }

    if (o.sidebarPushMenu) {
        $.VilderrAdmin.pushMenu.activate(o.sidebarToggleSelector);
    }
});

function _init() {
    'use strict';

    $.VilderrAdmin.layout = {
        activate: function () {
            var _this = this;

            _this.fix();
            $('body, html, .wrapper').css('height', 'auto');

            $(window, ".wrapper").resize(function () {
                _this.fix();
            });
        },

        fix: function () {
            var footer_height = $('.main-footer').outerHeight() || 0;
            var neg = $('.main-header').outerHeight() + footer_height;
            var window_height = $(window).height();
            var sidebar_height = $(".sidebar").height() || 0;

            if ($("body").hasClass("fixed")) {
                $(".content-wrapper").css('min-height', window_height - footer_height);
            } else {
                var postSetWidth;
                if (window_height >= sidebar_height) {
                    $(".content-wrapper").css('min-height', window_height - neg);
                    postSetWidth = window_height - neg;
                } else {
                    $(".content-wrapper").css('min-height', sidebar_height);
                    postSetWidth = sidebar_height;
                }

                //Fix for the control sidebar height
                var controlSidebar = $($.VilderrAdmin.options.controlSidebarOptions.selector);
                if (typeof controlSidebar !== "undefined") {
                    if (controlSidebar.height() > postSetWidth)
                        $(".content-wrapper").css('min-height', controlSidebar.height());
                }

            }
        },
    };

    $.VilderrAdmin.pushMenu = {
        activate: function (toggleBtn) {
            var screenSizes = $.VilderrAdmin.options.screenSizes;

            $(document).on('click', toggleBtn, function (e) {
                e.preventDefault();

                if ($(window).width() > (screenSizes.sm - 1)) {
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                    } else {
                        $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    }
                }
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    } else {
                        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                    }
                }
            });

            $(".content-wrapper").click(function () {
                //Enable hide menu when clicking on the content-wrapper on small screens
                if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                    $("body").removeClass('sidebar-open');
                }
            });

            //Enable expand on hover for sidebar mini
            if ($.VilderrAdmin.options.sidebarExpandOnHover
                || ($('body').hasClass('fixed')
                && $('body').hasClass('sidebar-mini'))) {
                this.expandOnHover();
            }
        },

        expandOnHover: function () {
            var _this = this;
            var screenWidth = $.VilderrAdmin.options.screenSizes.sm - 1;
            //Expand sidebar on hover
            $('.main-sidebar').hover(function () {
                if ($('body').hasClass('sidebar-mini')
                    && $("body").hasClass('sidebar-collapse')
                    && $(window).width() > screenWidth) {
                    _this.expand();
                }
            }, function () {
                if ($('body').hasClass('sidebar-mini')
                    && $('body').hasClass('sidebar-expanded-on-hover')
                    && $(window).width() > screenWidth) {
                    _this.collapse();
                }
            });
        },
        expand: function () {
            $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
        },
        collapse: function () {
            if ($('body').hasClass('sidebar-expanded-on-hover')) {
                $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
            }
        }
    };

    $.VilderrAdmin.tree = function (menu) {
        var _this = this;
        var animationSpeed = $.VilderrAdmin.options.animationSpeed;
        $(document).off('click', menu + ' li a')
            .on('click', menu + ' li a', function (e) {
                //Get the clicked link and the next element
                var $this = $(this);
                var checkElement = $this.next();

                //Check if the next element is a menu and is visible
                if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
                    //Close the menu
                    checkElement.slideUp(animationSpeed, function () {
                        checkElement.removeClass('menu-open');
                        //Fix the layout in case the sidebar stretches over the height of the window
                        //_this.layout.fix();
                    });
                    checkElement.parent("li").removeClass("active");
                }
                //If the menu is not visible
                else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                    //Get the parent menu
                    var parent = $this.parents('ul').first();
                    //Close all open menus within the parent
                    var ul = parent.find('ul:visible').slideUp(animationSpeed);
                    //Remove the menu-open class from the parent
                    ul.removeClass('menu-open');
                    //Get the parent li
                    var parent_li = $this.parent("li");

                    //Open the target menu and add the menu-open class
                    checkElement.slideDown(animationSpeed, function () {
                        //Add the class active to the parent li
                        checkElement.addClass('menu-open');
                        parent.find('li.active').removeClass('active');
                        parent_li.addClass('active');
                        //Fix the layout in case the sidebar stretches over the height of the window
                        _this.layout.fix();
                    });
                }
                //if this isn't a link, prevent the page from being redirected
                if (checkElement.is('.treeview-menu')) {
                    e.preventDefault();
                }
            });
    };
}