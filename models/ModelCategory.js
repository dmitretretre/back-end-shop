const ModelMain = require('./ModelMain')

class Category extends ModelMain{
  constructor (id, name, type) {
    super();
    this.id = id;
    this.name = name;
    this.type = type;
}

  static nameTable = 'category';

  static getModule(data) {
return data.map ((row) =>  {
return new Category(
row.id,
row.name,
row.type,
      );
});
  }
}
