import { CommandType } from './commandType'

/**
 * git commandの入力
 */
export type GitCommandInput = {
  /**
   * ブランチ名
   */
  branchName?: string
  /**
   * コミットメッセージ
   */
  commitMessage?: string
  /**
   * ハッシュ値
   */
  hash?: string
  /**
   * コマンドのタイプ
   */
  commandType: CommandType
}
