/**
 * @author Anna Vasilyeva
 * @group 621701
 * Лабораторная работа 1
 * Вариант С -  Проверка на СКНФ
 */

let constOrAtomRegex = "[01A-Z]";
let negationRegex = "(^!" + constOrAtomRegex + '$)';
let conjunctionRegex = '(^' + constOrAtomRegex + '&' + constOrAtomRegex + '$)';
let disjunctionRegex = '(^' + constOrAtomRegex + "\\|" + constOrAtomRegex + '$)';
let implicationRegex = '(^' + constOrAtomRegex + '->' + constOrAtomRegex + '$)';
let equivalentionRegex = '(^' + constOrAtomRegex + '~' + constOrAtomRegex + '$)';

let formulaRegex = '(' + disjunctionRegex + '|' + conjunctionRegex + '|' +
    equivalentionRegex + '|' + implicationRegex + '|' +
    negationRegex + ')';

function conjuction() {
    let formula = document.getElementById('probablySKNF').value;
    let select = document.getElementById('chooseIfSKNF');
    var userChoise = select.options[select.selectedIndex].value;

    if(checkInputSKNF(formula) == 0) {
        if(userChoise == 1) 
            alert("НЕВЕРНО.");
        else 
            alert("ВЕРНО.");
        return;
    }

    let sknf = checkSKNFFormula(formula);
    if(sknf == userChoise) 
        alert("ВЕРНО.");
    else 
        alert("НЕВЕРНО.");
}

function checkInputSKNF(formula) {
    if(formula == '')
        return 0;
    
    if(formula.match(/[\~\>\d]/) || formula.match(/\!\(\!\(/))
        return 0;
    
    formula = formula.replace(/\s/g, "");
    formulaSymbols = formula.split('');
    
    if(checkBrackets(formulaSymbols) == 0)
        return 0;

    return finalInputCheck(formula);
}

function checkBrackets(formulaSymbols) {
    let bracketCounter = 0;

    formulaSymbols.forEach((el, num, arr) => {
        if(el == '(') 
            bracketCounter++;
        if(el == ')')
            bracketCounter--;
    });
    
    if(bracketCounter != 0)
        return 0;
    return 1;
}

function finalInputCheck(s) {
    let formula = Array.from(s);
    let fPar = formula.lastIndexOf('(');
    let lPar = formula.indexOf(')', fPar);

    while (true) {
        if (formula.indexOf('(') == -1 && formula.indexOf(')') == -1)
                return isConstOrAtom(formula);

        let subformula = formula.slice(fPar + 1, lPar).join('');
        if (isUnaryOp(subformula) || isBinaryOp(subformula))
            formula.splice(fPar, lPar - fPar + 1, 'F');
        else
            return 0;

        fPar = formula.lastIndexOf('(');
        lPar = formula.indexOf(')', fPar);
    }
}

function isUnaryOp(s) {
    if (s.length != 2)
        return false;

    if (s.indexOf("!") != 0)
        return false;

    return true;
}

function isBinaryOp(s) {
    if (s.match(formulaRegex) != null)
        return true;
    else
        return false;
}

function checkSKNFFormula(formula) {
    if(formula.match(/\!\(([01A-Z](\||\&)[01A-Z])+\)*/))
        return 0;

    formulaSymbols = formula.split('&');
    let check = 1;

    let compare = formulaSymbols[0].split('|');
    formulaSymbols.forEach((el, num, arr) => {
        elArray = el.split('|');
        if(elArray.length != compare.length)
            check = 0;
    });

    if(check == 0)
        return check;
    
    let checkSymbols = formulaSymbols;

    checkSymbols.forEach((el, num, arr) => {
        el = el.replace(/\(/, '');
        el = el.replace(/\(/, '');
        el = el.replace(/!/, '');
        elArray = el.split('|');
        elArray.forEach((v, n, a) => {
            if(el.indexOf(v) != el.lastIndexOf(v))
                check = 0;
        });
    });

    if(check == 0)
        return check;
    
    if(checkDuplicatedDisjunctions(formulaSymbols) == 0)
        return 0;

    check = checkIfVarExistsInEveryDisjunction(formulaSymbols);
    
    return check;
}

function checkDuplicatedDisjunctions(formulaSymbols) {
    for(let i = 0; i < formulaSymbols.length; i++) {
        formulaSymbols[i] = formulaSymbols[i].replace(/\(/g, '');
        formulaSymbols[i] = formulaSymbols[i].replace(/\)/g, '');
    }

    for(let i = 0; i < formulaSymbols.length; i++) {
        let element = formulaSymbols[i].split('|');
        for(let j = 0; j < formulaSymbols.length; j++) {
            if(i != j) {
                let counter = 0;
                let compare = formulaSymbols[j].split('|');
                for(let n = 0; n < element.length; n++) {
                    for(let m = 0; m < compare.length; m++) {
                        if(compare[m] == element[n])
                            counter++;
                    }
                }
                if(counter == compare.length)
                    return 0;
            }
        }
    }

    return 1;
}

function checkIfVarExistsInEveryDisjunction(formulaSymbols) {

    for(let i = 0; i < formulaSymbols.length; i++) {
        formulaSymbols[i] = formulaSymbols[i].replace(/!/, '');
    }

    let exists = 0;
    let array1 = formulaSymbols;
    let array2 = formulaSymbols;

    let a1 = array1[0].split('|');
    for(let m = 0; m < array2.length; m++) {
        let a2 = array2[m].split('|');
        for(let i = 0; i < a1.length; i++) {
            for(let j = 0; j < a2.length; j++) {
                exists = 0;
                if(a1[i] == a2[j]) {
                    exists = 1;
                    break;
                }
            }
            if(exists == 0) 
                    break;
            }
        if(exists == 0) 
            break;
    }

    return exists;
}