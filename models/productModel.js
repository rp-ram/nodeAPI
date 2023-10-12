const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema(
    {
        matrix: {
            type: [[Number]], 
            required: true,
        }
    }, 
    {
        timestamp : true
    }
)

const Product = mongoose.model("Product",ProductSchema);

module.exports = Product;