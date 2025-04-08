import { model, models, Schema } from "mongoose"

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    bio: String,
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [{
        type: Schema.Types.ObjectId,
        ref: 'Community'
    }],
})

const User = models.User || model('User', UserSchema)

export default User