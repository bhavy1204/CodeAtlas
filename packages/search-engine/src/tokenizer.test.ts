import { tokenize } from "./tokenizer";

console.log(tokenize("function debounce(fn, wait)"));
console.log(tokenize("getUserById"));
console.log(tokenize("fetch_user_data"));
console.log(tokenize("MAX_RETRY_COUNT"));