const ModelProducts = require("../models/ModelProducts");

class ProductsController {

  async getProducts(req, res) {
    ModelProducts.all(req, res);
  }
  async getProduct(req, res) {
    ModelProducts.getById(req, res);
  }

async getProductsByIdCategory(req ,res) {
  ModelProducts.getProductsByIdCategory(req ,res)
}

  async addProduct(req, res) {
    ModelProducts.add(req, res);
  }
  
  async updateProduct(req, res) {
    ModelProducts.update(req, res)
  }

  async deleteProduct(req ,res) {
    ModelProducts.delete(req, res)
  }
}
module.exports = ProductsController;
