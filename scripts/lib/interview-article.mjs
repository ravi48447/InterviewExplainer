const architecturePattern = /\b(system design|architecture|design .+ system|scalability|distributed|microservices?)\b/i;

export function interviewWordCount(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function bulletParagraphs(value) {
  return String(value ?? "")
    .trim()
    .split(/\n\s*\n/)
    .map((part) => part.replace(/^\s*[-*+]\s+/, "").trim())
    .filter(Boolean);
}

export function isDenseBulletInterview(value) {
  const markdown = String(value ?? "").trim();
  if (!markdown || /^(?:#{1,6}\s|```|\|)/m.test(markdown)) return false;

  const listMarkers = markdown.match(/^\s*[-*+]\s+/gm) ?? [];
  if (listMarkers.length < 4) return false;

  const bullets = bulletParagraphs(markdown);

  const averageWords = bullets.reduce(
    (total, bullet) => total + interviewWordCount(bullet),
    0,
  ) / bullets.length;

  return interviewWordCount(markdown) >= 140 && averageWords >= 30;
}

function groupIntoFive(paragraphs) {
  if (paragraphs.length <= 5) return paragraphs;

  const groups = Array.from({ length: 5 }, () => []);
  for (let index = 0; index < paragraphs.length; index += 1) {
    const group = Math.min(4, Math.floor((index * 5) / paragraphs.length));
    groups[group].push(paragraphs[index]);
  }
  return groups.filter((group) => group.length > 0).map((group) => group.join(" "));
}

export function formatInterviewArticle(value) {
  const original = String(value ?? "");
  if (!isDenseBulletInterview(original)) return original;
  return groupIntoFive(bulletParagraphs(original)).join("\n\n");
}

export function interviewAnswerSize(content, question = {}) {
  const words = interviewWordCount(content);
  const context = `${question.question ?? ""} ${question.title ?? ""} ${question.layout_type ?? ""}`;
  if (architecturePattern.test(context) || words > 420) return "deep";
  return words <= 240 ? "compact" : "standard";
}
