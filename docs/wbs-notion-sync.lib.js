const PRIORITY_MAP = {
  Must: 'High',
  Should: 'Medium',
  Could: 'Low',
  "Won't": 'Low',
};

function extractPriority(text) {
  const match = text.match(/^(.*?)\s*\[(Must|Should|Could|Won't)\]\s*$/);
  return match
    ? { title: match[1].trim(), priority: match[2] }
    : { title: text.trim(), priority: null };
}

function richText(content) {
  if (!content) return [];
  const chunks = content.match(/[\s\S]{1,2000}/g) ?? [];
  return chunks.map((chunk) => ({ text: { content: chunk } }));
}

export function parseWbsMarkdown(markdown) {
  const tasks = [];
  let section = null;
  let current = null;

  for (const raw of markdown.split(/\r?\n/)) {
    const trimmed = raw.trim();
    const sectionMatch = trimmed.match(/^###\s+(.+)$/);
    if (sectionMatch) {
      section = sectionMatch[1].trim();
      current = null;
      continue;
    }

    const taskMatch = trimmed.match(/^- \[([ xX])\]\s+(.+)$/);
    if (taskMatch && section) {
      const { title, priority } = extractPriority(taskMatch[2]);
      current = {
        section,
        title,
        priority,
        checked: taskMatch[1].toLowerCase() === 'x',
        bodyLines: [],
      };
      tasks.push(current);
      continue;
    }

    if (current && trimmed) current.bodyLines.push(raw.replace(/^ {2}/, '').trimEnd());
  }

  return tasks.map(({ bodyLines, ...task }) => ({
    ...task,
    description: bodyLines.join('\n'),
    syncKey: `wbs:${task.section}:${task.title}`,
  }));
}

export function resolveStatus(checked, currentStatus) {
  if (checked) return 'Done';
  return currentStatus === 'In progress' ? 'In progress' : 'Not started';
}

export function buildNotionProperties(task, status, parentPageId) {
  const properties = {
    'Task name': { title: richText(task.title) },
    Status: { status: { name: status } },
    Priority: { select: task.priority ? { name: PRIORITY_MAP[task.priority] } : null },
    Section: { select: { name: task.section } },
    Description: { rich_text: richText(task.description) },
    'Sync Key': { rich_text: richText(task.syncKey) },
  };
  if (parentPageId) properties['Parent task'] = { relation: [{ id: parentPageId }] };
  return properties;
}

export function buildSectionProperties(section) {
  return {
    'Task name': { title: richText(section) },
    Status: { status: { name: 'Not started' } },
    Priority: { select: null },
    Section: { select: { name: section } },
    Description: { rich_text: [] },
    'Sync Key': { rich_text: richText(`wbs-section:${section}`) },
  };
}

function contentBlock(type, content) {
  return {
    object: 'block',
    type,
    [type]: { rich_text: richText(content) },
  };
}

export function buildContentBlocks(description) {
  const blocks = [];
  for (const raw of description.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const heading = line.match(/^\*\s+\*\*(목적|작업 내용|완료 조건\(AC\))\*\*:\s*(.*)$/);
    if (heading) {
      blocks.push(contentBlock('heading_2', heading[1]));
      if (heading[2]) blocks.push(contentBlock('paragraph', heading[2]));
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    blocks.push(contentBlock(bullet ? 'bulleted_list_item' : 'paragraph', bullet?.[1] ?? line));
  }
  return blocks;
}

export function readPageSnapshot(page) {
  const plainText = (values = []) => values.map((value) => value.plain_text ?? '').join('');
  const properties = page.properties ?? {};
  return {
    title: plainText(properties['Task name']?.title),
    status: properties.Status?.status?.name ?? null,
    priority: properties.Priority?.select?.name ?? null,
    section: properties.Section?.select?.name ?? null,
    description: plainText(properties.Description?.rich_text),
    syncKey: plainText(properties['Sync Key']?.rich_text),
    parentId: properties['Parent task']?.relation?.[0]?.id ?? null,
  };
}

export function taskSnapshot(task, status, parentId = null) {
  return {
    title: task.title,
    status,
    priority: task.priority ? PRIORITY_MAP[task.priority] : null,
    section: task.section,
    description: task.description,
    syncKey: task.syncKey,
    parentId,
  };
}
