(function($){  
	$.fn.accordionEx = function(options) {  

		var active = $()

		var defaults = {
			active: 0,
			animated: "slide",
			animationTime: 350,
			collapsible: false,
			event: "click",
			header: "> li > :first-child,> :not(li):even",
			heightStyle: "auto",
			icons: {
				activeHeader: "ui-icon-triangle-1-s",
				header: "ui-icon-triangle-1-e"
			},
			
			// callbacks
			activate: null,
			beforeActivate: null
		}
		var options = $.extend(defaults, options)

		return this.each(function() {  
			$(this).addClass("ui-accordion ui-widget ui-helper-reset ui-accordion-icons")
			$(this).children().each(function(){
				createIcons($(this).children().first())
				$(this).children().first().
					addClass("ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top").
					attr({ "aria-expanded": "true", "aria-selected": "true", tabIndex: 0 }).
					click(function(e){
						var expanded = $(this).attr("aria-expanded")
						if (expanded == "true" && options.icons){
							$(this).attr("aria-expanded","false").
								removeClass("ui-state-active").removeClass("ui-corner-top").addClass("ui-corner-all").
								children().first().removeClass(options.icons.activeHeader).addClass(options.icons.header)
							$(this).next().hide(options.animationTime)
						}else{
							$(this).attr("aria-expanded","true").
								removeClass("ui-corner-all").addClass("ui-state-active").addClass("ui-corner-top").
								children().first().removeClass(options.icons.header).addClass(options.icons.activeHeader)
							$(this).next().show(options.animationTime)
						}
						e.preventDefault()
						return false
					}).click().
					next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active")
			})
		})
		function createIcons(t) {
			var icons = options.icons;
			if ( icons ) {
				$( "<span>" )
					.addClass( "ui-accordion-header-icon ui-icon " + icons.activeHeader )
					.prependTo($(t));
			}
		}

	}
})(jQuery)
