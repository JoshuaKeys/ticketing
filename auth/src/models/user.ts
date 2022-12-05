import { compare, genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import mongoose, { Document, Model, model, Schema } from "mongoose";

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
    email: string;
    password: string;

}

// An interface that describes the properties
// that a User Model has
interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
    email: string;
    password?: string;
    createdAt: Date;
    matchPassword(password: string): boolean
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        maxlength: 20,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // toJSON: {
    //     transform: function(doc, ret) {
    //         ret.id = ret._id;
    //         delete ret._id;
    //         delete ret.__v;
    //     }
    // }
})

// Encrypt password using bcrypt
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    }
})
// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return sign({id: this._id}, 'shhhhh')
}
userSchema.methods.matchPassword = async function (password: string) {
    const isMatched = await compare(password, this.password);
    return isMatched;
}

const User = model<UserDoc, UserModel>('User', userSchema)




export { User };