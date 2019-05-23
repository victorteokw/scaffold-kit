interface BooleanOptionRule {
  alias?: string,
  desc: string,
  type: 'boolean',
  default?: boolean,
  save?: boolean
}

interface StringOptionRule {
  alias?: string,
  desc: string,
  type: 'string',
  default?: string,
  save?: boolean
}

interface NumberOptionRule {
  alias?: string,
  desc: string,
  type: 'number',
  default?: number,
  save?: boolean
}

interface StringArrayOptionRule {
  alias?: string,
  desc: string,
  type: 'string[]',
  default?: string[],
  save?: boolean
}

interface NumberArrayOptionRule {
  alias?: string,
  desc: string,
  type: 'number[]',
  default?: number[],
  save?: boolean
}

type SOptionRule = BooleanOptionRule | StringOptionRule | NumberOptionRule;
type MOptionRule = StringArrayOptionRule | NumberArrayOptionRule;
type OptionRule = SOptionRule | MOptionRule;
export default OptionRule;
