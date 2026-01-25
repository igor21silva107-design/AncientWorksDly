"use client";

import { useEffect, useState } from "react";
import { characters } from "../data/characters";
import { compareGuess } from "../utils/compareGuess";
import GuessRow from "../Components/GuessRow";
import GuessInput from "../Components/GuessInput";

function getDailyIndexForDate(total, date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const day = Math.floor((date - start) / 86400000) + 1;
  return total > 0 ? day % total : 0;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const today = new Date();
  const todayKey = formatKey(today);
  const dailyIndex = getDailyIndexForDate(characters.length, today);
  const target = characters[dailyIndex];
  const todayLabel = formatDate(today);

  const [guesses, setGuesses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showHint, setShowHint] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [dailyStatus, setDailyStatus] = useState({});
  const maxGuesses = 10;
  const progress = Math.min((guesses.length / maxGuesses) * 100, 100);
  const hintUnlockAt = 4;
  const hintUnlocked = guesses.length >= hintUnlockAt;
  const hintRemaining = Math.max(hintUnlockAt - guesses.length, 0);
  const storageKey = "rpgdle:dailyStatus";

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      setDailyStatus(JSON.parse(stored));
    } catch {
      setDailyStatus({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(dailyStatus));
  }, [dailyStatus]);

  useEffect(() => {
    if (!isWin && guesses.length >= maxGuesses) {
      setDailyStatus((prev) => ({ ...prev, [todayKey]: "lose" }));
    }
  }, [guesses.length, isWin, maxGuesses, todayKey]);

  function handleGuess(name) {
    if (!name) return;

    const character = characters.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!character) return;

    const alreadyGuessed = guesses.some(
      (g) => g.guess && g.guess.name === character.name
    );
    if (alreadyGuessed) return;

    const comparison = compareGuess(character, target);

    setGuesses((prev) => [{ guess: character, result: comparison }, ...prev]);
    if (character.name === target.name) {
      setIsWin(true);
      setDailyStatus((prev) => ({ ...prev, [todayKey]: "win" }));
    }
  }

  const filteredGuesses = guesses.filter(({ result }) => {
    if (filter === "all") return true;
    const isPerfect =
      result.magia &&
      result.classeSocial &&
      result.status &&
      result.modoEspecial &&
      result.regiao &&
      result.campanha &&
      result.arcos &&
      result.idade === "equal";
    return filter === "perfect" ? isPerfect : !isPerfect;
  });

  const recentDays = 7;
  const history = Array.from({ length: recentDays }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const safeIndex = getDailyIndexForDate(characters.length, date);
    return {
      date,
      key: formatKey(date),
      character: characters[safeIndex],
    };
  });

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">RPGdle</span>
          <span className="brand-sub">Modo Padrao</span>
        </div>
        <div className="topbar-actions">
          <button
            className="ghost-button"
            type="button"
            onClick={() => setShowSummary(true)}
          >
            Sumario
          </button>
          <button className="menu-button" type="button" aria-label="Menu">
            &#9776;
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bar">
          <div className="hero-progress">
            <div className="hero-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="hero-progress-label">
            {guesses.length}/{maxGuesses}
          </div>
        </div>
        <GuessInput characters={characters} onGuess={handleGuess} />
        <div className="hero-meta">
          <div className="meta-item">{todayLabel}</div>
          <div className="meta-item">
            {hintUnlocked
              ? "Dica liberada"
              : `Dica libera em ${hintRemaining} chutes`}
          </div>
        </div>
        <div className="hint-bar">
          <button
            className="hint-button"
            type="button"
            disabled={!hintUnlocked}
            onClick={() => setShowHint((prev) => !prev)}
          >
            Dica
          </button>
          <div className={`hint-text ${showHint ? "is-visible" : ""}`}>
            {hintUnlocked
              ? `Regiao do personagem: ${target.regiao}`
              : "A dica aparece quando voce fizer mais chutes."}
          </div>
        </div>
        <div className="filters">
          <button
            className={`filter-button ${filter === "all" ? "is-active" : ""}`}
            type="button"
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`filter-button ${filter === "perfect" ? "is-active" : ""}`}
            type="button"
            onClick={() => setFilter("perfect")}
          >
            Apenas acertos
          </button>
          <button
            className={`filter-button ${filter === "missed" ? "is-active" : ""}`}
            type="button"
            onClick={() => setFilter("missed")}
          >
            Apenas erros
          </button>
        </div>
      </section>

      <section className="guess-list">
        {filteredGuesses.length === 0 ? (
          <div className="empty-state">
            Tente seu primeiro palpite para revelar pistas.
          </div>
        ) : (
          filteredGuesses.map(({ guess, result }, index) => (
            <GuessRow
              key={`${guess.name}-${index}`}
              guess={guess}
              result={result}
              index={index}
            />
          ))
        )}
      </section>

      {isWin && (
        <div
          className="win-overlay"
          role="status"
          aria-live="polite"
          onClick={() => setIsWin(false)}
        >
          <div className="win-card" onClick={(e) => e.stopPropagation()}>
            <div className="win-title">Vitoria!</div>
            <div className="win-subtitle">
              Voce acertou o personagem do dia.
            </div>
            <div className="win-name">{target.name}</div>
            <button
              className="win-close"
              type="button"
              onClick={() => setIsWin(false)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {showSummary && (
        <div
          className="summary-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowSummary(false)}
        >
          <div className="summary-card" onClick={(e) => e.stopPropagation()}>
            <div className="summary-header">
              <div className="summary-title">Sumario</div>
              <button
                className="summary-close"
                type="button"
                onClick={() => setShowSummary(false)}
              >
                Fechar
              </button>
            </div>
            <div className="summary-list">
              {history.map((item) => {
                const status = dailyStatus[item.key];
                const statusLabel = status
                  ? status === "win"
                    ? "Acertou"
                    : "Errou"
                  : item.key === todayKey
                  ? "Em andamento"
                  : "Sem dados";
                const statusClass = status
                  ? status === "win"
                    ? "summary-status win"
                    : "summary-status lose"
                  : item.key === todayKey
                  ? "summary-status pending"
                  : "summary-status none";

                return (
                  <div key={item.date.toISOString()} className="summary-item">
                    <div className="summary-date">{formatDate(item.date)}</div>
                    <div className="summary-name">
                      {item.character ? item.character.name : "Sem personagem"}
                    </div>
                    <div className={statusClass}>{statusLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
