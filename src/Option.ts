interface Option {
  alias?: string,
  desc: string,
  type: 'boolean' | 'number' | 'string' | 'number[]' | 'string[]',
  default?: boolean | number | string | number[] | string[],
  save?: boolean
}

export default Option;
