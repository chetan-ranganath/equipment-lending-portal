import { useEffect, useMemo, useState } from 'react';

interface AddOrEditValues {
	name: string;
	category: string;
	description: string;
	totalQuantity: number;
	availableQuantity: number;
}

interface Props {
	mode: 'create' | 'edit';
	initial?: AddOrEditValues;
	onSubmit: (values: AddOrEditValues) => Promise<void> | void;
	onCancel?: () => void;
	loading?: boolean;
}

export function EquipmentForm({ mode, initial, onSubmit, onCancel, loading }: Props) {
	const [name, setName] = useState(initial?.name ?? '');
	const [category, setCategory] = useState(initial?.category ?? '');
	const [description, setDescription] = useState(initial?.description ?? '');
	const [totalQuantity, setTotalQuantity] = useState<number>(initial?.totalQuantity ?? 0);
	const [availableQuantity, setAvailableQuantity] = useState<number>(initial?.availableQuantity ?? 0);

	useEffect(() => {
		if (!initial) return;
		setName(initial.name);
		setCategory(initial.category);
		setDescription(initial.description);
		setTotalQuantity(initial.totalQuantity);
		setAvailableQuantity(initial.availableQuantity);
	}, [initial?.name, initial?.category, initial?.description, initial?.totalQuantity, initial?.availableQuantity]);

	const [touched, setTouched] = useState({
		name: false,
		category: false,
		description: false,
		totalQuantity: false,
		availableQuantity: false,
	});
	const [submitted, setSubmitted] = useState(false);

	const errors = useMemo(() => {
		const e: Record<string, string> = {};
		if (!name.trim()) e.name = 'Name is required';
		if (!category.trim()) e.category = 'Category is required';
		if (!description.trim()) e.description = 'Description is required';
		if (!Number.isFinite(totalQuantity) || totalQuantity < 0) e.totalQuantity = 'Total quantity must be ≥ 0';
		if (!Number.isFinite(availableQuantity) || availableQuantity < 0) e.availableQuantity = 'Available quantity must be ≥ 0';
		if (
			Number.isFinite(totalQuantity) &&
			Number.isFinite(availableQuantity) &&
			availableQuantity > totalQuantity
		) {
			e.availableQuantity = 'Available cannot exceed total';
		}
		return e;
	}, [name, category, description, totalQuantity, availableQuantity]);

	const show = (key: keyof typeof touched) => (submitted || touched[key]) && errors[key];

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitted(true);
		if (Object.keys(errors).length) return;
		await onSubmit({
			name: name.trim(),
			category: category.trim(),
			description: description.trim(),
			totalQuantity,
			availableQuantity,
		});
		if (mode === 'create') {
			setName('');
			setCategory('');
			setDescription('');
			setTotalQuantity(0);
			setAvailableQuantity(0);
			setTouched({
				name: false,
				category: false,
				description: false,
				totalQuantity: false,
				availableQuantity: false,
			});
			setSubmitted(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="form">
			<div className="grid">
				<label>
					<span>Name</span>
					<input
						className="input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => setTouched((t) => ({ ...t, name: true }))}
						placeholder="e.g. Camera"
					/>
					{show('name') && <small className="error">{errors.name}</small>}
				</label>

				<label>
					<span>Category</span>
					<input
						className="input"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						onBlur={() => setTouched((t) => ({ ...t, category: true }))}
						placeholder="e.g. Electronics"
					/>
					{show('category') && <small className="error">{errors.category}</small>}
				</label>

				<label style={{ gridColumn: '1 / -1' }}>
					<span>Description</span>
					<textarea
						className="input"
						rows={3}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						onBlur={() => setTouched((t) => ({ ...t, description: true }))}
						placeholder="Short description"
					/>
					{show('description') && <small className="error">{errors.description}</small>}
				</label>

				<label>
					<span>Total Quantity</span>
					<input
						className="input"
						type="number"
						min={0}
						value={totalQuantity}
						onChange={(e) => setTotalQuantity(Number(e.target.value))}
						onBlur={() => setTouched((t) => ({ ...t, totalQuantity: true }))}
					/>
					{show('totalQuantity') && <small className="error">{errors.totalQuantity}</small>}
				</label>

				<label>
					<span>Available Quantity</span>
					<input
						className="input"
						type="number"
						min={0}
						value={availableQuantity}
						onChange={(e) => setAvailableQuantity(Number(e.target.value))}
						onBlur={() => setTouched((t) => ({ ...t, availableQuantity: true }))}
					/>
					{show('availableQuantity') && <small className="error">{errors.availableQuantity}</small>}
				</label>
			</div>

			<div className="actions">
				{onCancel && (
					<button type="button" className="btn ghost" onClick={onCancel} disabled={!!loading}>
						Cancel
					</button>
				)}
				<button type="submit" className="btn primary" disabled={!!loading}>
					{loading ? 'Saving…' : mode === 'create' ? 'Add Equipment' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}