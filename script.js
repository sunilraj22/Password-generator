const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");  
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator('#ccc');

//When you make slider move it will set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "%100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function generateRndInteger(max,min){
    return Math.floor(Math.random() * (max-min)) + min;  
}

function generateRandomNumber(){
    return generateRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(generateRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(generateRndInteger(65,91));
}

function generateSymbol(){
    const randNum = generateRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 12) {
  setIndicator("#0f0"); // Strong (green) - Contains upper, lower, number, symbol, and length is 12 or more
} else if ((hasUpper || hasLower) && hasNum && hasSym && passwordLength >= 10) {
  setIndicator("#ff0"); // Medium (yellow) - Contains either upper or lower case, numbers, symbols, and length is 10 or more
} else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 8) {
  setIndicator("#ffa500"); // Weak (orange) - Contains either upper/lower, numbers/symbols, and length is 8 or more
} else {
  setIndicator("#f00"); // Very weak (red) - Does not meet minimum requirements
}

}

async function copyContent(){
    try{

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "Failed";
    }
    //To make copy wala span visible
    copyMsg.classList.add("Active"); 
    setTimeout(() => {
        copyMsg.classList.remove("Active");
    }, 2000);
}

function shufflePassword(array){
    //Fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

inputSlider.addEventListener('input',function(event){
    passwordLength = event.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',function(){
    if(passwordDisplay.value){
        copyContent();
    }
})


function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach(function(checkbox){
        if(checkbox.checked){
            checkCount++;
        }
    })
    //Special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}



uppercaseCheck.addEventListener('change', handleCheckboxChange);
lowercaseCheck.addEventListener('change', handleCheckboxChange);
numbersCheck.addEventListener('change', handleCheckboxChange);
symbolsCheck.addEventListener('change', handleCheckboxChange);

generateBtn.addEventListener('click',function(){
    //None of the check box are selected
    if(checkCount == 0) 
    return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start the journey to find new password
    
    //remove old password
    password = "";
    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password = password + generateUpperCase();
    // } 
    // if(lowercaseCheck.checked){
    //     password = password + generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password = password + generateRandomNumber();
    // }  
    // if(symbolsCheck.checked){
    //     password = password + generateSymbol();
    // }
    
    let funcArr = [];
    if(uppercaseCheck.checked){
         funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    } 
    if(numbersCheck.checked){
         funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //Compulsory Addition
    for (let index = 0; index < checkCount; index++) {
        password += funcArr[index]();
    }

    //remaining addition
    for (let index = 0; index < passwordLength-checkCount; index++) {
        let randIndex = generateRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();  
    }
    //Suffle the password
    password = shufflePassword(Array.from(password));
    //Show in UI
    passwordDisplay.value = password;
    //Calculate Strength
    calcStrength();
})
