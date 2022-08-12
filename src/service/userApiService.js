import db from '../models/index';
import { checkEmailExist, checkPhoneExist, hashUserPassword } from './loginRegisterService';

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"], },
        });
        if (users) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'get data success',
                EC: 0,
                DT: []
            }
        }
    } catch (e) {
        console.log(e);
        return {
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"] },
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }

        return {
            EM: 'fetch ok',
            EC: 0,
            DT: data
        }

    } catch (e) {
        console.log(e);
        return {
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const createNewUser = async (data) => {
    try {
        // check email, phone number 
        let isEmailExist = await checkEmailExist(data.email);
        if(isEmailExist === true) {
            return {
                EM: 'The email is already exist',
                EC: 1,
                DT: 'email'
            }
        }
        let isPhoneExist = await checkPhoneExist(data.phone);
        if(isPhoneExist === true) {
            return {
                EM: 'The phone is already exist',
                EC: 1,
                DT: 'phone'
            }
        }
        // hash user password   
        let hashPassword = hashUserPassword(data.password);

        await db.User.create({ ...data, password: hashPassword }); 
        return {
            EM: 'create ok',
            EC: 0,
            DT: [],
        }
    } catch (e) {
        console.log(e);
    }
}

const updateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        })
        if (user) {
            //update
            await user.update({
                username: data.username, 
                address: data.address, 
                sex: data.sex, 
            })

            return { 
                EM: 'Update user succeeds',
                EC: 0,
                DT: '',
            }
        } else {
            //not found
            return { 
                EM: 'User not found',
                EC: 2,
                DT: ''
            }
        }
    } catch (e) {
        console.log(e);
        return { 
            EM: 'something wrongs with services',
            EC: 1,
            DT: []
        }
    }
}

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        })

        if (user) {
            await user.destroy();
            return {
                EM: 'Delete user succeeds',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'User not exist',
                EC: 2,
                DT: data
            }
        }

    } catch (e) {
        console.log(e);
        return {
            EM: 'error from service',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserWithPagination,
    createNewUser
}