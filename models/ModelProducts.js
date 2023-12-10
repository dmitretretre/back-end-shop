const ModelMain = require('./ModelMain');

class Products extends ModelMain{
  constructor(id, name, description, price, id_category) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.id_category = id_category;
}

  static nameTable = 'products';

  static getModule(data) {
    return data.map ((row) => {
    return new Products(
    row.id,
    row.name,
    row.description,
    row.price,
    row.id_category,
    );
    });
  }
}
