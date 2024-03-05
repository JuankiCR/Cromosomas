var generacionActual = 1;
var nPoblacionActual = 10;
var poblacionPool = [];

const generarCadenaCromosomas = (nCromosomas) => {
    var gen = "";

    for (let i = 0; i < nCromosomas; i++){
        gen += Math.random() < 0.5 ? "0" : "1";
    }
    
    return gen;
}

const agregarGen = () => {
    const inputNGenes = document.getElementById("inputNGenes");
    const nGenes = inputNGenes.value || 10;

    const gen = generarCadenaCromosomas(nGenes);

    let genStyled = gen
        .split('')
        .map(cromosoma => `<span class="${cromosoma === '0' ? 'cromosoma_x' : 'cromosoma_y'}">${cromosoma}</span>`)
        .join('');

    let genText = gen;

    poblacionPool.push(genText);

    return genStyled;
}

const reproducirGen = () => {
    const poblacionLength = poblacionPool.length;
    let fatherID = Math.floor(Math.random() * poblacionLength);
    let motherID;

    do {
        motherID = Math.floor(Math.random() * poblacionLength);
    } while (fatherID === motherID);
    
    const fatherSelected = poblacionPool[fatherID];    
    const motherSelected = poblacionPool[motherID];

    let child = "";
    let childText = "";

    for (let i = 0; i < fatherSelected.length; i++) {
        const fatherOrMother = Math.floor(Math.random() * 2);
        const genSelected = fatherOrMother === 1 ? fatherSelected[i] : motherSelected[i];
        const parentType = fatherOrMother === 1 ? "from_father" : "from_mother";
        const genClass = genSelected === "0" ? "cromosoma_x" : "cromosoma_y";

        child += `<span class="${genClass} ${parentType}">${genSelected}</span>`;
        childText += genSelected;
    }

    return {
        fatherID,
        motherID,
        child,
        childText
    };
}

const generarPoblacion = (isNewGeneration = true) => {
    const btnAgregarGen = document.getElementById("btnAgregarGen");
    const tlHeader = document.getElementById("tlHeader");
    const tlBody = document.getElementById("tlBody");
    const inputNPoblacion = document.getElementById("inputNPoblacion");
    const btnGenerarGen = document.getElementById("btnGenerarGen");

    nPoblacionActual = inputNPoblacion.value || 10;

    if (isNewGeneration) {
        generacionActual = 1;
        tlHeader.innerHTML = `
        <tr id="genRow">
            <th colspan = 2> Generación ${generacionActual} </th>
        </tr>
        <tr id="genTitleRow">
            <th>ID</th>
            <th>Gen</th>
        </tr>`;
        tlBody.innerHTML = "";

        poblacionPool = [];

        for (let i = 0; i < nPoblacionActual; i++) {
            const genGenerado = agregarGen();
            tlBody.innerHTML += `
            <tr id="genRow${i}">
                <td>${i + 1}</td>
                <td>${genGenerado}</td>
            </tr>`;
        }

        btnGenerarGen.innerHTML = "Nueva simulación";
        btnAgregarGen.classList.remove("disabled");
    } else {
        if (btnAgregarGen.classList.contains("disabled")) {
            return;
        }
        generacionActual++;

        const genRow = document.getElementById("genRow");
        const genTitleRow = document.getElementById("genTitleRow");
        const tempPoblacionPool = [];

        genRow.innerHTML += `
            <th colspan = 4> Generación ${generacionActual} </th>
        `;

        genTitleRow.innerHTML +=`
            <th>ID</th>
            <th>Father ID</th>
            <th>Mother ID</th>
            <th>Gen</th>
        `;

        for (let i = 0; i < nPoblacionActual; i++) {
            const rowTarget = document.getElementById(`genRow${i}`);
            const { fatherID, motherID, child, childText } = reproducirGen();
            tempPoblacionPool.push(childText);
            rowTarget.innerHTML += `
                <td>${i + 1}</td>
                <td><span class="from_father"> ${fatherID + 1} </span></td>
                <td><span class="from_mother"> ${motherID + 1} </span></td>
                <td>${child}</td>
            `;
        }

        poblacionPool = tempPoblacionPool;
    }
}