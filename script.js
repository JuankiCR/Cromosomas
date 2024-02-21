var generacionActual = 1;
var nPoblacionActual = 10;
var historialPoblacion = [];
var poblacionPool = [];

const generarCadenaCromosomas = (nCromosomas) => {
    var gen = "";
    
    for (let i = 0; i < nCromosomas; i++){
        gen += Math.floor(Math.random() * 2);
    }
    
    return gen;
}

const agregarGen = () => {
    let nGenes = document.getElementById("inputNGenes").value || 10;

    gen = generarCadenaCromosomas(nGenes);

    genStyled = "";
    genText = "";

    [...gen].forEach((cromosoma) => {
        genStyled += `<span class="${cromosoma == "0" ? "cromosoma_x" : "cromosoma_y"}">${cromosoma}</span>`;
        genText += cromosoma;
    });

    poblacionPool.push(genText);
    return genStyled;
}

const reproducirGen = () => {
    let fatherID = 0;
    let motherID = 0;

    fatherID = Math.floor(Math.random() * poblacionPool.length);
    console.log("POB: ", poblacionPool);

    do {
        motherID = Math.floor(Math.random() * poblacionPool.length);
        console.log("poblacionPool: ", poblacionPool);
        console.log("MOTHER ID: ", motherID);
        console.log("FATHER ID: ", fatherID);
    } while (fatherID == motherID);
    
    let fatherSelected = poblacionPool[fatherID];    
    let motherSelected = poblacionPool[motherID];

    let child = "";
    let childText = "";
    let fatherGen = fatherSelected.split("");
    let motherGen = motherSelected.split("");

    for (let i = 0; i < fatherGen.length; i++){
        fatherOrMother = Math.floor(Math.random() * 2);
        genSelected = fatherOrMother == 1 ? fatherGen[i] : motherGen[i]
        child += `<span class="${genSelected == 0 ? "cromosoma_x" : "cromosoma_y"} ${fatherOrMother == 1 ? "from_father" : "from_mother"}">${genSelected}</span>`;
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
    const btnGenerarGen = document.getElementById("btnGenerarGen");
    const btnAgregarGen = document.getElementById("btnAgregarGen");

    const tlHeader = document.getElementById("tlHeader");
    const tlBody = document.getElementById("tlBody");
    nPoblacionActual = document.getElementById("inputNPoblacion").value || 10;

    if (isNewGeneration){
        generacionActual = 1;
        tlHeader.innerHTML = "";
        tlBody.innerHTML = "";
        poblacionPool = [];

        tlHeader.innerHTML = `
        <tr id="genRow">
            <th colspan = 2> Generación ${generacionActual} </th>
        </tr>
        <tr id="genTitleRow">
            <th>ID</th>
            <th>Gen</th>
        </tr>`;

        for (let i = 0; i < nPoblacionActual; i++){
            genGenerado = agregarGen();

            tlBody.innerHTML += `
            <tr id="genRow${i}">
                <td>${i + 1}</td>
                <td>${genGenerado}</td>
            </tr>`;
        }

        btnGenerarGen.innerHTML = "Nueva simulación";
        btnAgregarGen.classList.remove("disabled");
    }else{
        if (btnAgregarGen.classList.contains("disabled")){
            return;
        }
        generacionActual++;
        genRow = document.getElementById("genRow");
        genTitleRow = document.getElementById("genTitleRow");
        let tempPoblacionPool = [];

        genRow.innerHTML += `
            <th colspan = 4> Generación ${generacionActual} </th>
        `;

        genTitleRow.innerHTML +=`
            <th>ID</th>
            <th>Father ID</th>
            <th>Mother ID</th>
            <th>Gen</th>
        `;

        for (let i = 0; i < nPoblacionActual; i++){
            rowTarget = document.getElementById(`genRow${i}`);
            let { fatherID, motherID, child, childText } = reproducirGen();
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