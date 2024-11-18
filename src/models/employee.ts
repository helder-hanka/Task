import { Schema, model, Document } from "mongoose";
interface IEmployee extends Document {
  name: string;
  AdminId: Schema.Types.ObjectId;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  AdminId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

export default model<IEmployee>("Employee", EmployeeSchema);
