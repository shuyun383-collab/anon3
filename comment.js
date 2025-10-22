import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  deleteHash: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Comment', commentSchema);
