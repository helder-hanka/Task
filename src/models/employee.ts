import { Schema, model, Document } from "mongoose";

interface IEmployee {
  name: string;
  AdminId: Schema.Types.ObjectId;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: true,
  },
  AdminId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

export default model<IEmployee>("Employee", EmployeeSchema);