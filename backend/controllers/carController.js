const Car = require('../models/Car');


exports.createCar = async (req, res) => {
  try {
  
    const car = await Car.create({ ...req.body, owner: req.user.id });
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getCars = async (req, res) => {
  try {
    const { brand, fuelType, maxPrice } = req.query;
    let query = { isAvailable: true };

    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;
    if (maxPrice) query.pricePerDay = { $lte: Number(maxPrice) };

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
    );

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    await car.deleteOne();
    res.json({ message: "Car removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};