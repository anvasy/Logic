/**
 * @author Anna Vasilyeva
 * @group 621701
 * Лабораторная работа 2
 * Вариант 4 -  Проверка на нейтральность
 */

function neutral() {
    let formulaStr = document.getElementById('probablyNeutral').value;
    let select = document.getElementById('chooseIfNeutral');
    var userChoise = select.options[select.selectedIndex].value;

    if(checkInput(formulaStr) == 0) {
        if(userChoise == 1) 
            alert("НЕВЕРНО.");
        else 
            alert("ВЕРНО.");
        return;
    }

    let neutral = checkFormula(formulaStr);

    if(neutral == userChoise) 
        alert("ВЕРНО.");
    else 
        alert("НЕВЕРНО.");
}

function checkInput(formulaStr) {
    if(formulaStr == '')
        return 0;

    if(checkBrackets(formulaStr.split('')) == 0)
        return 0;

    return finalInputCheck(formulaStr);
}

function checkFormula(formulaStr) {
    let letters = formulaStr.match(/[A-Z]/g);

    formula = formulaStr.split('');

    let results = [];
    if (letters == null) {
        let result = evaluate(formula);
        results.push(result);
    } else {
        let consts = generateConsts(letters);
        for (let i = 0; i < consts.length; ++i) {
            let tempFormula = formula.join('');
            for (let j = 0; j < letters.length; ++j)
                tempFormula = tempFormula.replace(new RegExp(letters[j], 'g'), consts[i][j]);
            let result = evaluate(tempFormula.split(''));
            results.push(result);
        }
    }

    if (results.length <= 1)
        return 0;

    resultsStr = results.join('');

    if(resultsStr.indexOf('0') >= 0 && resultsStr.indexOf('1') >= 0)
        return 1;

    return 0;
}

function evaluate(formula) {
    let lPar = formula.lastIndexOf('(');
    let rPar = formula.indexOf(')', lPar);

    while (true) {
        if (lPar == -1 && rPar == -1) 
            return evalSubformula(formula);
        
        let subformula = formula.slice(lPar + 1, rPar);
        formula.splice(lPar, rPar - lPar + 1, evalSubformula(subformula));

        lPar = formula.lastIndexOf('(');
        rPar = formula.indexOf(')', lPar);
    }
}

function evalSubformula(formula) {
    let formulaStr = formula.join('');
    let returnValue = '';
    if (isConstOrAtom(formulaStr)) {
        returnValue = formula;
    } else if (formulaStr.match(negationRegex) != null) {
        returnValue = negation(formula);
    } else if (formulaStr.match(conjunctionRegex) != null) {
        returnValue = conjunction(formula);
    } else if (formulaStr.match(disjunctionRegex) != null) {
        returnValue = disjunction(formula);
    } else if (formulaStr.match(implicationRegex) != null) {
        returnValue = implication(formula);
    } else if (formulaStr.match(equivalentionRegex) != null) {
        returnValue = equivalention(formula);
    }
    return returnValue;
}

function negation(formula) {
    if (formula[1] == '0')
        return '1';
    return '0';
}

function conjunction(formula) {
    if (formula[0] == '0' || formula[2] == '0')
        return '0';
    return '1';
}

function disjunction(formula) {
    if (formula[0] == '1' || formula[2] == '1')
        return '1';
    return '0';
}

function implication(formula) {
    if (formula[0] == '1' && formula[3] == '0')
        return '0';
    return '1';
}

function equivalention(formula) {
    if (formula[0] == '0' && formula[2] == '0')
        return '1';
    if(formula[0] == '1' && formula[2] == '1')
        return '1';
    return '0';
}

function isConstOrAtom(formula) {
    if (formula.length != 1)
        return false;
    let pr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
    return (pr.indexOf(formula) >= 0);
}

/**
 * @source StackOverflow
 * 
 */

function generateConsts(letters) {
    let binNums = [];
    for (let i = 0; i < Math.pow(2, letters.length); ++i) {
        let binStr = i.toString(2);
        let len = binStr.length;
        for (let j = 0; j < letters.length - len; ++j) {
            binStr = '0'.concat(binStr);
        }
        binNums.push(binStr.split(''));
    }
    return binNums;
}