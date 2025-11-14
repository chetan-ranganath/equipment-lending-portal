import type { Equipment } from '../types';

interface Props {
	items: Equipment[];
	onEdit?: (item: Equipment) => void;
	onDelete?: (item: Equipment) => void;
	showDescription?: boolean;
}

export function EquipmentTable({ items, onEdit, onDelete, showDescription = false }: Props) {
	return (
		<div className="table-wrapper">
			<table className="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Category</th>
						{showDescription && <th>Description</th>}
						<th className="num">Total</th>
						<th className="num">Available</th>
						{(onEdit || onDelete) && <th className="actions-col">Actions</th>}
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr>
							<td colSpan={showDescription ? 6 : 5} className="empty">No items.</td>
						</tr>
					) : (
						items.map((it) => (
							<tr key={it.id}>
								<td>{it.name}</td>
								<td>{it.category}</td>
								{showDescription && <td>{it.description}</td>}
								<td className="num">{it.totalQuantity}</td>
								<td className="num">{it.availableQuantity}</td>
								{(onEdit || onDelete) && (
									<td className="actions-col">
										{onEdit && <button className="btn" onClick={() => onEdit(it)}>Edit</button>}
										{onDelete && <button className="btn danger" onClick={() => onDelete(it)}>Delete</button>}
									</td>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}