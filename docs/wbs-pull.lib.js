const PRIORITY_TAG_BY_PROJECT_VALUE = {
  P0: 'Must',
  P1: 'Should',
  P2: 'Could',
};

function normalizeTitle(title) {
  return title
    .trim()
    .replace(/\s+\[(Must|Should|Could|Won't)\]\s*$/, '')
    .replace(/^(?:\[[^\]]+\]\s*)+/, '')
    .trim();
}

export function normalizeProjectItem(item) {
  if (!item?.content || !['ISSUE', 'DRAFT_ISSUE'].includes(item.type)) return null;

  const { content } = item;
  return {
    marker: `${item.type}:${content.id}`,
    number: content.number ?? null,
    title: content.title.trim(),
    body: content.body?.trim() ?? '',
    checked: content.state === 'CLOSED' || item.status?.toLowerCase() === 'done',
    priorityTag: PRIORITY_TAG_BY_PROJECT_VALUE[item.priority] ?? null,
  };
}

export function projectItemsFromConnection(connection) {
  return (connection?.nodes ?? [])
    .map((item) => {
      const fields = Object.fromEntries(
        (item.fieldValues?.nodes ?? [])
          .filter((value) => value?.field?.name && typeof value.name === 'string')
          .map((value) => [value.field.name, value.name]),
      );
      return normalizeProjectItem({
        ...item,
        status: fields.Status,
        priority: fields.Priority,
      });
    })
    .filter(Boolean);
}

export function findUntrackedItems(wbs, items) {
  const markers = new Set(
    [...wbs.matchAll(/<!--\s*github-item:([^>]+?)\s*-->/g)].map((match) => match[1].trim()),
  );
  const titles = new Set(
    [...wbs.matchAll(/^- \[[ xX]\]\s+(.+)$/gm)].map((match) => normalizeTitle(match[1])),
  );
  for (const match of wbs.matchAll(/^###\s+(.+)$/gm)) titles.add(normalizeTitle(match[1]));

  return items.filter(
    (item) => !markers.has(item.marker) && !titles.has(normalizeTitle(item.title)),
  );
}

export function renderImportedItems(items) {
  return items
    .map((item) => {
      const checkbox = item.checked ? 'x' : ' ';
      const priority = item.priorityTag ? ` [${item.priorityTag}]` : '';
      const body = item.body
        ? `\n${item.body
            .split(/\r?\n/)
            .map((line) => `  ${line}`)
            .join('\n')}`
        : '';
      return `- [${checkbox}] ${item.title}${priority}\n  <!-- github-item:${item.marker} -->${body}`;
    })
    .join('\n');
}

export function renderImportedSection(items) {
  return `### GitHub Project 가져오기\n${renderImportedItems(items)}\n`;
}

export function appendImportedItems(wbs, items) {
  const header = '### GitHub Project 가져오기';
  if (!wbs.includes(header)) {
    const separator = wbs.endsWith('\n') ? '\n' : '\n\n';
    return `${wbs}${separator}${renderImportedSection(items)}`;
  }

  const sectionStart = wbs.indexOf(header);
  const nextSectionOffset = wbs.slice(sectionStart + header.length).search(/\n###\s+/);
  const rendered = renderImportedItems(items);

  if (nextSectionOffset === -1) {
    return `${wbs.trimEnd()}\n${rendered}\n`;
  }

  const insertionPoint = sectionStart + header.length + nextSectionOffset;
  const before = wbs.slice(0, insertionPoint).trimEnd();
  const after = wbs.slice(insertionPoint).replace(/^\n+/, '');
  return `${before}\n${rendered}\n\n${after}`;
}
