const ConnectDB = require('../database/connectDB');
const Validation = require('../validation/Validation');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class ModelMain {

    constructor(nameTable, getModule, generateAccessToken) {
        this.nameTable = nameTable
        this.getModule = getModule
        this.generateAccessToken = generateAccessToken
    }

    static async all(req, res) {

        try {

            const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable}`);

            const data = result.rows;
            
            if (data.length === 0) {
                res.status(404).json({ error: 'Страница не существует', code: 404 });
            } 
            else {
                const models = await this.GetModule(data);

                if (models.find((elen) => elen.login)) {
                    const { id, login, role } = models.find((elen) => elen.id && elen.login && elen.role)
                    res.status(200).json({
                        id: id,
                        login: login,
                        role: role,
                    });
                }
                else {
                    res.status(200).json(models);
                }
            }
        }
    }

    static async add(req, res) {
        try {

            const DataForm = req.body

            const validationInstance = new Validation(this.nameTable);
            const { error } = validationInstance.validateSchema(DataForm, req);

            if (error) {
                const errors = error.details.map(err => ({
                    message: err.message,
                }));
            
                console.log(errors);
                return res.status(400).json({ errors });
            } else {

                if (req.file) {
                  const nameImg = req.file.destination + Date.now() + '-' + req.file.originalname
                    DataForm.image = nameImg
                    createData(res, DataForm, this.nameTable, this.getModule)
                }
            
                else if (DataForm.login) {
                    const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable} WHERE login = '${DataForm.login}'`)

                    const data = result.rows

                    const models = await this.getModule(data);

                    let login

                    if (models.length === 0) {
                        login = ''
                    }
                    else {
                        const loginFind = models.find((elem) => elem.login);
                        login = loginFind.login
                    }

                    if (login === DataForm.login) {

                        res.status(403).json(
                            {
                                message: 'Такой пользователь ${DataForm.login} уже существует',
                                code: 403
                                })
                    }
                    else {
                        createData(res, DataForm, this.nameTable, this.getModule)
                    }
                }
                else {
                    createData(res, DataForm, this.nameTable, this.getModule)
                }
            }
        
            async function createData(res, DataForm, nameTable, getModule) {
                try {


                    if (DataForm.password) {
                        DataForm.password = crypto.createHash('md5').update(DataForm.password).digest('hex')
                    }

                    const columnNames = Object.keys(DataForm)
                    const values = Object.values(DataForm)

                    const result = await ConnectDB.query(`INSERT INTO ${nameTable} (${columnNames.join(', ')}) VALUES (${values.map((_, index) => '$${ index + 1}').
                    join(', ')}) RETURNING *;`, values)
                    const data = result.rows;

                    const models = await getModule(data);

                    if (DataForm.login) {

                        const { login } = models.find((elem) => elem.login)

                        res.status(201).json({
                            message: `Пользователь ${login} успешно добавлен!`
                        })
                    }
                    else {
                        res.status(201).json(
                            {
                                message: 'Добавление прошло успешно'
                            })
                    }

                } catch (error) {

                    console.error('Ошибка при запросе к базе данных:', error);
                    
                    res.status(500).json({ error: 'Ошибка при запросе к базе данных' });
                }
            }
        }
    }
    
    static async login(req, res) {
        try {
            const DataForm = req.body

            const validationInstance = new Validation(this.nameTable);
            const { error } = validationInstance.validateSchema(DataForm, req);

            if (error) {
                const errors = error.details.map(err => ({
                    message: err.message,
                }));
                return res.status(400).json({ errors });
            }
            else {

                const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable} WHERE login = '${DataForm.login}'`)

                const data = result.rows

                if (data.length > 0) {

                    const findData = data.find((elem) => elem);

                    DataForm.password = crypto.createHash('md5').update(DataForm.password).digest('hex')

                    if (findData.login === DataForm.login && findData.password === DataForm.password) {

                        const AccessToken = this.generateAccessToken(findData.login, findData.role)

                        res.setHeader('Authorization', `Bearer ${accessToken}`);

                        UpdateColumnToken(res, accessToken, findData.login, this.nameTable)

                        res.status(200).json(
                            {
                                accessToken
                            });
                    }
                }

                else {
                    res.status(400).json(
                        {
                            message: 'Вы не ввели неверный логин или пароль',
                            code: 400
                        })
                }
            }
        } catch (error) {

            res.status(500).json({ error: 'Ошибка при запросе к базе данных' });
        }

        async function UpdateColumnToken(res, accessToken, loginForm, nameTable) {
            try {
                await ConnectDB.query(`UPDATE ${nameTable} SET token = $1 WHERE login = $2 RETURNING *`, [accessToken, loginForm])
            }
            catch (error) {
                res.status(500).json({ error: 'Ошибка при запросе к базе данных' });
            }

        }
    }

    static async update (req, res) {
        try {
            const dataForm = req.body;

            const validationInstance = new Validation(this.nameTable);
            const { error } = validationInstance.validateSchema(dataForm, req);
            
            if(error) {
                const errors = error.details.map(err => ({
                    message: err.message,
                }));
                return res.status(400).json({ errors });
            }

            const id = req.params.id;

            const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable}
            WHERE id = ${id}`);

            const data = result.rows;

            if(data.length === 0) {
                res.status(404).json({ error: 'Страница не существует', code: 404 });
            } else {
                const models = await this.getModule(data);
            
            if (models.find((elem) => elem.login)) {
                if (dataForm.old_password && dataForm.new_password) {

                    if (dataForm.old_password === dataForm.new_password) {
                        res.json({'messsage': 'Новый пароль не должен повторять старый'})
                    }
                    else {
                        dataForm.old_password = crypto.createHash('md5').update
                        (dataForm.old_password).digest('hex')
                    }

                    if (data[0].password === dataForm.old_password) {
                        if (dataForm.old_password === '' || dataForm.new_password === '') {
                            res.json({'message': 'Если вы хотите обновить пароль то должны заполнить 2 поля: Старый пароль и Новый пароль'})
                        }
                        else {
                            delete dataForm.old_password;

                            const newPasswordKey = crypto.createHash('md5').update
                            (dataForm.new_password).digest('hex')

                            delete dataForm.new_password
                            dataForm['password'] = newPasswordKey
                            
                            await updateData(res, dataForm. this.nameTable, id)
                        }
                    }
                    else {
                        res.json({'message': 'Старый парль введен не правильно1!'})
                    }
                }
              else {
                await updateData(res, dataForm, this.nameTable, id)
              }
            }
            else {
                await updateData(res, dataForm, this.nameTable, id)
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при запросе к базе данных'});
    }
}


    async function updateData(res, dataForm, nameTable, id) {
const columnNames = Object.keys(dataForm);
       
const nonEmptyColumns = columnNames.filter((column) => dataForm[column]
!== null && dataForm[column] != undefined && dataForm[column] !== '');

const setColumns = nonEmptyColumns.map((column, index) => `${column}=$$
{index + 1}`).join(', ');

const filteredValues = nonEmptyColumns.map((column) => dataForm
[column]);

await ConnectDB.query(`UPDATE ${nameTable} SET ${setColumns} WHERE id=$
{Number(id)} RETURNING *;`, filteredValues);

res.status(200).json({'message': 'Данные обновлены'});
    }

    static async delete(req, res) {
        try {
       const id = req.params.id
       
       const result = await ConnectDB.query(`SELECT FROM ${this.nameTable}
       WHERE id = ${id}`)
        
       const data = result.rows
        
       if (data.length === 0) {
        res.status(404).json({ error: 'Страница не существует', code: 404});
       }
       else {

        const models = await this.getModule(data)

        if (models) {
            await ConnectDB.query(`DELETE FROM ${this.nameTable} WHERE id = $
            {id}`)
            res.status(204).json({'message': 'Удаление прошло успешно'})
        }
        
       }
           
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при запросе к базе данных' });
    }
        }
    
    static async registration(req, res) {
        try {
            const dataForm = req.body;

            const validationInstance = new Validation(this.nameTable);
            const { error } = validationInstance.validateSchema(dataForm, req);

            if (error) {
                const errors = error.details.map(err => ({
                    message: err.message,
                }));
                res.status(400).json({ errors });
            }
        
            const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable} WHERE login = $1`, [dataForm.login]);
            const data = result.rows;

            if (data.length > 0) {
                const models = await this.getModule(data);
                const { login } = models.find((elem) => elem.login);

                if (login === dataForm.login) {
                    res.status(403).json({
                        message: `Такой пользователь ${login} уже существует`,
                        code: 403
                    });
                }
            
            } else {
                dataForm.password = crypto.createHash('md5').update(dataForm.password).digest('hex')
                await ConnectDB.query(`INSERT INTO ${this.nameTable} (login, password, role) VALUES ($1, $2, $3) RETURNING *;`, [dataForm.login, dataForm.password, 'user']);

                res.status(201).json({
                    message: `Пользователь ${dataForm.login} зарегестрирован`
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при запросе к базе данных ' });
        }
    }

    static async logout(req, res) {

        try {
            const tokenHeader = req.header('Authorization');
            const accessToken = tokenHeader.substring('Bearer'.length);

            if (accessToken) {
                await ConnectDB.query(`UPDATE ${this.nameTable} SET token = $2 RETURNING *`, [null, accessToken])

                delete req.headers['Authorization'];

                jwt.verify(accessToken, process.env.YOUR_SECRET_KEY, (err, decoded) => {
                    res.status(401).json(
                        {
                            message: `Пользователь ${decoded.login} разавторизовался`
                        }
                    )
                })
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при запросе к базе данных' });
        }
    ]
}

    static async getProductsByCategoryId(req ,res) {
        try {
            const id = req.params.id;

            const result = await ConnectDB.query(`SELECT * FROM ${this.nameTable}
             WHERE id_category = ${id}`);

             const data = result.rows;

             if (data.length === 0) {
                res.status(404).json({ error: 'Страница не существует', code:
            404 });
             } else {
                const models = await this.getModule(data);
                res.status(200).json(models)
             }
             }
             catch (error) {
                res.status(500).json({ error: 'Оишбка при запросе к базе данных'});
             }
        }
    

    static async refreshToken(req, res) {
        const tokenHeader = req.header('Authorization');
        const accessToken = tokenHeader.substring('Bearer'.length);

        if (!accessToken) {
            return res.sendStatus(401);
        }

        try {
            const existingToken = await ConnectDB.query(`SELECT * FROM ${this.nameTable} WHERE token = $1`, [accessToken])

            if (!existingToken.rows.length) {
                return res.status(401).json({ error: 'Токен не существует' });
            }

            const models = await this.getModule(existingToken.rows);
            const { login, role } = module.find((elem) => elem.login && elem.role);

            const newAccessToken = this.generateAccessToken(login, role);

            await ConnectDB.query(`UPDATE ${this.nameTable} SET token = $1 WHERE token = $2`, [newAccessToken, accessToken]);

            res.header('Authorization', 'Bearer ${newAccessToken}');

            res.status(200).json({
                newAccessToken
            });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения refresh token' });
        }
    }
        

module.exports = ModelMain;
