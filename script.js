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
    let nGenes = document.getElementById("inputNGenes").value || 10;

    cromosomaElement.classList.add("cromosomaWrapper");

    cromosoma = generarCadena(nGenes);

    if (nGenes > 1000){
        cromosomaElement.innerHTML = cromosoma;
    }else{
        [...cromosoma].forEach((gen) => {
            const genElement = document.createElement('span');
            genElement.classList.add(gen == "0" ? "gen_x" : "gen_y");
            genElement.innerHTML = gen;
            cromosomaElement.appendChild(genElement);
        });
    }

    resultCromosoma.appendChild(cromosomaElement);
}