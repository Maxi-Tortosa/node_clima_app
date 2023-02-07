require('dotenv').config();

const {
	leerInput,
	inquirerMenu,
	inquirerPausa,
	listarLugares,
} = require('./helpers/inquirer');

const Busquedas = require('./models/busquedas');

const main = async () => {
	const busqueda = new Busquedas();

	let opt;

	do {
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				//mostrar mensaje
				const termino = await leerInput('Ciudad: ');
				//buscar lugar
				const lugares = await busqueda.ciudad(termino);
				//seleccionar lugar
				const id = await listarLugares(lugares);

				if (id === '0') continue;

				const lugarSel = lugares.find((lugar) => lugar.id === id);

				//Guardar en db
				busqueda.agregarHistorial(lugarSel.nombre);

				//clima
				const clima = await busqueda.climaLugar(lugarSel.lat, lugarSel.lng);

				// console.log(lugarSel);

				//mostrar resultados
				console.log('\nInformación de la ciudad\n'.green);
				console.log('Ciudad:', lugarSel.nombre);
				console.log('Lat:', lugarSel.lat);
				console.log('Lng:', lugarSel.lng);
				console.log('Descripción:', clima.desc.green);
				console.log('Temperatura:', clima.temp);
				console.log('Mínima:', clima.min);
				console.log('Máxima:', clima.max);

				break;
			case 2:
				busqueda.historialCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;
			case 0:
				break;
		}

		if (opt !== 0) await inquirerPausa();
	} while (opt !== 0);
};

main();
