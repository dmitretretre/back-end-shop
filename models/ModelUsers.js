const ModelMain = require("./ModelMain");
const jwt = require('jsonwebtoken');
require('dotenv').config();

class Users extends ModelMain {
  constructor(id, login, password, role) {
    super();
    this.id = id;
    this.login = login;
    this.password = password;
    this.role = role;
  }

  static nameTable = "users";

  static getModule(data) {
    return data.map((row) => {

      return new Users(
        row.id,
        row.login,
        row.password,
        row.role,
      );
    });
  }


  static generateAccessToken(login, role) {
    
    const secretKey = process.env.YOUR_SECRET_KEY

    const access = jwt.sing({ login, role }, secretKey, { expiresIn: '10m' });

    return accessToken
  }
}

module.exports = Users;
