type Zero = "0"
type One = "1"
type Binary = Zero | One
type Group = `${Binary}${Binary}${Binary}`

export type Code = `${Group}-${Group}-${Group}`;

export function codeToDecimal(code: Code) {
  const codeAsBinary = code.split("-").map(item => parseInt(item, 2))

  return codeAsBinary.join("")
}
