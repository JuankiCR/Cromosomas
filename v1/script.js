const generarCadena = (nGenes) => {
    let cromosoma = "";
    
    for (let i = 0; i < nGenes; i++){
        cromosoma += Math.random() < 0.5 ? "0" : "1";
    }
    
    return cromosoma;
}

const agregarCromosoma = () => {
    const resultCromosoma = document.getElementById("resultCromosoma");
    const cromosomaElement = document.createElement("div");
    cromosomaElement.className = "cromosomaWrapper";
    let nGenes = document.getElementById("inputNGenes").value || 10;

    const gen = generarCadena(nGenes);
    const genStyled = gen
        .split("")
        .map(cromosoma => `<span class="${cromosoma === "0" ? "gen_x" : "gen_y"}">${cromosoma}</span>`)
        .join("");

    cromosomaElement.innerHTML = genStyled;
    resultCromosoma.appendChild(cromosomaElement);
}
