import { Schema, model, Document, Model } from "mongoose";

export type OpName =
  | "add" | "sub" | "mul" | "div"
  | "pow" | "sqrt" | "percent" | "fact";

export interface IRecord extends Document {
  op: OpName;
  a: number;
  b?: number;
  result?: number;
  ok: boolean;
  error?: string;
  meta?: {
    ip?: string;
    userAgent?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    op: { type: String, required: true, enum: ["add","sub","mul","div","pow","sqrt","percent","fact"] },
    a: { type: Number, required: true },
    b: { type: Number },
    result: { type: Number },
    ok: { type: Boolean, default: true },
    error: { type: String },
    meta: {
      ip: String,
      userAgent: String
    }
  },
  { timestamps: true }
);

recordSchema.index({ createdAt: -1 });

const RecordModel: Model<IRecord> = model<IRecord>("Record", recordSchema);
export default RecordModel;
