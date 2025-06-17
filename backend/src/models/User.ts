import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    name: String,
    email: String,
    password: String,
    createdAt?: Date
    udatedAt?: Date
    comparePassword(candidatePassword: string): Promise<boolean>;
}


const UserSchema: Schema = new Schema (
    
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        }
    },

    {
        timestamps: true
    }

);

// Hash password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password.toString(), salt);
      return next();
    } catch (err) {
      return next(err as any);
    }
  });
  
  // Add method to compare passwords
  UserSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };

  
const User = mongoose.model<IUser> ('User' , UserSchema)
export default User