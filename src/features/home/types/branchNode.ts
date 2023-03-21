import { Revision } from "./revision";

// ref: https://qiita.com/k-penguin-sato/items/e2791d7a57e96f6144e5#omittk
export type BranchNode = Omit<Revision, 'hash'>