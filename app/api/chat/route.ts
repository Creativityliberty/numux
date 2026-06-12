import { NextRequest } from "next/server";

export const runtime = "edge";

const fileContents: Record<string, string> = {
  "prompt-brief.md": `[Contenu du fichier prompt-brief.md]
# Brief de Conception - Nümtema AI Workspace Shell
- Structure de l'application :
  1. Barre latérale gauche (Sidebar) rétractable contenant les liens "Accueil", "Nouveau Workspace", "Recherche", "Bibliothèque", "Agents" (badge: 5), "Skills" (badge: 100+), "Templates", et la section "Projets récents".
  2. Panneau central de Chat avec compositeur de prompt en bas, suggestions d'actions rapides (Créer une app, Coder un dashboard, Auditer un projet, etc.).
  3. Barre de navigation verticale (Minimap de conversation) sur le bord droit de la zone de discussion sous forme de tirets horizontaux qui s'animent au survol et font défiler la page.
  4. Panneau latéral droit contextuel extensible avec deux onglets : "Projet" (Todo, Tech stack, Fichiers clés) et "Activité" (journal de réflexion et logs d'exécution des commandes python/bash).
- Charte graphique : Glassmorphic, bordures fines, ombres douces et dégradés de lumière.`,
  
  "theme.json": `[Contenu du fichier theme.json]
{
  "theme": "modern-dark-light",
  "colors": {
    "background": "#fafaf9 (light) / #09090b (dark)",
    "foreground": "#18181b (light) / #f4f4f5 (dark)",
    "primary": "#111827 (light) / #f8fafc (dark)",
    "emerald": "#10b981",
    "border": "#e7e5e4 (light) / #27272a (dark)",
    "glass": "rgba(255, 255, 255, 0.76) / rgba(17, 17, 19, 0.78) with backdrop-blur"
  }
}`,

  "layout-reference.png": `[Description du fichier layout-reference.png]
Wireframe de mise en page:
- Gauche: Barre latérale (w-72 rétractable à w-16, logo Nümtema, boutons de navigation et avatar utilisateur).
- Centre: Zone de chat (header avec sélecteur de modèle et thème, messages empilés au centre, compositeur de prompt flottant).
- Droite: Panneau de contexte extensible (w-80 avec onglets "Projet" et "Activité" de réflexion).`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const model = typeof body?.model === "string" ? body.model : "gpt-oss:20b-cloud";
    
    // Metadata from prompt composer
    const agent = typeof body?.agent === "string" ? body.agent : "Agent Architecte";
    const buildMode = typeof body?.buildMode === "string" ? body.buildMode : "Deep Build";
    const platform = typeof body?.platform === "string" ? body.platform : "Next.js · Vercel";
    const attachments = Array.isArray(body?.attachments) ? body.attachments : [];

    // Construct system instructions
    let systemPrompt = `Tu es l'assistant IA Nümtema Workspace Shell. Tu aides l'utilisateur à concevoir et coder ses projets de manière premium et professionnelle.\n`;
    
    if (agent) {
      systemPrompt += `Postured'Agent active: ${agent}. Adapte tes réponses à ce rôle (ex: si Agent Architecte, donne des choix de conception logicielle structurés, si Agent Développeur, écris directement le code et décris sa structure).\n`;
    }
    if (platform) {
      systemPrompt += `Plateforme cible: ${platform}. Génère du code parfaitement adapté et optimisé pour cette stack.\n`;
    }
    if (buildMode) {
      systemPrompt += `Mode de build actif: ${buildMode}. Si le mode est "Deep Build", sois extrêmement complet dans tes réponses, écris les fichiers de code entiers au lieu de faire des résumés ou de mettre des placeholders.\n`;
    }

    if (attachments.length > 0) {
      systemPrompt += `\nFichiers et contextes de travail joints à la discussion :\n`;
      attachments.forEach((filename: string) => {
        if (fileContents[filename]) {
          systemPrompt += `\n--- Fichier joint: ${filename} ---\n${fileContents[filename]}\n`;
        }
      });
    }

    systemPrompt += `\nConsigne importante de formatage : Génère TOUJOURS tes réponses au format Markdown propre et structuré. Utilise des titres (##, ###), des listes (* ou -) et des blocs de code avec démarcations (\`\`\`lang) pour le code source. Ne renvoie pas de texte brut avec des astérisques non formatés. Ne sors jamais du format Markdown standard.`;

    // Combine system instructions with incoming chat history
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }))
    ];

    // Call Ollama local server
    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      return new Response(`Ollama error: ${errText}`, { status: ollamaResponse.status });
    }

    const reader = ollamaResponse.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const parsed = JSON.parse(trimmed);
                const content = parsed?.message?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (err) {
                // Ignore incomplete lines JSON parsing
              }
            }
          }

          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer.trim());
              const content = parsed?.message?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch (e) {}
          }
        } catch (error) {
          console.error("Streaming error in route:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: any) {
    return new Response(`Server error: ${error?.message || error}`, { status: 500 });
  }
}
