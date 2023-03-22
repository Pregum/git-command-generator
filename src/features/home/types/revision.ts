export type Revision = {
  label: string;
  branchId?: string;
  hash?: string;
  parentId: string;
  merge1Id?: string;
  merge2Id?: string;
};
