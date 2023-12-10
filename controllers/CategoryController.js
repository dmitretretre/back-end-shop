const ModelCategory = require("../models/ModelCategory");

class CategoryController {
	async getCategory(req, res) {
		ModelCategory.all(req, res);
	}
	async getCategoryById(req, res) {
		ModelCategory.getCategoryById(req, res);
	}
	async addCategory(req, res) {
		ModelCategory.add(req, res);
	}
	async deleteCategory(req, res) {
		ModelCategory.delete(req, res);
	}
}

module.exports = CategoryController;
