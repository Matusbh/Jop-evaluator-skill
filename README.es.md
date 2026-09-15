# job-evaluator

**[English](README.md) | [Español](README.es.md)**

Una Skill de Claude que evalúa ofertas de trabajo contra **tu propio** perfil de candidato y, cuando encaja, genera un CV de una página y una carta de presentación adaptados, en PDF, listos para enviar.

Le pegas una oferta (texto o captura de pantalla) y te dice directamente: aplica, no aplica, o aquí está el matiz — antes de tocar siquiera el CV.

Esta skill no incluye datos personales de nadie. La primera vez que la usas, construye tu perfil a partir de tu propio CV o de una entrevista corta, y lo reutiliza para cada oferta que le mandes después.

## Qué hace

Para cada oferta que le envíes, `job-evaluator` sigue siempre el mismo proceso, en vez de un criterio distinto e inconsistente cada vez:

1. **Comprueba duplicados** — si ya evaluó esa empresa + puesto, te lo dice en vez de repetir el trabajo.
2. **Comprueba bloqueadores duros** — stack/dominio incompatible, experiencia requerida que no tienes, una titulación no negociable que no posees, un idioma que no dominas, una ubicación fuera de tus mercados objetivo, un tipo de contrato que ya has descartado. Cualquiera de estos → un "no aplica" inmediato, en una línea, sin generar nada.
   - Excepción: si el único bloqueador de toda la oferta son los años de experiencia, aplica automáticamente sin preguntar.
3. **Señala matices** — casos que no son un rechazo directo pero merecen una decisión tuya (por ejemplo, un requisito de titulación que también dice "o experiencia equivalente", o un puesto cercano pero no exactamente lo que buscas). Te explica el matiz y espera tu respuesta.
4. **Confirma un encaje limpio** — sin bloqueadores ni matices — y espera tu confirmación antes de generar nada.
5. **Genera el CV + la carta** — adaptados a esa oferta concreta, en el idioma correcto, en una página, en PDF. Toma cada dato de tu perfil; nunca inventa experiencia, habilidades o estudios que no tienes.
6. **Te entrega los archivos** junto con una estimación del sueldo medio mensual en una sola línea — sin explicaciones largas, sin repetirte la carta en el chat.

## Cómo funciona

- La skill es un único archivo `SKILL.md` más dos recursos de apoyo:
  - `references/candidate-profile.md` — una plantilla que Claude rellena *por ti*, la primera vez que usas la skill (leyendo un CV que subas, o haciéndote un conjunto corto de preguntas: stack, proyectos, estudios, idiomas, mercados objetivo, expectativa salarial, cualquier cosa con la que explícitamente no quieras que te encajen). Aquí es donde viven tus datos personales, y se quedan solo en tu propia copia de la skill.
  - `scripts/generate_docs.js` — un generador de documentos reutilizable (Node.js + el paquete `docx`) que Claude rellena para cada solicitud y convierte a PDF. Tener un único generador en vez de código hecho a mano por empresa mantiene el formato consistente en todos los CV.
- Todo lo demás — las reglas de bloqueadores, de idioma, de formato, de entrega — vive en `SKILL.md` como instrucciones en lenguaje llano que Claude sigue paso a paso.
- La skill decide los bloqueadores duros comparando la oferta con *tu* perfil, no con una lista fija — así funciona para cualquier stack, puesto o mercado, no solo desarrollo de software.

## Instalación

### Opción A — Claude.ai (web / app de escritorio / móvil)

Necesitas un plan Pro, Max, Team o Enterprise, con **Code execution and file creation** activado (Settings → Capabilities) — esto es lo que permite generar los archivos PDF.

1. Descarga este repositorio como ZIP (o clónalo y comprime tú mismo la carpeta `job-evaluator/`). Asegúrate de que la carpeta dentro del ZIP se llame `job-evaluator` — el nombre de la carpeta debe coincidir con el campo `name` de la skill.
2. En Claude.ai, ve a **Settings → Customize → Skills**.
3. Pulsa **"+"** → **"Create skill"** → **Upload a skill**, y selecciona el ZIP.
4. Cuando aparezca en tu lista de skills, actívala (toggle on).
5. Abre un chat nuevo, sube tu CV (o simplemente di que quieres configurar tu perfil), y sigue desde ahí.

### Opción B — Claude Code (terminal)

1. Clona o descarga este repositorio.
2. Copia la carpeta `job-evaluator/` a uno de los directorios de skills de Claude Code:
   - `~/.claude/skills/job-evaluator/` — disponible en todos los proyectos
   - `.claude/skills/job-evaluator/` — disponible solo en el proyecto actual
3. Claude Code la detecta automáticamente — no hace falta activarla.
4. En una sesión, pega una oferta de trabajo o pregunta "¿esto encaja conmigo?" y Claude recurrirá a la skill por su cuenta (o la invocará directamente si tu versión de Claude Code soporta comandos con barra para skills).

**Nota:** una skill instalada en Settings de Claude.ai no la ve Claude Code, y viceversa — hay que instalarla por separado en cada sitio donde quieras usarla.

## Primera ejecución — configurar tu perfil

La primera vez que se active la skill, hará una de estas dos cosas:
- leer un CV que subas y mostrarte lo que extrajo, para que corrijas lo que haga falta, o
- hacerte un puñado de preguntas cortas (datos de contacto, stack, 2-4 proyectos, estudios, idiomas, mercados objetivo, rango salarial, cualquier cosa con la que no quieras que te encajen).

Ese perfil se guarda en `references/candidate-profile.md`, dentro de tu propia copia de la skill, y se reutiliza en cada oferta a partir de entonces. Actualízalo cuando algo cambie (terminaste un proyecto, actualizaste tu expectativa salarial, etc.) — basta con que le digas a Claude qué ha cambiado.

## Requisitos para generar el PDF

`scripts/generate_docs.js` necesita Node.js con el paquete `docx`, y LibreOffice (`soffice`) para el paso de conversión de DOCX a PDF. Esto funciona de serie en cualquier sitio donde Claude tenga ejecución de código disponible (Claude.ai con Code execution activado, o Claude Code). Sin eso, Claude puede seguir haciendo toda la evaluación y redactar la carta como texto, simplemente no generará el PDF automáticamente.

## Una nota sobre confianza

Como con cualquier skill que instales de internet, revisa el `SKILL.md` y los scripts antes de instalarla — comprueba que no pida leer credenciales, claves de API, ni enviar tus datos a ningún sitio fuera del propósito declarado de la skill. Esta skill solo lee lo que tú le das (tu CV, las ofertas que le pegas) y escribe archivos locales (tu perfil, el CV/carta generados).

## Licencia

MIT — úsala, haz un fork, adáptala a tu propio mercado y flujo de trabajo.
