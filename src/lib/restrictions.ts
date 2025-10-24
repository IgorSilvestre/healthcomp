import { randomUUID } from "node:crypto";
import { redis } from "./redis";

export type RestrictionCategory = "alimento" | "atividade";

export interface RestrictionItem {
  id: string;
  categoria: RestrictionCategory;
  titulo: string;
  detalhes?: string;
}

const RESTRICTION_IDS_KEY = "care:restrictions";
const RESTRICTION_KEY_PREFIX = "care:restriction:";
const restrictionKey = (id: string) => `${RESTRICTION_KEY_PREFIX}${id}`;

export async function getRestrictions(): Promise<RestrictionItem[]> {
  const ids = await redis.smembers(RESTRICTION_IDS_KEY);
  if (ids.length === 0) return [];
  const raws = await redis.mget(ids.map((id) => restrictionKey(id)));
  return raws
    .map((raw) => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as RestrictionItem;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as RestrictionItem[];
}

export async function addRestriction(input: {
  categoria: RestrictionCategory;
  titulo: string;
  detalhes?: string;
}): Promise<RestrictionItem> {
  const categoria = input.categoria;
  const titulo = input.titulo.trim();
  const detalhes = input.detalhes?.trim() || undefined;

  if (!titulo) throw new Error("Título é obrigatório.");
  if (categoria !== "alimento" && categoria !== "atividade")
    throw new Error("Categoria inválida.");

  // deduplicar por título + categoria
  const existing = await getRestrictions();
  const duplicate = existing.find(
    (r) =>
      r.categoria === categoria &&
      r.titulo.toLocaleLowerCase() === titulo.toLocaleLowerCase(),
  );
  if (duplicate) return duplicate;

  const id = randomUUID();
  const payload: RestrictionItem = { id, categoria, titulo, detalhes };
  await redis
    .multi()
    .sadd(RESTRICTION_IDS_KEY, id)
    .set(restrictionKey(id), JSON.stringify(payload))
    .exec();
  return payload;
}

export async function deleteRestriction(id: string) {
  await redis
    .multi()
    .srem(RESTRICTION_IDS_KEY, id)
    .del(restrictionKey(id))
    .exec();
}
