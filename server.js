let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');

const cors = require("cors")
require("dotenv").config()

const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel');
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.get("/" , async(req,res) => {
    console.log("Node API")
    msg = `**GET** / - A simple root endpoint that responds with a message.
    **POST** /matrix - Create a new adjacency matrix. Expects a JSON object with a name and matrix in the request body. It saves the matrix and returns the saved matrix.
    **PUT** /changeMatrixElement/:id - Update a specific element in an adjacency matrix. The id in the URL parameter specifies the matrix to update, and the request body should include the value, row, and col of the element to change. It updates the matrix and responds with a success message.
    **DELETE** /delete - Delete one or all adjacency matrices. If no id is provided in the request body, it deletes all matrices. If an id is provided, it deletes the specific matrix with that ID.
    **GET** /allMatrix - Retrieve all adjacency matrices stored in the database and respond with a JSON array of matrices.
    **GET** /getMatrixElement/:id - Retrieve a specific element from an adjacency matrix. The id in the URL parameter specifies the matrix, and the request body should include row and col to specify the element. It responds with the element's value.`
    res.status(201).json({message: msg});
})

app.get('/home', async(req,res) => {
    res.status(201).json({message:"helloWorld"});
})

app.post('/matrix', async (req, res) => {
    try {
      const {name,matrix } = req.body;
      const newMatrix = new Product({
        name,matrix
      });
      const savedMatrix = await newMatrix.save();
      res.status(201).json(savedMatrix);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create adjacency matrix' });
    }
});

app.put("/changeMatrixElement/:id", async (req, res) => {
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

app.delete('/delete', async(req,res) => {
    const { id } = req.body;
    try{
        if(!id){
            await Product.deleteMany({});
            res.json({ message: "All matrices deleted successfully" });
        } else {
            const matrix = await Product.findById(id);

            if (!matrix) {
                return res.status(404).json({ message: "Matrix not found" });
            }
            await matrix.deleteOne();
            res.status(200).json({message: "deleted the matix"})
        }
    } catch(error){
        console.error("error");
        res.status(500).json({message: "Server Error"});
    }
})

app.get("/allMatrix" , async (req,res) => {
    try {
        console.log("In allmatrix function");
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
  
app.get("/getMatrixElement/:id", async (req, res) => {
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