const ModelOrdery = require("../models/ModelOrders");

class OrderyController {
	async getOrdery(req, res) {
		ModelOrdery.all(req, res);
	}
	async addOrdery(req, res) {
		ModelOrdery.add(req, res);
	}
	async deleteOrdery(req, res) {
		ModelOrdery.delete(req, res);
	}
}

module.exports = OrderyController;
