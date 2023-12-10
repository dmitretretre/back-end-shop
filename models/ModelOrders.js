const ModelMain = reqiure ('./ModelMain');

class Orders extends ModelMain{
  constructor (id, number, id_products) {
    super();
    this.id = id;
    this.number = number;
    this.id_products = id_products;
  }

  static nameTable = 'orders';

  static getModule(data) {
    return data.map ((row) => {
return new Orders(
        row.id,
        row.number,
        row.id_products
      );
    });
  }
}
