# Reverse Number Format
You can convert `compact number` to `number`.
## Installation
```bash
npm install reverse-number-format
```
## Basic Usage
```ts
const formattedStr = '39.KM' // 1M 1B 1천 1만 ....

const num = reverseNumberFormat(formattedStr,'en',{notation:'compact'})

console.log(num) // 39500
```
## Api
### `reverseNumberFormat()`
```ts
function reverseNumberFormat(
	formattedNumberStr: string, 
	locale: string, 
	options?: {
    notation: "standard" | "compact";
}): number
```