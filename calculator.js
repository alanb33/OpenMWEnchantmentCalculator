function calculateResults(event) {

    /* 
        %Success = 
            (0.75 + %Fatigue/2) 
            × (1-0.5×"Effect is constant") 
            × (Enchant + Intelligence/5 + Luck/10 - 3×"Enchantment points")
    */

    event.preventDefault()

    const values = gatherInputValues()

    const fatigueComponent = 0.75 + (100 / 2);
    const constantComponent = values.constantEffect ? 0.5 : 1;
    
    const skillComponent = values.enchant + (values.intelligence / 5) + (values.luck / 10)

    console.log("Enchant: " + values.enchant)
    console.log("Intelligence: " + values.intelligence)
    console.log("Luck: " + values.luck)

    const enchantmentPointsComponent = document.getElementById("enchantment-points-input").value * 3;

    const finalCalculation = fatigueComponent * constantComponent
                                * (skillComponent - enchantmentPointsComponent)

    console.log("Debug values: ");
    console.log("Fatigue component: " + fatigueComponent)
    console.log("Constant component: " + constantComponent);
    console.log("Skill component: " + skillComponent);
    console.log("Enchantment points component: " + enchantmentPointsComponent);
    console.log("Final calculation: " + finalCalculation);

    const resultsText = document.getElementById("results-p");
    resultsText.textContent = `The success chance is...\n${finalCalculation}%!`;
}

function gatherInputValues() {
    // Gather all input values and result them as an object.
    const enchantSkill = document.getElementById("enchant-input").value;
    const intelligence = document.getElementById("intelligence-input").value;
    const luck = document.getElementById("luck-input").value;

    // Checkboxes return true or false
    const constantEffect = document.getElementById("constant-effect-checkbox").value

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
}

window.onload = () => { initialize() }