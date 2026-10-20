
const Table = require('../models/Table');

const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
};

const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: 'Table number and capacity are required' });
    }

    const existingTable = await Table.findOne({ tableNumber });

    if (existingTable) {
      return res.status(400).json({ message: `Table ${tableNumber} already exists` });
    }

    const table = await Table.create({
      tableNumber: Number(tableNumber),
      capacity: Number(capacity)
    });

    res.status(201).json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create table' });
  }
};

const updateTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (tableNumber) {
      const duplicate = await Table.findOne({
        tableNumber: Number(tableNumber),
        _id: { $ne: req.params.id }
      });

      if (duplicate) {
        return res.status(400).json({ message: `Table ${tableNumber} already exists` });
      }

      table.tableNumber = Number(tableNumber);
    }

    if (capacity) {
      table.capacity = Number(capacity);
    }

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update table' });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete table' });
  }
};

module.exports = {
  getTables,
  createTable,
  updateTable,
  deleteTable
};
