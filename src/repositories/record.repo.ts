import RecordModel, { IRecord, OpName } from "../models/Record";

export async function createRecord(data: Partial<IRecord>) {
  return await RecordModel.create(data);
}

export async function getRecordById(id: string) {
  return await RecordModel.findById(id);
}

export async function deleteRecordById(id: string) {
  return await RecordModel.findByIdAndDelete(id);
}

export interface SearchFilters {
  op?: OpName | string;
  from?: string;
  to?: string;
}

export interface PageOpts {
  page?: number | string;
  limit?: number | string;
}

export async function searchRecords(filters: SearchFilters = {}, page: PageOpts = {}) {
  const { op, from, to } = filters;
  const query: Record<string, any> = {};
  if (op) query.op = op;

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to)   query.createdAt.$lte = new Date(to);
  }

  const pageNum = Math.max(Number(page.page || 1), 1);
  const limit = Math.max(Number(page.limit || 10), 1);
  const skip = (pageNum - 1) * limit;

  const [items, total] = await Promise.all([
    RecordModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    RecordModel.countDocuments(query)
  ]);

  return { items, total, page: pageNum, limit, pages: Math.ceil(total / limit) };
}

export async function deleteAll() {
  const res = await RecordModel.deleteMany({});
  return { deleted: res.deletedCount || 0 };
}
