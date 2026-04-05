import type { Language } from '../types/execution';

export interface LanguageConfig {
  id: Language;
  name: string;
  extension: string;
  monacoLanguage: string;
  dockerImage: string;
  defaultCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'python',
    name: 'Python 3.12',
    extension: '.py',
    monacoLanguage: 'python',
    dockerImage: 'codeinterview/sandbox-python:3.12',
    defaultCode: `def solution():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solution()`,
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node 20)',
    extension: '.js',
    monacoLanguage: 'javascript',
    dockerImage: 'codeinterview/sandbox-node:20',
    defaultCode: `function solution() {\n  // Write your solution here\n}\n\nsolution();`,
  },
  {
    id: 'java',
    name: 'Java 21',
    extension: '.java',
    monacoLanguage: 'java',
    dockerImage: 'codeinterview/sandbox-java:21',
    defaultCode: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
  },
  {
    id: 'cpp',
    name: 'C++ 17 (GCC 13)',
    extension: '.cpp',
    monacoLanguage: 'cpp',
    dockerImage: 'codeinterview/sandbox-gcc:13',
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  },
  {
    id: 'go',
    name: 'Go 1.22',
    extension: '.go',
    monacoLanguage: 'go',
    dockerImage: 'codeinterview/sandbox-go:1.22',
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("Hello")\n}`,
  },
  {
    id: 'rust',
    name: 'Rust 1.77',
    extension: '.rs',
    monacoLanguage: 'rust',
    dockerImage: 'codeinterview/sandbox-rust:1.77',
    defaultCode: `fn main() {\n    // Write your solution here\n    println!("Hello");\n}`,
  },
];

export const LANGUAGE_MAP = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((lang) => [lang.id, lang])
) as Record<Language, LanguageConfig>;

export const DEFAULT_LANGUAGE: Language = 'python';
