export default function GuessRow({ guess, result, index = 0 }) {
  const chipClass = (ok) => `chip ${ok ? "chip-ok" : "chip-bad"}`;
  let chipIndex = 0;
  const chipDelay = () => {
    const delay = chipIndex * 120;
    chipIndex += 1;
    return { "--chip-delay": `${delay}ms` };
  };

  const idadeLabel = () => {
    if (result.idade === "higher") return `${guess.idade} (maior)`;
    if (result.idade === "lower") return `${guess.idade} (menor)`;
    return `${guess.idade}`;
  };

  return (
    <article
      className="guess-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <header className="guess-header">
        <div>
          <div className="guess-name">{guess.name}</div>
          <div className="guess-subtitle">Perfil do personagem</div>
        </div>
        <div className="guess-status">{guess.status}</div>
      </header>

      <div className="guess-body">
        <div className="guess-info">

          <div className="guess-section">
        <div className="guess-label">Atributos</div>
        <div className="chip-row">
          <span className={chipClass(result.magia)} style={chipDelay()}>
            Magia: {guess.magia ? "Sim" : "Nao"}
          </span>
          <span className={chipClass(result.idade === "equal")} style={chipDelay()}>
            Idade: {idadeLabel()}
          </span>
          <span className={chipClass(result.classeSocial)} style={chipDelay()}>
            Classe: {guess.classeSocial}
          </span>
          <span className={chipClass(result.modoEspecial)} style={chipDelay()}>
            Modo especial: {guess.modoEspecial ? "Sim" : "Nao"}
          </span>
          <span className={chipClass(result.regiao)} style={chipDelay()}>
            Regiao: {guess.regiao}
          </span>
        </div>
      </div>

          <div className="guess-section">
        <div className="guess-label">Arcos</div>
        <div className="chip-row">
          {guess.arcos.map((arco, index) => (
            <span
              key={arco}
              className={chipClass(result.arcos?.[index])}
              style={chipDelay()}
            >
              {arco}
            </span>
          ))}
        </div>
      </div>

          <div className="guess-section">
        <div className="guess-label">Campanha</div>
        <div className="chip-row">
          {guess.campanha.map((campanha) => (
            <span
              key={campanha}
              className={chipClass(result.campanha)}
              style={chipDelay()}
            >
              {campanha}
            </span>
          ))}
        </div>
      </div>
        </div>
        {guess.image && (
          <div className="guess-image">
            <img src={guess.image} alt={guess.name} />
          </div>
        )}
      </div>
    </article>
  );
}
