// Projects. Shape from DESIGN_SPEC section 8.1 (projects.js). Prose, stacks and facts from COPY.json.
// slots, slotSuffix and trace are derived from DESIGN_SPEC 4.4 (projects) and the AAItrade README
// facts in CONTEXT.md. The trace is a schematic of one decision cycle, not a recorded trade: it
// carries no prices, symbols, latencies or quantities beyond README facts. DecisionTrace generates
// the row index itself and shows a filled circle for the risk row.
export default {
  title: 'Projects',
  intro: 'Projects outside work. AAItrade is the one I would show first: an agent that trades on its own within limits I set.',
  flagship: {
    name: 'AAItrade',
    tagline: 'An autonomous trading agent for NSE. The model decides, a risk layer overrides.',
    year: '2026',
    url: 'https://github.com/Aditya-0156/AAItrade',
    label: 'Flagship',
    summary:
      'AAItrade lets an LLM reason over live market data, technical indicators and news through multi-step tool calls, then place trades on NSE through Zerodha Kite Connect. Independent risk controls sit outside the model and can override any decision it makes.',
    how: [
      {
        label: 'Model decides',
        text: 'Four times a trading day the model pulls prices, indicators, news and portfolio state in any order it chooses. The first slot is observe-only; in the rest it can trade through a tool call.',
      },
      {
        label: 'Risk layer overrides',
        text: 'Risk controls sit outside the model, and a rejected trade comes back with the reason and a corrected maximum quantity in the same cycle.',
      },
      {
        label: 'Everything persisted',
        text: 'A 13-table SQLite store holds the full decision history, so the agent recovers from a crash without losing state.',
      },
      {
        label: 'Paper and live',
        text: 'Paper and live modes share identical code paths, so what I test on paper is exactly what would run live.',
      },
      {
        label: 'Remote control',
        text: 'A Telegram bot reports status and can pause, resume or stop the agent, and price alerts polled every 30 seconds wake it between cycles.',
      },
    ],
    stack: [
      'Python',
      'SQLite',
      'Claude API',
      'Zerodha Kite Connect',
      'FastAPI',
      'React',
      'TypeScript',
      'Telegram',
      'systemd',
    ],
    // The four fixed decision slots per NSE trading day. The first is observe-only.
    // `depicted` marks the slot the schematic below walks through.
    slots: [
      { time: '09:30', label: 'Observe' },
      { time: '11:00', depicted: true },
      { time: '12:30' },
      { time: '14:00' },
    ],
    slotSuffix: 'IST',
    trace: {
      slotLabel: 'Slot 11:00 IST · Schematic',
      caption: 'Schematic of one decision cycle. Illustrative; not a recorded trade.',
      rows: [
        { kind: 'tool', label: 'prices', detail: 'live market data' },
        { kind: 'tool', label: 'ohlcv', detail: 'price candles' },
        { kind: 'tool', label: 'indicators', detail: 'RSI, MACD, Bollinger, EMA, ATR' },
        { kind: 'tool', label: 'news', detail: 'news and web search' },
        { kind: 'tool', label: 'portfolio_state', detail: 'open positions' },
        { kind: 'model', label: 'place_order', detail: 'proposed trade' },
        { kind: 'risk', label: 'rejected', detail: 'reason, corrected max quantity' },
        { kind: 'model', label: 'place_order', detail: 'retry at corrected quantity' },
        { kind: 'tool', label: 'executed', detail: 'via Zerodha Kite Connect' },
        { kind: 'note', label: 'session memory', detail: 'persisted, 2,880 characters max' },
      ],
    },
    facts: [
      { label: 'Decision slots', value: '4 per trading day' },
      { label: 'Decision store', value: '13 SQLite tables' },
      { label: 'Risk profiles', value: 'Safe, Balanced, Aggressive' },
      { label: 'Drawdown halt', value: '20% per session' },
    ],
    repoLabel: 'Repository',
  },
  secondary: [
    {
      name: 'RAG Document Q&A',
      tagline: 'Ask questions of your own documents.',
      year: '2025',
      url: 'https://github.com/Aditya-0156/RAG',
      summary:
        'An end-to-end retrieval pipeline: it ingests PDF, DOCX, TXT and Markdown, chunks and embeds them, and retrieves matching passages through semantic search in under a second. It runs as a CLI and as a web UI with drag-and-drop upload.',
      stack: ['Python', 'LangChain', 'ChromaDB', 'Google Gemini', 'FastAPI'],
    },
    {
      name: 'Stick Hero',
      tagline: 'A Stick Hero clone in JavaFX, built as a college project.',
      year: 'College project',
      url: 'https://github.com/Aditya-0156/Stick-Hero-JavaFX',
      summary:
        'A Stick Hero game in JavaFX. The stick is a Singleton, scene switching goes through a SceneFactory with polymorphic switchers, and three characters have sprite-based walk animations. It has save and load, high scores and a revive system.',
      stack: ['Java', 'JavaFX', 'Maven'],
    },
  ],
  moreLabel: 'More on GitHub',
  more: [
    {
      name: 'Vector-Borne Disease Prediction',
      url: 'https://github.com/Aditya-0156/Vector-Borne-Disease-Prediction',
      note: 'Multi-class classifier across five disease categories with Random Forest and SVM.',
    },
    {
      name: 'Network Security',
      url: 'https://github.com/Aditya-0156/Network-Security',
      note: 'Packet analysis and monitoring utilities from coursework.',
    },
  ],
}
