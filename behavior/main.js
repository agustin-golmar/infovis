"use strict";

(function (_document, _$) {
	_$(function () {
		_$("[data-toggle = 'tooltip']").tooltip();
		const URL = _document.location.toString();
		if (URL.match("#")) {
			_$(".list-group a[href='#" + URL.split("#")[1] + "']").tab("show");
		}
		_$("#nav-viz a").click(function (event) {
			parent.location.hash = "#" + this.href.split("#")[1];
		});
	});
})(document, $);
