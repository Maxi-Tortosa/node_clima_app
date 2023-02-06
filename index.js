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
				const lugarSel = lugares.find((lugar) => lugar.id === id);

				//clima
				//mostrar resultados
				console.log('\nInformación de la ciudad\n'.green);
				console.log('Ciudad:', lugarSel.nombre);
				console.log('Lat:', lugarSel.lat);
				console.log('Lng:', lugarSel.lng);
				console.log('Temperatura:');
				console.log('Mínima:');
				console.log('Máxima:');

				break;
			case 2:
				break;
			case 0:
				break;
		}

		if (opt !== 0) await inquirerPausa();
	} while (opt !== 0);
};

main();
