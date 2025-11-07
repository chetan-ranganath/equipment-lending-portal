import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addEquipment } from '../api/equipment';
import type { EquipmentCondition } from '../types';
import { FeedbackModal } from '../equipment-components/FeedbackModal';
import { PageHeader } from '../equipment-components/PageHeader';

const CONDITIONS: EquipmentCondition[] = ['New', 'Good', 'Fair', 'Needs Repair'];

export function AddEquipmentPage() {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [totalQuantity, setTotalQuantity] = useState<number>(0);
	const [availableQuantity, setAvailableQuantity] = useState<number>(0);
	const [condition, setCondition] = useState<EquipmentCondition>('Good');

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);

	const errors = useMemo(() => {
		const e: Record<string, string> = {};
		if (!name.trim()) e.name = 'Name is required';
		if (!category.trim()) e.category = 'Category is required';
		if (!description.trim()) e.description = 'Description is required';
		if (!Number.isFinite(totalQuantity) || totalQuantity < 0) e.totalQuantity = 'Total quantity must be ≥ 0';
		if (!Number.isFinite(availableQuantity) || availableQuantity < 0) e.availableQuantity = 'Available quantity must be ≥ 0';
		if (availableQuantity > totalQuantity) e.availableQuantity = 'Available cannot exceed total';
		if (!CONDITIONS.includes(condition)) e.condition = 'Condition is required';
		return e;
	}, [name, category, description, totalQuantity, availableQuantity, condition]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitted(true);
		if (Object.keys(errors).length) return;
		try {
			setSaving(true);
			await addEquipment({
				name: name.trim(),
				category: category.trim(),
				description: description.trim(),
				totalQuantity,
				availableQuantity,
				condition,
			});
			setError(null);
			setSuccessOpen(true);
		} catch (err: any) {
		 setError(err?.message ?? 'Failed to add equipment');
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<div className="card">
				<div className="card-section">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
						<div style={{ display: 'flex', gap: 8 }}>
							<button className="btn ghost" onClick={() => navigate(-1)}>Back</button>
							<Link to="/" className="btn ghost">Portal</Link>
						</div>
						<h1 style={{ marginLeft: 'auto' }}>Add Equipment</h1>
					</div>

					{error && <div className="error" role="alert" style={{ marginTop: 8 }}>{error}</div>}

					<form onSubmit={handleSubmit} className="form" style={{ marginTop: 10 }}>
						<div className="grid">
							<label>
								<span>Name</span>
								<input className="input" value={name} onChange={(e) => setName(e.target.value)} />
								{submitted && errors.name && <small className="error">{errors.name}</small>}
							</label>
							<label>
								<span>Category</span>
								<input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
								{submitted && errors.category && <small className="error">{errors.category}</small>}
							</label>
							<label style={{ gridColumn: '1 / -1' }}>
								<span>Description</span>
								<textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
								{submitted && errors.description && <small className="error">{errors.description}</small>}
							</label>
							<label>
								<span>Total Quantity</span>
								<input className="input" type="number" min={0} value={totalQuantity} onChange={(e) => setTotalQuantity(Number(e.target.value))} />
								{submitted && errors.totalQuantity && <small className="error">{errors.totalQuantity}</small>}
							</label>
							<label>
								<span>Available Quantity</span>
								<input className="input" type="number" min={0} value={availableQuantity} onChange={(e) => setAvailableQuantity(Number(e.target.value))} />
								{submitted && errors.availableQuantity && <small className="error">{errors.availableQuantity}</small>}
							</label>
							<label>
								<span>Condition</span>
								<select className="input" value={condition} onChange={(e) => setCondition(e.target.value as EquipmentCondition)}>
									{CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
								</select>
								{submitted && errors.condition && <small className="error">{errors.condition}</small>}
							</label>
						</div>
						<div className="actions">
							<button type="submit" className="btn primary" disabled={saving}>
								{saving ? 'Saving…' : 'Add Equipment'}
							</button>
						</div>
					</form>
				</div>
			</div>

			<FeedbackModal
				visible={successOpen}
				message="Equipment added successfully. Redirecting…"
				onDone={() => navigate('/')}
			/>
		</>
	);
}