import type { Equipment, ApiMessageResponse, EquipmentCondition } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function http<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, {
		headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
		credentials: 'include',
		...init,
	});
	if (!res.ok) {
		let msg = `HTTP ${res.status}`;
		try {
			const text = await res.text();
			if (text) {
				const j = JSON.parse(text);
				if (j?.message) msg = j.message;
			}
		} catch {}
		throw new Error(msg);
	}
	const text = await res.text();
	if (!text) return undefined as unknown as T;
	try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

export function listEquipment() {
	return http<Equipment[]>(`${BASE_URL}/api/equipment`, { method: 'GET' });
}

export function addEquipment(input: {
	name: string;
	category: string;
	description: string;
	totalQuantity: number;
	availableQuantity: number;
	condition: EquipmentCondition;
}) {
	return http<Equipment>(`${BASE_URL}/api/equipment`, {
		method: 'POST',
		body: JSON.stringify(input),
	});
}

export function updateEquipment(
	id: string,
	input: Partial<{
		name: string;
		category: string;
		description: string;
		totalQuantity: number;
		availableQuantity: number;
		condition: EquipmentCondition;
	}>
) {
	return http<ApiMessageResponse>(`${BASE_URL}/api/equipment/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	});
}

export async function deleteEquipment(id: string): Promise<void> {
	await http<void>(`${BASE_URL}/api/equipment/${id}`, { method: 'DELETE' });
}