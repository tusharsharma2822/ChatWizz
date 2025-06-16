import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, 'First Name must be atleast 3 Character Long']
        },

        lastname: {
            type: String,
            required: true,
            minLength: [3, "Last Name must be atleast 3 Character Long"]
        }
    }, 

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: [5, "Email must be atleast 5 characters long"],
        maxLength: [50, "Email must be atmost 50 characters long"],
    }, 

    password: {
        type: String,
        select: false,
        required: true,
    }
});

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = async function () {
    return jwt.sign(
        {email : this.email},
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
}

const userModel = mongoose.model("user", userSchema);

export default userModel;