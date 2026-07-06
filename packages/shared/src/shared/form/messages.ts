export const VALIDATION_MESSAGES = {
  required: '필수 입력 항목입니다.',
  email: '올바른 이메일 형식으로 입력해주세요.',
  pattern: '형식에 맞게 입력해주세요.',
  minLength: (length: number) => `${length}자 이상 입력해주세요.`,
  maxLength: (length: number) => `${length}자 이하로 입력해주세요.`,
  min: (value: number) => `${value} 이상 입력해주세요.`,
  max: (value: number) => `${value} 이하로 입력해주세요.`,
} as const;
