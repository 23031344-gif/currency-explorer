/* MISIÓN 10: ajustes responsive y de usabilidad */

/* Foco visible al navegar con teclado */
.primary:focus-visible,
.swap:focus-visible {
  outline: 3px solid rgba(22, 117, 139, .35);
  outline-offset: 2px;
}

/* Celulares angostos: los selectores se apilan y el botón ⇄ se pone vertical */
@media (max-width: 420px) {
  .app-shell { padding: 16px 12px; }
  .hero h1 { font-size: 1.8rem; }
  .currency-grid { grid-template-columns: 1fr; gap: 10px; }
  .swap { width: 48px; justify-self: center; rotate: 90deg; }
  .result strong { font-size: 1.15rem; }
}
