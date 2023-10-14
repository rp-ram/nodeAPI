const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
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