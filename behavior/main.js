(function (_document, _$, _d3) {
	_$(function () {
		_$("[data-toggle = 'tooltip']").tooltip();
		const URL = _document.location.toString();
		if (URL.match("#")) {
			_$(".list-group a[href='#" + URL.split("#")[1] + "']").tab("show");
		}
		_$("#nav-viz a").click(function (event) {
			parent.location.hash = "#" + this.href.split("#")[1];
		});

		// Tableau:
		_$.getJSON("data/tableau.json", function (content) {
			_d3.selectAll(".tableauPlaceholder")
				.data(content)
				.html(function (viz, i) {
					if (viz.name === "") return "";
					else return "<object class = 'tableauViz'>" +
						"<param name = 'alerts' value = 'no'/>" +
						"<param name = 'animate_transition' value = 'no'/>" +
						"<param name = 'customViews' value = 'no'/>" +
						"<param name = 'dataDetails' value = 'no'/>" +
						"<param name = 'device' value = 'desktop'/>" +
						"<param name = 'display_count' value = 'no'/>" +
						"<param name = 'display_overlay' value = 'no'/>" +
						"<param name = 'display_spinner' value = 'yes'/>" +
						"<param name = 'display_static_image' value = 'no'/>" +
						"<param name = 'filter' value = 'publish=yes'/>" +
						"<param name = 'host_url' value = 'https://public.tableau.com/'/>" +
						"<param name = 'language' value = 'es'/>" +
						"<param name = 'linktarget' value = '_blank'/>" +
						"<param name = 'load-order' value = '0'/>" +
						"<param name = 'name' value = '" + viz.name + "'/>" +
						"<param name = 'path' value = ''/>" +
						"<param name = 'showShareOptions' value = 'true'/>" +
						"<param name = 'site_root' value = ''/>" +
						"<param name = 'subscriptions' value = 'no'/>" +
						"<param name = 'tabs' value = 'yes'/>" +
						"<param name = 'toolbar' value = 'top'/>" +
						"<param name = 'tooltip' value = 'yes'/>" +
					"</object>";
				});
			_d3.select("body")
				.append("script")
				.attr("src", "https://public.tableau.com/javascripts/api/viz_v1.js");
		});
	});
})(document, $, d3);
