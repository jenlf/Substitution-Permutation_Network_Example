
const SUBMAP = [6,13,1,15,7,12,8,3,2,0,14,10,5,9,11,4];  //my substitution map
const PERMUTATEORDER = [4,2,7,0,5,1,6,3]; //how I am mixing up the bits in an 8 bit value
const KEY = "secretkey!" //needs to be super secret! 10 char

//my blocks are 8 bits
//XOR for each character in plaintext - this will not scale well but it was an easy way to split my key for "key schedule" simulation

function encrypt() {
    let cipherDecimal = [];
    let cipher = [];
    const plaintext = document.getElementById("plaintext").value;

    for (let j = 0; j < plaintext.length; j++) {
        //XOR single letter in plaintext with single key char in order
        let result = plaintext[j].charCodeAt(0) ^ KEY[j % KEY.length].charCodeAt(0);
        //substitute 4 bits of single plaintext at a time  -- use sub map
        let substituteResult = substitute(result.toString());
        //permutate 8 bits of plaintext char
        let permutatedResult = permutate(substituteResult);
        //convert it back to decimal then ascii
        let decimalResult = parseInt(permutatedResult, 2);
        cipherDecimal.push(decimalResult);
        let asciiResult = String.fromCharCode(decimalResult);
        cipher.push(asciiResult);
    } 
    document.getElementById("decryptPlaintext").value = cipher.join('');
}

function decrypt() {
    let decryptedPlaintext = [];
    const inputText = document.getElementById("decryptPlaintext").value;

    for (let n = 0; n < inputText.length; n++) {
        //get from field & convert to ascii
        let result = inputText[n].charCodeAt(0);
        //convert it to 8 bit binary
        let binary8Bit = decimalToBinary(result, 8);
        //reverse permutate it
        let reversePermutateVal = reversePermutate(binary8Bit);
        //reverse substitute it
        let reversedSubstituteVal = reverseSubstitute(reversePermutateVal);
        //XOR with key
        let decryptResult = String.fromCharCode(reversedSubstituteVal ^  KEY[n % KEY.length].charCodeAt(0));
        decryptedPlaintext.push(decryptResult);
    }
    document.getElementById("showDecrypted").innerHTML = decryptedPlaintext.join('');
}


function substitute(charResult) {
    //split the 8 bits
    let bitsToSplit = decimalToBinary(charResult, 8);
    let [leftBits, rightBits] = [bitsToSplit.substring(0,4), bitsToSplit.substring(4)];

    //check it against map
    let substitutedLeftBits = decimalToBinary(SUBMAP[parseInt(leftBits, 2)], 4);
    let substitutedRightBits = decimalToBinary(SUBMAP[parseInt(rightBits, 2)], 4);
    //make sure both substitutions are 4 bits, pad with 0s if not
    //append bits back together & return
    let substituted8Bits = substitutedLeftBits + substitutedRightBits;
    return substituted8Bits;
}

function reverseSubstitute(binaryString) {
    let [leftBits, rightBits] = [binaryString.substring(0,4), binaryString.substring(4)];

    //convert them to decimal
    let decimalToSubLeftBits = parseInt(leftBits, 2);
    let decimalToSubRightBits = parseInt(rightBits, 2);
    //look them up in the array
    let reversedSubLeftBits = decimalToBinary(SUBMAP.indexOf(decimalToSubLeftBits), 4);
    let reversedSubRightBits = decimalToBinary(SUBMAP.indexOf(decimalToSubRightBits), 4);

    //convert it back to char & return
    let reversedBits = reversedSubLeftBits + reversedSubRightBits;
    return parseInt(reversedBits, 2);
}

function permutate(binaryValue) {
    let rearrangedValue = "";
    for (let m = 0; m < PERMUTATEORDER.length; m++) {
        const newIndex = PERMUTATEORDER[m];
        rearrangedValue += binaryValue[newIndex];
    }
    return rearrangedValue;
}

function reversePermutate(binaryValue) {
    var rearrangedValue = [0,0,0,0,0,0,0,0];
    for (let m = 0; m < binaryValue.length; m++) {
        if (binaryValue[m] === '1') {
            rearrangedValue[PERMUTATEORDER[m]] = binaryValue[m];
        }
    }
    return rearrangedValue.join('');
}


function decimalToBinary(decimal, numBits) {
    let binaryToBePadded = (decimal >>> 0).toString(2);

    //pad the binary with 0s as needed
    if (numBits === 4) {
        while (binaryToBePadded.length < 4) {
            binaryToBePadded = '0' + binaryToBePadded;
        }
    }
    if (numBits === 8) {
        while (binaryToBePadded.length < 8) {
            binaryToBePadded = '0' + binaryToBePadded;
        }
    }
    return binaryToBePadded;
}