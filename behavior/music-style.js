
	/**
	* Trabajo Práctico de Visualización de Información.
	*/

const app = {
	artists : [],
	popover : {
		animation : true,
		container : "#popover",
		html : true,
		placement : "auto",
		sanitize : true,
		trigger : "hover"
	},
	stats : [],
	view : "Ver marcas y colores"
};

const API = {
	tokenType : undefined,

	accessToken : undefined,

	authenticate : async function (_error, _success) {
		const that = this;
		await $.ajax({
			method : "POST",
			url : "https://accounts.spotify.com/api/token?grant_type=client_credentials",
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			headers : {
				"Authorization" : "Basic Y2IxYWRjMzU4MWQwNGZhYmE0YWJjNGEyMmNhMDVkZjY6MWE1YWE4MWMzMjRhNGNiNjgwODQwZmJkYmYyNjgxM2Q"
			},
			error : _error,
			success : function (_data) {
				that.tokenType = _data.token_type;
				that.accessToken = _data.access_token;
				_success(_data);
			}
		});
	},

	artist : async function (_id, _error) {
		const that = this;
		let data = {};
		await $.ajax({
			method : "GET",
			url : `https://api.spotify.com/v1/artists/${_id}`,
			headers : {
				"Authorization" : `${that.tokenType} ${that.accessToken}`
			},
			error : _error,
			success : function (_data) {
				data = _data;
			}
		});
		return data;
	},

	format : function (_value) {
		if (1E+9 <= _value) return `${Math.floor(_value/1E+9)} G`;
		if (1E+6 <= _value) return `${Math.floor(_value/1E+6)} M`;
		if (1E+3 <= _value) return `${Math.floor(_value/1E+3)} K`;
		else return _value;
	},

	json : async function (_filename) {
		let data = {};
		await $.getJSON(`../data/${_filename}.json`, function (_data) {
			data = _data;
		});
		return data;
	},

	search : async function (_name, _error) {
		const that = this;
		let data = {};
		await $.ajax({
			method : "GET",
			url : `https://api.spotify.com/v1/search?query=${_name}&type=artist&offset=0&limit=1`,
			headers : {
				"Authorization" : `${that.tokenType} ${that.accessToken}`
			},
			error : _error,
			success : function (_data) {
				data = _data;
			}
		});
		return data;
	},

	updateStats : function (result) {
		app.stats = [result.length, 0, 0, 0];
		for (let i = 0; i < result.length; ++i) {
			const k = result[i].getAttribute("data-index");
			const artist = app.artists[k];
			if (artist.listen === 1) ++app.stats[1];
			app.stats[2] += artist.lp;
			app.stats[3] += artist.ep;
		}
		app.stats[1] = app.stats[0] === 0?
			0 : Math.floor(100.0 * app.stats[1] / app.stats[0]);
		$("#stats-total").text(app.stats[0]);
		$("#stats-listen").text(`${app.stats[1]} %`);
		$("#stats-lp").text(app.stats[2]);
		$("#stats-ep").text(app.stats[3]);
	}
};

$(async function () {
	// Obtener nombres de artistas:
	app.artists = await API.json("music");

	// Generar visualización:
	const element = $("#artists");
	for (let i = 0; i < app.artists.length; ++i) {
		const artist = app.artists[i];
		const voice = artist.voice.toLowerCase();
		const type = artist.type.toLowerCase();
		const title =
			`<span class = 'voice ${voice} spinner-grow spinner-grow-sm'></span>
			${artist.name}
			<small class = 'align-middle float-right'><b>↑ ${artist.popularity}</b></small>
			<br>
			<small class = 'align-middle'>(${artist.start} - ${artist.end})</small>
			<small class = 'align-middle float-right'>${artist.listen === 1? "<img src = '../image/icon/music.svg'>" : ""}</small>`;
		const content =
			`<span>
				<img class = 'artist-detail' src = '${artist.images[0].url}'>
				<ul class = 'artist-detail pl-4'>
					<li><b>País de Origen:</b> ${artist.country}</li>
					<li><b>Seguidores en Spotify™:</b> ${API.format(artist.followers)}</li>
					<li><b>LPs (<i>long-play</i>):</b> ${artist.lp}</li>
					<li><b>EPs (<i>extended-play</i>):</b> ${artist.ep}</li>
				</ul>
				<hr>
				<small><b>Géneros:</b> ${artist.genres.join(", ")}.</small>
			</span>`;
		element.append(
			`<a class = "artist-link ${type} ${voice}" style = "background-color:white;" href = "${artist.spotify}" target = "_blank" data-index = "${i}">
				<img class = "artist" src = "${artist.images[0].url}" title = "${title}"
					data-content = "${content}"
					data-toggle = "popover">
				${artist.listen === 1? "<img class = 'listen-mark' src = '../image/icon/music.svg'>" : ""}
			</a>`
		);
	}

	// Activar popovers sobre cada artista:
	$(".artist").popover(app.popover);

	// Mostrar colores o fotos de artistas:
	$("#view").click(function () {
		if (app.view === "Ver marcas y colores") {
			app.view = "Ver artistas y tarjetas";
			$(".artist").css("z-index", -1);
			$(".listen-mark").show();
			$(this).removeClass("btn-danger").addClass("btn-warning");
		}
		else {
			app.view = "Ver marcas y colores";
			$(".artist").css("z-index", 0);
			$(".listen-mark").hide();
			$(this).removeClass("btn-warning").addClass("btn-danger");;
		}
		$(this).text(app.view);
	});

	// Filtrar artistas según voz y tipo y actualizar estadísticas:
	$("#voice,#type").change(function () {
		const voice = $("#voice").val();
		const type = $("#type").val();
		const elements = $("#artists a");
		elements.fadeTo(500, 1);
		let filter = "";
		if (voice !== "todas") filter += `.${voice}`;
		if (type !== "todas") filter += `.${type}`;
		if (filter !== "") {
			const result = elements.filter(filter);
			API.updateStats(result);
			const toFade = elements.not(filter);
			toFade.fadeTo(1500, 0.15);
		}
		else {
			$("#stats-total").text(app.artists.length);
			$("#stats-listen").text("60 %");
			$("#stats-lp").text(876);
			$("#stats-ep").text(557);
		}
	});
});
