const selectGraficar = document.getElementById("selectGraficar");

var generacionActual = 1;
var fitnessValue = "0";
var nPoblacionActual = 10;
var poblacionPool = {};
var fitnessPool = {};
var chart;
var probabilidadMutacion = 0.1;

const mutarGen = (gen) => {
    return gen === "0" ? "1" : "0";
}

const generarCadenaCromosomas = (nCromosomas) => {
    var gen = "";

    for (let i = 0; i < nCromosomas; i++){
        gen += Math.random() < 0.5 ? "0" : "1";
    }
    
    fitnessPool[generacionActual] = fitnessPool[generacionActual] || [];
    fitnessPool[generacionActual].push(calcularFitness(gen));

    return gen;
}

const calcularFitness = (gen) => {
    let fitness = 1;
    let fitnessTemp = 0;

    if (gen.indexOf(fitnessValue) === -1) {
        return 0;
    }

    for (let i = 0; i < gen.length; i++) {
        if (gen[i] === fitnessValue && gen[i+1] === fitnessValue) {
            fitness++;
        } else {
            fitnessTemp = fitness > fitnessTemp ? fitness : fitnessTemp;
            fitness = 1;
        }
    }

    return fitness ? fitnessTemp : fitness;
}

const agregarGen = () => {
    const inputNGenes = document.getElementById("inputNGenes");
    const nGenes = inputNGenes.value || 10;

    const gen = generarCadenaCromosomas(nGenes);

    let genStyled = gen
        .split('')
        .map(cromosoma => `<span class="${cromosoma === '0' ? 'cromosoma_x' : 'cromosoma_y'}">${cromosoma}</span>`)
        .join('');
    
    poblacionPool[generacionActual] = poblacionPool[generacionActual] || [];
    poblacionPool[generacionActual].push(gen);

    return genStyled;
}

const reproducirGen = () => {
    const poblacionLength = poblacionPool[generacionActual-1].length;
    let fatherID = Math.floor(Math.random() * poblacionLength);
    let motherID;

    do {
        motherID = Math.floor(Math.random() * poblacionLength);
    } while (fatherID === motherID);
    
    const fatherSelected = poblacionPool[generacionActual-1][fatherID];
    const motherSelected = poblacionPool[generacionActual-1][motherID];

    let child = "";
    let childText = "";

    for (let i = 0; i < fatherSelected.length; i++) {
        const fatherOrMother = Math.floor(Math.random() * 2);
        let genSelected = fatherOrMother === 1 ? fatherSelected[i] : motherSelected[i];
        const parentType = fatherOrMother === 1 ? "from_father" : "from_mother";
        const genClass = genSelected === "0" ? "cromosoma_x" : "cromosoma_y";

        if (Math.random() < probabilidadMutacion) {
            genSelected =  mutarGen(genSelected);

            child += `<span class="${genClass} mutado">${genSelected}</span>`;
            childText += genSelected;
        }else{
            child += `<span class="${genClass} ${parentType}">${genSelected}</span>`;
            childText += genSelected;
        }
    }

    fitnessPool[generacionActual] = fitnessPool[generacionActual] || [];
    fitnessPool[generacionActual].push(calcularFitness(childText));

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
    const btnGraficas = document.getElementById("btnGraficas");

    nPoblacionActual = inputNPoblacion.value || 10;
    
    if (isNewGeneration) {
        fitnessValue = document.getElementById("selectFitness").value || 0;
        generacionActual = 1;
        tlHeader.innerHTML = `
        <tr id="genRow">
            <th colspan = 3> Generación ${generacionActual} </th>
        </tr>
        <tr id="genTitleRow">
            <th>ID</th>
            <th>Gen</th>
            <th>Fitness</th>
        </tr>`;
        tlBody.innerHTML = "";

        poblacionPool = {};
        fitnessPool = {};

        for (let i = 0; i < nPoblacionActual; i++) {
            const genGenerado = agregarGen();
            tlBody.innerHTML += `
            <tr id="genRow${i}">
                <td>${i + 1}</td>
                <td>${genGenerado}</td>
                <td>${fitnessPool[generacionActual][i]}</td>
            </tr>`;
        }

        btnGenerarGen.innerHTML = "Nueva simulación";
        btnAgregarGen.classList.remove("disabled");
        btnGraficas.classList.remove("disabled");
    } else {
        if (btnAgregarGen.classList.contains("disabled")) {
            return;
        }
        generacionActual++;

        const genRow = document.getElementById("genRow");
        const genTitleRow = document.getElementById("genTitleRow");

        genRow.innerHTML += `
            <th colspan = 5> Generación ${generacionActual} </th>
        `;

        genTitleRow.innerHTML +=`
            <th>ID</th>
            <th>Father ID</th>
            <th>Mother ID</th>
            <th>Gen</th>
            <th>Fitness</th>
        `;

        for (let i = 0; i < nPoblacionActual; i++) {
            const rowTarget = document.getElementById(`genRow${i}`);
            const { fatherID, motherID, child, childText } = reproducirGen();
            poblacionPool[generacionActual] = poblacionPool[generacionActual] || [];
            poblacionPool[generacionActual].push(childText);
            rowTarget.innerHTML += `
                <td>${i + 1}</td>
                <td><span class="from_father"> ${fatherID + 1} </span></td>
                <td><span class="from_mother"> ${motherID + 1} </span></td>
                <td>${child}</td>
                <td>${fitnessPool[generacionActual][i]}</td>
            `;
        }

    }
}

const extractChartData = (nGeneracion) => {
    const fitness = fitnessPool[nGeneracion];
    const fitnessCount = {};

    fitness.forEach(f => {
        fitnessCount[`Fitness ${f}`] = fitnessCount[`Fitness ${f}`] + 1 || 1;
    });

    return {
        fitness: Object.keys(fitnessCount),
        count: Object.values(fitnessCount)
    };
}

const graficar = () => {
    const selectGraficar = document.getElementById("selectGraficar");
    const nGeneracion = selectGraficar.value;
    const data = extractChartData(nGeneracion);
    const ctx = document.getElementById("chart").getContext('2d');
    if (chart) { chart.destroy(); }
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.fitness,
            datasets: [{
                label: 'Cantidad',
                data: data.count,
                backgroundColor: [
                    '#ecd5f9cc',
                    '#dfb3f4cc',
                    '#ce86eccc',
                    '#b657decc',
                    '#9b37c2cc',
                    '#802a9dcc',
                    '#6d2583cc',
                    '#5c236ccc',
                    '#390b47cc'
                ],
                borderColor: [
                    'ecd5f9',
                    'dfb3f4',
                    'ce86ec',
                    'b657de',
                    '9b37c2',
                    '802a9d',
                    '6d2583',
                    '5c236c',
                    '390b47'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}  

const showGraficModal = () => {
    if (btnAgregarGen.classList.contains("disabled")) {
        return;
    }

    const selectGraficar = document.getElementById("selectGraficar");
    const chartModal = document.getElementById("chartModal");
    chartModal.classList.remove("hidden");

    selectGraficar.innerHTML = "";
    const keys = Object.keys(fitnessPool);

    keys.forEach(key => {
        selectGraficar.innerHTML += `<option value="${key}">Generación ${key}</option>`;
    });

    graficar();
}

const hiddeGraficModal = () => {
    chartModal = document.getElementById("chartModal");
    chartModal.classList.add("hidden");
}

selectGraficar.addEventListener("change", graficar);
