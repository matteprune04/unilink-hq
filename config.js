// Configurazione pubblica di UniLink HQ.
// L'URL e la chiave "anon" di Supabase sono pensati per stare nel browser: i dati
// sono protetti dalle regole del database, leggibili solo dopo l'accesso con la password del team.
window.HQ_CONFIG = {
  supabaseUrl: "INCOLLA_QUI_PROJECT_URL",
  supabaseAnonKey: "INCOLLA_QUI_ANON_KEY",
  teamEmail: "hq@unilinkfirenze.it", // account unico del team (non riceve email)
  founders: [],                      // nomi suggeriti nella schermata di accesso, es. ["Matteo", "…"]
};
