"use client";

import { useState } from "react";

export default function GuessInput({ characters = [], onGuess }) {
  const [value, setValue] = useState("");

  const filtered =
    value.length === 0
      ? []
      : characters.filter((c) =>
          c.name.toLowerCase().startsWith(value.toLowerCase())
        );

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onGuess(value);
      setValue("");
    }
  }

  return (
    <div className="guess-input">
      <input
        type="text"
        placeholder="Digite o nome do personagem"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="guess-input-field"
      />

      {filtered.length > 0 && (
        <div className="guess-input-list">
          {filtered.map((c) => (
            <button
              key={c.name}
              type="button"
              className="guess-input-item"
              onClick={() => {
                onGuess(c.name);
                setValue("");
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
