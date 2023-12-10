const Joi = require("joi");

class Validation {
  constructor(schemaName) {
    this.schemaName = schemaName;

    this.validateSchema = (data, req) => {
      const schema = this["${this.schemaName}"](data);
      return schema.validate(data, {
        aboutEarly: false,
        context: { route: req.path },
      });
    };

    switch (this.schemaName) {
      case "users":
        this["${this.schemaName}"] = (data) => {
          return Joi.object({
            login: Joi.string().required().messages({
              "string.base": 'Поле "Логин" должно быть строкой',
              "string.empty": 'Поле "Логин" не может быть пустым',
              "any.required": 'Поле "Логин" обязательно для заполнения',
              "any.custom": 'Поле "Логин" обязательно для заполения',
            }),
            password: Joi.string().required().messages({
              "string.base": 'Поле "Пароль" должно быть строкой',
              "string.empty": 'Поле "Пароль" не может быть пустым',
              "any.required": 'Поле "Пароль"обязательно для заполнения',
              "any.custom": 'Поле "Пароль" обязательно для заполнения',
            }),
            old_password: Joi.string().messages({
              'string.base': 'Поле "Старый пороль" должно быть строкой',
            }),
            new_password: Joi.string().messages({
              'string.base': 'Поле "Новый пороль" должно быть строкой',
            }),
            role: Joi.valid("admin", "user")
              .when("$route", {
                is: "/user-add",
                then: Joi.required(),
              })
              .messages({
                "string.base": 'Поле "Роль" должно быть строкой',
                "string.empty": 'Поле "Роль" не может быть пустым',
                "any.required": 'Поле "Роль" обязательно для заполнения',
                "any.only":
                  'Поле "Роль" должно соотвестовать одному из перечисленных значений admin или user',
                "any.custom": 'Поле "Роль" обязательно для заполнения',
              }),
          });
        };
        break;
        
      case "products":
        this["${this.schemaName}"] = (data) => {
          return Joi.object({
            name: Joi.string().required().messages({
              "string.base": 'Поле "Название товара" должно быть строкой',
              "string.empty": 'Поле "Название товара" не может быть пустым',
              "any.required":
                'Поле "Название товара" обязтельно для заполнения',
            }),
            description: Joi.string().allow("").messages({
              "string.base": 'Поле "Описание товара" должно быть строкой',
            }),
            price: Joi.number().precision(2).allow(0).messages({
              "number.base": 'Поле "Цена товара" должно быть десятичным числом',
              "number.empty": 'Поле "Цена товара" не должно быть пустым',
            }),
            id_category: Joi.number().required().messages({
              "number.base": 'Поле "id Товара" должно быть целым числом',
              "string.empty": 'Поле "id Товара" не может быть пустым',
              "any.required": 'Поле "id Товара" обязательно для заполнения',
            }),
            image: Joi.allow(null).messages({
              "number.case": 'Поле "Файл" не может быть пустым.',
              "string.empty": 'Поле "Файл" не может быть пустым.',
              "any.required": 'Поле "Файл" обязательно для заполнения.',
              "object.allowUnknown": 'Поле "Файл" не разрешено.',
              "object.unknown": 'Поле "Файл" не разрешено.',
            }),
          });
        };
        break;

      case "category":
        this["${this.schemaName}"] = (data) => {
          return Joi.object({
            name: Joi.string().required().messages({
              "string.base": 'Поле "Название категории" должно быть строкой',
              "string.empty": 'Поле "Название категории" не может быть пустым',
              "any.required":
                'Поле "Название категории" обязательно для заполнения',
            }),
            description: Joi.string().allow("").messages({
              "string.base": 'Поле "Описание категории" должно быть строкой',
            }),
          });
        };
        break;

      case "orders":
        this["${this.schemaName}"] = (data) => {
          return Joi.object({
            order_list_products: Joi.array()
              .items(Joi.string())
              .required()
              .messages({
                "string.base":
                  'Поле "Список товаров в заказе" должно быть массивом',
                "string.empty":
                  'Поле "Список товаров в заказе" не может быть пустым',
                "any.required":
                  'Поле "Список товаров в заказе" обязательно для заполнения',
              }),
            price: Joi.number().precision(2).required().messages({
              "number.base":
                'Поле "Цена товаров в заказе" должно быть десятичным числом',
              "number.empty":
                'Поле "Цена товаров в заказе" не может быть пустым',
              "any.required":
                'Поле "Цена товаров в заказе" обязательно для заполнения',
            }),
            status: Joi.string()
              .required()
              .valid("В обработке", "Принят", "Откланен")
              .messages({
                "string.base": 'Поле "Статус заказа" должно быть строкой',
                "string.empty": 'Поле "Статус заказа" не может быть пустым',
                "any.required":
                  'Поле "Статус заказа" обязательно для заполнения',
                "any.only":
                  'Поле "Статус заказа" должно соответствовать одному из перечисленных значений В обработке, Принят или Откланен',
              }),
          });
        };
        break;
    }
  }
}
module.exports = Validation;
