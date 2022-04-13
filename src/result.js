export default function handleResult (result, indexOfDecimal, roundResult, toScientificNotation) {
 
    if (
        // if result has decimal and number of digits preceding decimal is less 
        // than 12, round based on number of digits preceding decimal
        indexOfDecimal !== -1 && 
        result.length > 11 &&
        result.slice(0, indexOfDecimal).length <= 11
    ) {

        result = roundResult(result, indexOfDecimal);
        return result;

    } else if (
        // if result has decimal and is longer than 13 characters, or result doesn't have decimal and
        // is longer than 12 characters, change to scientific notation
        (result.length > 13 && indexOfDecimal !== -1) || 
        (result.length > 12 && indexOfDecimal === -1)
    ) {
        // handle every scenario excluding the above cases
        result = toScientificNotation(result).toString();
        return result;
    } 
    return result;
}