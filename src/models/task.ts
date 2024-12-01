import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  label: string;
  startTime: Date;
  endTime: Date;
  assignedToEmployeeId: Schema.Types.ObjectId;
  AdminId: Schema.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  label: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  assignedToEmployeeId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Employee",
  },
  AdminId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

export default model<ITask>("Task", TaskSchema);
