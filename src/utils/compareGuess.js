export function compareGuess(guess, target) {
  return {
    magia: guess.magia === target.magia,
    classeSocial: guess.classeSocial === target.classeSocial,
    status: guess.status === target.status,
    modoEspecial: guess.modoEspecial === target.modoEspecial,
    regiao: guess.regiao === target.regiao,
    isAnimal: guess.isAnimal === target.isAnimal,
    campanha: guess.campanha.some((item) => target.campanha.includes(item)),
    arcos: guess.arcos.map((arco) => target.arcos.includes(arco)),
    idade:
      guess.idade === target.idade
        ? "equal"
        : guess.idade > target.idade
        ? "higher"
        : "lower"
  };
}
