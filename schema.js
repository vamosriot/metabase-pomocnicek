// schema.js (ES module)

/** TTL pro cache: 1 den (ms) */
const TTL = 24 * 60 * 60 * 1_000;

export async function getSchema() {
  const now = Date.now();
  const { cachedSchema, cachedAt } = await chrome.storage.local.get([
    'cachedSchema', 'cachedAt'
  ]);

  if (cachedSchema && cachedAt && now - cachedAt < TTL) {
    return cachedSchema;               // vrátíme z cache
  }

  // 1. seznam DB, filtrujeme jen ty, které uživatel vidí
  const dbs = await fetch('/api/database', { credentials: 'same-origin' })
    .then(r => r.json());

  // 2. pro každou DB stáhneme metadata (paralelně)
  const meta = await Promise.all(
    dbs.map(db =>
      fetch(`/api/database/${db.id}/metadata`, { credentials: 'same-origin' })
        .then(r => r.json())
    )
  );

  // 3. Osekáme jen to, co AI potřebuje
  const tidy = meta.flatMap(db =>
    db.tables.map(t => ({
      name: `${db.name}.${t.name}`,   // “warehouse.customers”
      description: t.description,
      fields: t.fields.map(f => ({
        name: f.name,
        type: f.base_type,            // integer / varchar / …
        fk: f.foreign_key_field_id
      }))
    }))
  );

  await chrome.storage.local.set({ cachedSchema: tidy, cachedAt: now });
  return tidy;
}
