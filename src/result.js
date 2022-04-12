export default function handleResult (result, indexOfDecimal, roundResult, toScientificNotation) {

    // if result doesn't have decimal and is under 12 characters, display plainly
    if (result.length < 12 && indexOfDecimal === -1) {

        return;

    } else if (
        // if result has decimal and is under 13 characters, display plainly
        indexOfDecimal !== -1 && 
        result.length < 13
    ) {

        return;

    } else if (
        // if result has decimal and number of digits preceding decimal is less 
        // than 12, round based on number of digits preceding decimal
        indexOfDecimal !== -1 && 
        result.slice(0, indexOfDecimal).length < 12
    ) {

        result = roundResult(result, indexOfDecimal);

    } else {
        // handle every scenario excluding the above cases
        result = toScientificNotation(result).toString();
    }
}