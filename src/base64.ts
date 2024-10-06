// prettier-ignore
const base64byteToCharArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
// prettier-ignore
const base64charToByteMap: {[key: string]: number} = {A: 0b000000,B: 0b000001,C: 0b000010,D: 0b000011,E: 0b000100,F: 0b000101,G: 0b000110,H: 0b000111,I: 0b001000,J: 0b001001,K: 0b001010,L: 0b001011,M: 0b001100,N: 0b001101,O: 0b001110,P: 0b001111,Q: 0b010000,R: 0b010001,S: 0b010010,T: 0b010011,U: 0b010100,V: 0b010101,W: 0b010110,X: 0b010111,Y: 0b011000,Z: 0b011001,a: 0b011010,b: 0b011011,c: 0b011100,d: 0b011101,e: 0b011110,f: 0b011111,g: 0b100000,h: 0b100001,i: 0b100010,j: 0b100011,k: 0b100100,l: 0b100101,m: 0b100110,n: 0b100111,o: 0b101000,p: 0b101001,q: 0b101010,r: 0b101011,s: 0b101100,t: 0b101101,u: 0b101110,v: 0b101111,w: 0b110000,x: 0b110001,y: 0b110010,z: 0b110011,"0": 0b110100,"1": 0b110101,"2": 0b110110,"3": 0b110111,"4": 0b111000,"5": 0b111001,"6": 0b111010,"7": 0b111011,"8": 0b111100,"9": 0b111101,"+": 0b111110,"/": 0b111111};

function base64charToByte(char: string): number {
  if (char in base64charToByteMap) {
    return base64charToByteMap[char];
  } else {
    throw new Error(`Unable to convert character "${char}" to byte`);
  }
}

function base64byteToChar(value: number): string {
  if (value < base64byteToCharArray.length) {
    return base64byteToCharArray[value];
  } else {
    throw new Error(`Unable to convert number ${value} to char`);
  }
}

function eightBitTripleToSixBitQuad(
  a: number,
  b: number,
  c: number
): [number, number, number, number] {
  return [
    (a & 0b11111100) >> 2,
    ((a & 0b00000011) << 4) | ((b & 0b11110000) >> 4),
    ((b & 0b00001111) << 2) | ((c & 0b11000000) >> 6),
    (c & 0b00111111) >> 0,
  ];
}

function base64EncodeTriple(a: number, b?: number, c?: number) {
  const [b1, b2, b3, b4] = eightBitTripleToSixBitQuad(a, b || 0, c || 0);
  if (b === undefined && c === undefined) {
    return [base64byteToChar(b1), base64byteToChar(b2), "=", "="];
  }
  if (c === undefined) {
    return [
      base64byteToChar(b1),
      base64byteToChar(b2),
      base64byteToChar(b3),
      "=",
    ];
  }
  return [
    base64byteToChar(b1),
    base64byteToChar(b2),
    base64byteToChar(b3),
    base64byteToChar(b4),
  ];
}

export function base64encode(data: Uint8Array): string {
  const result: string[] = [];
  for (let i = 0; i < data.length - 2; i += 3) {
    result.push(...base64EncodeTriple(data[i], data[i + 1], data[i + 2]));
  }
  if (data.length % 3 == 2) {
    result.push(
      ...base64EncodeTriple(data[data.length - 2], data[data.length - 1])
    );
  }
  if (data.length % 3 == 1) {
    result.push(...base64EncodeTriple(data[data.length - 1]));
  }

  return result.join("");
}

function base64DecodeQuad(a: string, b: string, c: string, d: string) {
  const [b1, b2, b3] = sixBitQuadToEightBitTriple(
    base64charToByte(a),
    base64charToByte(b),
    c === "=" ? 0 : base64charToByte(c),
    d === "=" ? 0 : base64charToByte(d)
  );
  if (c === "=" && d === "=") {
    return [b1];
  } else if (d === "=") {
    return [b1, b2];
  }
  return [b1, b2, b3];
}

export function base64decode(data: string): Uint8Array {
  const result: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    result.push(
      ...base64DecodeQuad(data[i], data[i + 1], data[i + 2], data[i + 3])
    );
  }
  return new Uint8Array(result);
}

function sixBitQuadToEightBitTriple(
  a: number,
  b: number,
  c: number,
  d: number
): [number, number, number] {
  return [
    ((a & 0b111111) << 2) | ((b & 0b110000) >> 4),
    ((b & 0b001111) << 4) | ((c & 0b111100) >> 2),
    ((c & 0b000011) << 6) | ((d & 0b111111) >> 0),
  ];
}
