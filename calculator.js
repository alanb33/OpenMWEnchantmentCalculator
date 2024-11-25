const debug = true;

function calculateResults(event) {
    /* 
        According to the OpenMW formula, take the inputs and display
        the success chance of the enchanting attempt.

        The OpenMW formula is:

        %Success = 
            (0.75 + %Fatigue/2) 
            × (1-0.5×"Effect is constant") 
            × (Enchant + Intelligence/5 + Luck/10 - 3×"Enchantment points")
    */

    if (isAttributeInputValid()) {

        const values = gatherInputValues()
        const enchantmentPointsComponent = document.getElementById("enchantment-points-input").value * 3;

        const finalCalculation = getFinalCalculation(values, enchantmentPointsComponent)

        displayText(`The success chance is...\n${finalCalculation.toFixed(2)}%!`, "green");

    } else {
        displayText("Please fill all the fields!", "red")
    }
    
}

function displayMinSuccessChance(forMinPercentage) {
    console.log("Displaying min success chance >= " + forMinPercentage);

    if (isAttributeInputValid())
    {

        // The maximum enchant points usability in the base game is 255, so
        // that's going to be the cap.
        const maxEnchantability = 255;

        for (let enchantPoint = 1; enchantPoint <= maxEnchantability; enchantPoint++) {
            const finalCalculation = getFinalCalculation(gatherInputValues(), enchantPoint)
            if (enchantPoint === 1 && finalCalculation < 0) {
                displayText("With these stats, you cannot reach a success chance of above 0%.", "red");
                break;
            }
            if (finalCalculation >= forMinPercentage) {
                displayText(`A success chance at or above ${forMinPercentage}% can be reached at ${enchantPoint} enchant points!`, "darkgreen");
                break;
            }
            if (enchantPoint == maxEnchantability) {
                displayText(`It is impossible to reach the goal of ${forMinPercentage}% with your stats.`, "red");
                break;
            }
        }
    } else {
        displayText("Please fill in your Enchant skill, Intelligence, and Luck!", "red");
    }
}

function displayMaxSuccessChance(forMaxPercentage) {
    console.log("Displaying max success chance >= " + forMaxPercentage);

    if (isAttributeInputValid())
    {
        // The maximum enchant points usability in the base game is 255, so
        // that's going to be the cap.
        const maxEnchantability = 255;
        let maxPoints = 1;

        for (let enchantPoint = 1; enchantPoint <= maxEnchantability; enchantPoint++) {
            const finalCalculation = getFinalCalculation(gatherInputValues(), enchantPoint * 3)
            if (finalCalculation < forMaxPercentage) {
                displayText(`The maximum enchantment points for ${forMaxPercentage}% can be reached at ${maxPoints} enchant points!`, "darkgreen");
                break;
            }
            if (maxPoints == 0) {
                displayText(`It is impossible to reach the goal of ${forMaxPercentage}% with your stats.`, "red");
                break;
            }
            maxPoints = enchantPoint;
        }
    } else {
        displayText("Please fill in your Enchant skill, Intelligence, and Luck!", "red");
    }
}

function displayText(message, color="black") {
    const resultsText = document.getElementById("results-p");
    resultsText.textContent = message;
    resultsText.style.color = color;
}

function getFinalCalculation(values, enchantmentPoints) {
    /*
        Given the values object (from gatherInputvalues) and a given
        enchantmentPoints value (separate so displayMinSuccessChance
        can call with a zero), return the final calculation as a float.
    */

    const fatigueComponent = 0.75 + (1 / 2);
    const constantComponent = values.constantEffect ? 0.5 : 1;
    const skillComponent = values.enchant 
                            + (values.intelligence / 5) 
                            + (values.luck / 10);

    const finalCalculation = fatigueComponent * constantComponent
                                * (skillComponent - enchantmentPoints)

    return finalCalculation;

}

function isAttributeInputValid() {
    const enchantSkill = document.getElementById("enchant-input").value;
    const intelligence = document.getElementById("intelligence-input").value;
    const luck = document.getElementById("luck-input").value;

    if (!enchantSkill || !intelligence || !luck) {
        return false;
    } else {
        return true;
    }
}

function gatherInputValues() {
    // Gather all input values and result them as an object.
    const enchantSkill = document.getElementById("enchant-input").value;
    const intelligence = document.getElementById("intelligence-input").value;
    const luck = document.getElementById("luck-input").value;

    // Checkboxes return true or false
    const constantEffect = document.getElementById("constant-effect-checkbox").checked;

    console.log("Constant component: " + constantEffect);

    const values = {
        enchant: parseFloat(enchantSkill),
        intelligence: parseFloat(intelligence),
        luck: parseFloat(luck),
        constantEffect: constantEffect,
    }

    return values;

}

function initialize() {
    console.log("Hello, world!")
    
    const calculateSuccessButton = document.getElementById("button-calculate-success");
    calculateSuccessButton.addEventListener("click", calculateResults);

    const calculateMinZeroSuccess = document.getElementById("button-min-0-success");
    calculateMinZeroSuccess.addEventListener("click", () => { displayMinSuccessChance(0) })
    
    const calculateMinHundredSuccess = document.getElementById("button-min-100-success");
    calculateMinHundredSuccess.addEventListener("click", () => { displayMaxSuccessChance(100) })
}

window.onload = () => { initialize() }