const fs = require('fs');
const axios = require('axios');

class Busquedas {
	historial = [];
	dbPath = './db/data.json';

	constructor() {
		this.leerDB();
	}

	get historialCapitalizado() {
		return this.historial.map((e, i) => {
			let palabras = e.split(' ');
			palabras = palabras.map((e) => e[0].toUpperCase() + e.substring(1));
			return palabras.join(' ');
		});
	}

	get paramsMapBox() {
		return {
			access_token: process.env.MAPBOX_KEY,
			limit: 5,
			language: 'es',
		};
	}

	async ciudad(lugar = '') {
		//petición http

		try {
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
				params: this.paramsMapBox,
			});
			const resp = await instance.get();
			return resp.data.features.map((lugar) => ({
				id: lugar.id,
				nombre: lugar.place_name,
				lng: lugar.center[0],
				lat: lugar.center[1],
			}));
		} catch (error) {
			return [];
		}
	}

	get paramsOpenWeather() {
		return { appid: process.env.OPENWEATHER_KEY, units: 'metric', lang: 'es' };
	}

	async climaLugar(lat, lon) {
		try {
			const instance = axios.create({
				baseURL: 'https://api.openweathermap.org/data/2.5/weather',
				params: { ...this.paramsOpenWeather, lat, lon },
			});

			const response = await instance.get();
			const { weather, main } = await response.data;

			return {
				desc: weather[0].description,
				min: main.temp_min,
				max: main.temp_max,
				temp: main.temp,
			};
		} catch (error) {
			console.log(console.error);
		}
	}

	agregarHistorial(lugar = '') {
		//TODO prevenir duplicados
		if (this.historial.includes(lugar.toLocaleLowerCase())) return;
		this.historial = this.historial.splice(0, 5);
		this.historial.unshift(lugar.toLowerCase());
		//Grabar en DB
		this.guardarDb();
	}

	guardarDb() {
		const payload = { historial: this.historial };
		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	leerDB() {
		//Debe de existir

		if (!fs.existsSync(this.dbPath)) {
			return null;
		}

		const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
		const data = JSON.parse(info);
		this.historial = data.historial;
	}
}

module.exports = Busquedas;
