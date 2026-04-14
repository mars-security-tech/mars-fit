// Integración con Claude API para reconocer comidas desde foto.
// La clave se guarda en localStorage y nunca se expone en el repo.
// Nota: en producción, esta llamada debe ir por un proxy seguro.
// Para el MVP permitimos clave de usuario en localStorage para validar UX.

const KEY_LS = "marsfit.claude.key";
const MODEL = "claude-opus-4-5";

export function getApiKey() {
  return localStorage.getItem(KEY_LS);
}
export function setApiKey(k) {
  if (!k) localStorage.removeItem(KEY_LS);
  else localStorage.setItem(KEY_LS, k);
}

// Convierte File/Blob a base64 puro
export async function fileToBase64(file) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Pide a Claude que identifique el plato y estime macros.
export async function analyzeMealPhoto(file) {
  const key = getApiKey();
  if (!key) throw new Error("Añade tu API key de Claude en Perfil → Integraciones.");
  const mimeType = file.type || "image/jpeg";
  const data = await fileToBase64(file);

  const body = {
    model: MODEL,
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mimeType, data } },
        { type: "text", text: `Eres un nutricionista. Mira esta foto de una comida y devuélveme SOLO JSON válido con este formato exacto:
{
  "items": ["ingrediente 1", "ingrediente 2"],
  "meal_name": "Nombre del plato",
  "kcal": 450,
  "protein_g": 35,
  "carbs_g": 40,
  "fats_g": 15,
  "confidence": 0.0-1.0,
  "notes": "breve nota"
}
Estima las raciones y macros con tu mejor criterio. No incluyas texto fuera del JSON.` }
      ]
    }]
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude API ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json.content?.[0]?.text || "";
  // Extrae JSON robusto
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Respuesta sin JSON: " + text.slice(0, 200));
  return JSON.parse(match[0]);
}
