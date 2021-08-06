const routes = require("express").Router();
const fs = require("fs");

const path = require('path');
const dataPath = path.join(__dirname, '../cars/cars.json');

routes.get("/", (req, res) => { return res.json({ text: "Hello World!" }); });
routes.get('/cars/read', (req, res) => {
	const users = getCarsData()
	res.json({"result": true, "data": users});
});

routes.post('/cars/create', (req, res) => {
	const existCar = getCarsData();

	const { placa, chassi, renavam, modelo, marca, ano } = req.body;

	if (placa == null || chassi == null || renavam == null || modelo == null || marca == null || ano == null) {
		return res.status(401).send({ success: false, msg: 'User data missing' });
	}

	//check if the placa, chassi, renavam exist already
	const findExist = existCar.find(car => car.placa === placa || car.chassi === chassi || car.renavam === placa);
	if (findExist) {
		return res.status(409).send({ success: false, msg: 'car already exist' });
	}

	existCar.push({
		"placa": placa,
		"chassi": chassi,
		"renavam": renavam,
		"modelo": modelo,
		"marca": marca,
		"ano": ano
	});

	//save the new car data
	saveCarData(existCar);
	res.send({ success: true, msg: 'User data added successfully' });
});

routes.put('/cars/update/:id', (req, res) => {
	const id = req.params.id;
	const { placa, chassi, renavam, modelo, marca, ano } = req.body;

	const existCar = getCarsData();
	const findExist = existCar.find(car => car.placa === id);

	if (!findExist) {
		return res.status(409).send({ success: false, msg: 'placa not exist' });
	}

	const updateCar = existCar.filter(car => car.placa !== id);

	updateCar.push({
		"placa": placa,
		"chassi": chassi,
		"renavam": renavam,
		"modelo": modelo,
		"marca": marca,
		"ano": ano
	});

	saveCarData(updateCar);

	res.send({ success: true, msg: 'Car data updated successfully' });
});

routes.delete('/cars/delete/:id', (req, res) => {
	const id = req.params.id;

	const existCars = getCarsData()

	//filter the cardata to remove it
	const filterCar = existCars.filter(car => car.placa !== id);
	if (existCars.length === filterCar.length) {
		return res.status(409).send({ success: false, msg: 'placa does not exist' })
	}

	saveCarData(filterCar)
	res.send({ success: true, msg: 'Car removed successfully' })
});

const saveCarData = (data) => {
	const stringifyData = JSON.stringify(data)
	fs.writeFileSync(dataPath, stringifyData)
}

const getCarsData = () => {
	const jsonData = fs.readFileSync(dataPath)
	return JSON.parse(jsonData)
}

module.exports = routes;