import { GitCommandInput } from "../types/gitCommandInput";

/**
 * git command を実行可能なインタフェースです.
 */
export interface ExecutableGitCommand {
  /**
   * 入力テキストがマッチしている（実行可能）かチェック
   * @param input 入力テキスト
   */
  match(input: string): boolean;
  // TODO: 戻り値は抽象化してコマンドをつけられるようにしていきたい
  /**
   * 入力テキストを実行可能な文字列に変換する
   * @param input 入力テキスト
   */
  parse(input: string): GitCommandInput;
  /**
   * git commandを実行する
   */
  execute(input: GitCommandInput): void;
}

