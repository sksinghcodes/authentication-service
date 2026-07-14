export interface Rules {
  alphabeticUpper?: boolean;
  alphabeticLower?: boolean;
  numeric?: boolean;
  otherCharacters?: string;
}

export const isValidChar = (char: string, rules: Rules) => {
  if (char.length !== 1) {
    return false;
  }

  if (rules.alphabeticUpper && char >= "A" && char <= "Z") {
    return true;
  }

  if (rules.alphabeticLower && char >= "a" && char <= "z") {
    return true;
  }

  if (rules.numeric && char >= "0" && char <= "9") {
    return true;
  }

  if (rules.otherCharacters && rules.otherCharacters.includes(char)) {
    return true;
  }

  return false;
};

export const hasOnlyValidCharacters = (value: string, rules: Rules) => {
  const invalidChars = new Set<string>();

  for (const char of value) {
    if (!isValidChar(char, rules)) {
      invalidChars.add(char);
    }
  }

  return {
    isValid: invalidChars.size === 0,
    invalidChars: Array.from(invalidChars),
  };
};
