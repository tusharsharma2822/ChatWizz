import userModel from '../models/user.model.js';



export const createUser = async ({
    email, password, fullname
}) => {

    if (!email || !password || !fullname || !fullname.firstname || !fullname.lastname) {
        throw new Error('Email, password, firstname, and lastname are required');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword,
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        }
    });

    return user;

}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}