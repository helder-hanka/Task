import mongoose from "mongoose";

export default {
  objIdIsV: (id: string): boolean | undefined => {
    if (mongoose.Types.ObjectId.isValid(id)) return true;
  },
};
