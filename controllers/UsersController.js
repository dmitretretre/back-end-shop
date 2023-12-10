const ModelUsers = require("../models/modelUsers");

class UsersController {
	async getUsers(req, res) {
		ModelUsers.all(req, res);
	}

	async getUser(req, res) {
		ModelUsers.getByLogin(req, res);
	}
	async addUsers(req, res) {
		ModelUsers.add(req, res);
	}

	async UserLogin(req, res) {
		ModelUsers.login(req, res);
	}

	async UserRegistration(req, res) {
		ModelUsers.registration(req, res);
	}

	async UserLogout(req, res) {
		ModelUsers.logout(req, res);
	}

	async refreshToken(req, res) {
		ModelUsers.refreshToken(req, res);
	}
	async deleteUsers(req ,res) {
		ModelUsers.delete(req, res);
	}
}

module.exports = UsersController;
