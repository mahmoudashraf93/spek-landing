export const MAX_CHARS = 500;
export const SESSION_DAILY_LIMIT = 10;
export const IP_DAILY_LIMIT = 30;
export const MINUTE_LIMIT = 3;
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
];

export function validTranslation(input) {
  if (!input || typeof input.text !== 'string' || !input.text.trim()) return false;
  if (Array.from(input.text).length > MAX_CHARS) return false;
  const codes = LANGUAGES.map(({ code }) => code);
  return codes.includes(input.source) && codes.includes(input.target)
    && input.source !== input.target && (input.source === 'en' || input.target === 'en')
    && /^[0-9a-f-]{36}$/i.test(input.requestId || '')
    && typeof input.token === 'string' && input.token.length > 0 && input.token.length <= 2048;
}

// Pure admission logic, also exercised with concurrent requests against the real ledger.
export function admit(current, { chars, dailyCap, monthlyCap }) {
  if (!Number.isSafeInteger(dailyCap) || dailyCap <= 0 || !Number.isSafeInteger(monthlyCap) || monthlyCap <= 0) {
    return { status: 503, error: 'The translator is temporarily unavailable. Please try again later.' };
  }
  if (current.sessionMinute >= MINUTE_LIMIT || current.ipMinute >= MINUTE_LIMIT) {
    return { status: 429, error: 'Please wait a minute before translating again.', retry: 60 };
  }
  if (current.sessionDay >= SESSION_DAILY_LIMIT || current.ipDay >= IP_DAILY_LIMIT) {
    return { status: 429, error: 'Your free daily allowance is used up. Please come back tomorrow.', retry: 86400 };
  }
  if (current.dayChars + chars > dailyCap || current.monthChars + chars > monthlyCap) {
    return { status: 503, error: 'The shared free allowance is used up. Please try again later.', retry: 3600 };
  }
  return null;
}

export function decodeTranslation(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (whole, entity) => {
    if (entity[0] !== '#') return entities[entity.toLowerCase()] || whole;
    const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : whole;
  });
}
