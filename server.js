require("dotenv").config()

const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.post('/matrix', async (req, res) => {
    try {
      const { matrix } = req.body;
      const newMatrix = new Product({
        matrix
      });
      const savedMatrix = await newMatrix.save();
      res.status(201).json(savedMatrix);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create adjacency matrix' });
    }
});

app.put("/changeMatrix/:id", async (req, res) => {
    const { id } = req.params;
    const { value, row, col } = req.body;

    try {
        const matrix = await Product.findById(id);

        if (!matrix) {
        return res.status(404).json({ message: "Matrix not found" });
        }

        if (row < 0 || row >= matrix.matrix.length || col < 0 || col >= matrix.matrix[row].length) {
        return res.status(400).json({ message: "Invalid coordinates" });
        }

        matrix.matrix[row][col] = value;
        await matrix.save();

        res.json({ message: "Coordinate updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/allMatrix" , async (req,res) => {
    try {
        const allMatrix = await Product.find({});

        if(!allMatrix)
        {
            return res.status(404).json({ message : "No matrix found"});
        }

        res.status(201).json(allMatrix);

    } catch (error) {
        return res.status(500).json({message : "Server Error"})
    }
})
  
app.get("/matrixElement/:id", async (req, res) => {
    const { id } = req.params;
    const { row, col } = req.body;

    try {
        const matrix = await Product.findById(id);

        if (!matrix) {
        return res.status(404).json({ message: "Matrix not found" });
        }

        if (row < 0 || row >= matrix.matrix.length || col < 0 || col >= matrix.matrix[row].length) {
        return res.status(400).json({ message: "Invalid coordinates" });
        }

        x = matrix.matrix[row][col];

        res.json({ message: x });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

mongoose.connect(process.env.MONGO_DB)
.then(() => {
    console.log("Connected to mongoDB")
}).catch((error) => {
    console.log(error.message)
})

app.listen(3000, (() => {
    console.log("hello")
}))