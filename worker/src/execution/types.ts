export enum Language {
  PYTHON = 'PYTHON',
  JAVASCRIPT = 'JAVASCRIPT',
  TYPESCRIPT = 'TYPESCRIPT',
  JAVA = 'JAVA',
  CPP = 'CPP',
  CSHARP = 'CSHARP',
  GOLANG = 'GOLANG',
  RUST = 'RUST',
  RUBY = 'RUBY'
}

export interface ILanguageExecutor {
  execute(request: any): Promise<any>;
}
