import { randomUUID } from "node:crypto";
import { redis } from "./redis";
import { PURPOSES, type Purpose } from "./constants";

export interface MedicationCatalogItem {
  id: string;
  name: string;
  purpose: Purpose;
}

const MED_IDS_KEY = "care:meds";
const MED_KEY_PREFIX = "care:med:";
const medKey = (id: string) => `${MED_KEY_PREFIX}${id}`;

export async function getMedications(): Promise<MedicationCatalogItem[]> {
  const ids = await redis.smembers(MED_IDS_KEY);
  if (ids.length === 0) return [];
  const raws = await redis.mget(ids.map((id) => medKey(id)));
  return raws
    .map((raw) => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as MedicationCatalogItem;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as MedicationCatalogItem[];
}

export async function addMedicationToCatalog(input: {
  name: string;
  purpose: Purpose;
}): Promise<MedicationCatalogItem> {
  const name = input.name.trim();
  const purpose = input.purpose;
  if (!name) throw new Error("Nome do medicamento é obrigatório.");
  if (!PURPOSES.includes(purpose)) throw new Error("Propósito inválido.");

  const existing = await getMedications();
  const duplicate = existing.find(
    (m) => m.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
  if (duplicate) return duplicate;

  const id = randomUUID();
  const payload: MedicationCatalogItem = { id, name, purpose };
  await redis
    .multi()
    .sadd(MED_IDS_KEY, id)
    .set(medKey(id), JSON.stringify(payload))
    .exec();
  return payload;
}

export async function deleteMedicationFromCatalog(id: string) {
  await redis
    .multi()
    .srem(MED_IDS_KEY, id)
    .del(medKey(id))
    .exec();
}
