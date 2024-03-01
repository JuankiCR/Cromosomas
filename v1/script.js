const generarCadena = (nGenes) => {
    var cromosoma = "";
    
    for (let i = 0; i < nGenes; i++){
        cromosoma += Math.floor(Math.random() * 2);
    }
    
    console.log(cromosoma);
    return cromosoma;
}

const agregarCromosoma = () => {
    const resultCromosoma = document.getElementById("resultCromosoma");
    const cromosomaElement = document.createElement("div");
    cromosomaElement.className = "cromosomaWrapper";
    let nGenes = document.getElementById("inputNGenes").value || 10;

    gen = generarCadena(nGenes);

    genStyled = "";

    [...gen].forEach((cromosoma) => {
        genStyled += `<span class="${cromosoma == "0" ? "gen_x" : "gen_y"}">${cromosoma}</span>`;
    });

    cromosomaElement.innerHTML = genStyled;
    resultCromosoma.appendChild(cromosomaElement);
}