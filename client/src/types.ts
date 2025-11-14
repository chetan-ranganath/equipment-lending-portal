export type EquipmentCondition = 'New' | 'Good' | 'Needs Repair';

export interface Equipment {
	id: string;
	name: string;
	category: string;
	description: string;
	totalQuantity: number;
	availableQuantity: number;
	condition: EquipmentCondition;
}

export interface ApiMessageResponse {
	message: string;
}