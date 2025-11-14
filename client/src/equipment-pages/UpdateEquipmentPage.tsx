import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Equipment, EquipmentCondition } from '../types';
import { listEquipment, updateEquipment } from '../api/equipment';
import { FeedbackModal } from '../equipment-components/FeedbackModal';
import { PageHeader } from '../equipment-components/PageHeader';

const CONDITIONS: EquipmentCondition[] = ['New', 'Good', 'Fair', 'Needs Repair'];

export function UpdateEquipmentPage() {
	const navigate = useNavigate();

	const [items, setItems] = useState<Equipment[]>([]);
	const [selected, setSelected] = useState<Equipment | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successOpen, setSuccessOpen] = useState(false);

	// Search + pagination (list view)
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// New values entered by user (blank means keep existing)
	const [nName, setNName] = useState('');
	const [nCategory, setNCategory] = useState('');
	const [nDescription, setNDescription] = useState('');
	const [nTotal, setNTotal] = useState<string>('');
	const [nAvail, setNAvail] = useState<string>('');
	const [nCondition, setNCondition] = useState<EquipmentCondition | ''>('');

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const data = await listEquipment();
				if (mounted) setItems(data);
			} catch (e: any) {
				setError(e?.message ?? 'Failed to load equipment');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((it) =>
			[it.name, it.category, it.description, it.condition, String(it.totalQuantity), String(it.availableQuantity)]
				.some((v) => (v ?? '').toLowerCase().includes(q))
		);
	}, [items, query]);

	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIdx = (currentPage - 1) * pageSize;
	const pageItems = filtered.slice(startIdx, startIdx + pageSize);

	useEffect(() => {
		setPage(1);
	}, [query, pageSize]);

	function prevPage() { setPage((p) => Math.max(1, p - 1)); }
	function nextPage() { setPage((p) => Math.min(totalPages, p + 1)); }

	function beginEdit(it: Equipment) {
		setSelected(it);
		setError(null);
		setSuccessOpen(false);
		setNName('');
		setNCategory('');
		setNDescription('');
		setNTotal('');
		setNAvail('');
		setNCondition('');
	}

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!selected) return;

		const payload: Record<string, unknown> = {};
		if (nName.trim()) payload.name = nName.trim();
		if (nCategory.trim()) payload.category = nCategory.trim();
		if (nDescription.trim()) payload.description = nDescription.trim();
		if (nTotal !== '' && !Number.isNaN(Number(nTotal))) payload.totalQuantity = Number(nTotal);
		if (nAvail !== '' && !Number.isNaN(Number(nAvail))) payload.availableQuantity = Number(nAvail);
		if (nCondition !== '') payload.condition = nCondition;

		if (Object.keys(payload).length === 0) { setError('Enter at least one new value to update.'); return; }
		if (
			payload.totalQuantity !== undefined &&
			payload.availableQuantity !== undefined &&
			(payload.availableQuantity as number) > (payload.totalQuantity as number)
		) { setError('Available cannot exceed total.'); return; }

		try {
			setSaving(true);
			await updateEquipment(selected.id, payload);
			setItems((prev) =>
				prev.map((it) =>
					it.id === selected.id
						? {
								...it,
								...(payload.name ? { name: payload.name as string } : {}),
								...(payload.category ? { category: payload.category as string } : {}),
								...(payload.description ? { description: payload.description as string } : {}),
								...(payload.totalQuantity !== undefined ? { totalQuantity: payload.totalQuantity as number } : {}),
								...(payload.availableQuantity !== undefined ? { availableQuantity: payload.availableQuantity as number } : {}),
								...(payload.condition ? { condition: payload.condition as EquipmentCondition } : {}),
						  }
						: it
				)
			);
			setSuccessOpen(true);
		} catch (err: any) {
			setError(err?.message ?? 'Failed to update equipment');
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
						<h1 style={{ marginLeft: 'auto' }}>Update Equipment</h1>
					</div>

					{!selected ? (
						<>
							<div className="list-header" style={{ marginTop: 8, gap: 10 }}>
								<input
									className="input"
									placeholder="Search…"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
								/>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<span style={{ color: '#9ca3af' }}>Rows:</span>
									<select className="input" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
										<option value={5}>5</option>
										<option value={10}>10</option>
										<option value={20}>20</option>
										<option value={50}>50</option>
									</select>
								</div>
							</div>

							{loading ? (
								<p style={{ color: '#9ca3af' }}>Loading…</p>
							) : totalItems === 0 ? (
								<p style={{ color: '#9ca3af' }}>No items.</p>
							) : (
								<>
									<div className="table-wrapper" style={{ marginTop: 10 }}>
										<table className="table">
											<thead>
												<tr>
													<th>Name</th>
													<th>Category</th>
													<th>Condition</th>
													<th className="num">Total</th>
													<th className="num">Available</th>
													<th className="actions-col">Actions</th>
												</tr>
											</thead>
											<tbody>
												{pageItems.map((it) => (
													<tr key={it.id}>
														<td>{it.name}</td>
														<td>{it.category}</td>
														<td>{it.condition}</td>
														<td className="num">{it.totalQuantity}</td>
														<td className="num">{it.availableQuantity}</td>
														<td className="actions-col">
															<button className="btn" onClick={() => beginEdit(it)}>Edit</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
										<span style={{ color: '#9ca3af' }}>
											Page {currentPage} of {totalPages} — {totalItems} item{totalItems === 1 ? '' : 's'}
										</span>
										<div style={{ display: 'flex', gap: 8 }}>
											<button className="btn" onClick={prevPage} disabled={currentPage <= 1}>Prev</button>
											<button className="btn" onClick={nextPage} disabled={currentPage >= totalPages}>Next</button>
										</div>
									</div>
								</>
							)}
						</>
					) : (
						<form onSubmit={handleSave} className="form" style={{ marginTop: 12 }}>
							{error && <div className="error" role="alert" style={{ marginBottom: 8 }}>{error}</div>}

							<div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
								<label>
									<span>Existing Name</span>
									<input className="input" value={selected.name} readOnly />
								</label>
								<label>
									<span>New Name</span>
									<input className="input" value={nName} onChange={(e) => setNName(e.target.value)} placeholder="Leave blank to keep" />
								</label>

								<label>
									<span>Existing Category</span>
									<input className="input" value={selected.category} readOnly />
								</label>
								<label>
									<span>New Category</span>
									<input className="input" value={nCategory} onChange={(e) => setNCategory(e.target.value)} placeholder="Leave blank to keep" />
								</label>

								<label style={{ gridColumn: '1 / 2' }}>
									<span>Existing Description</span>
									<textarea className="input" rows={3} value={selected.description} readOnly />
								</label>
								<label style={{ gridColumn: '2 / 3' }}>
									<span>New Description</span>
									<textarea className="input" rows={3} value={nDescription} onChange={(e) => setNDescription(e.target.value)} placeholder="Leave blank to keep" />
								</label>

								<label>
									<span>Existing Total Quantity</span>
									<input className="input" value={selected.totalQuantity} readOnly />
								</label>
								<label>
									<span>New Total Quantity</span>
									<input className="input" type="number" min={0} value={nTotal} onChange={(e) => setNTotal(e.target.value)} placeholder="Blank to keep" />
								</label>

								<label>
									<span>Existing Available Quantity</span>
									<input className="input" value={selected.availableQuantity} readOnly />
								</label>
								<label>
									<span>New Available Quantity</span>
									<input className="input" type="number" min={0} value={nAvail} onChange={(e) => setNAvail(e.target.value)} placeholder="Blank to keep" />
								</label>

								<label>
									<span>Existing Condition</span>
									<input className="input" value={selected.condition} readOnly />
								</label>
								<label>
									<span>New Condition</span>
									<select
										className="input"
										value={nCondition}
										onChange={(e) => setNCondition(e.target.value as EquipmentCondition)}
									>
										<option value="">(Leave blank to keep)</option>
										{CONDITIONS.map((c) => (
											<option key={c} value={c}>{c}</option>
										))}
									</select>
								</label>
							</div>

							<div className="actions" style={{ marginTop: 12 }}>
								<button type="button" className="btn ghost" onClick={() => setSelected(null)} disabled={saving}>Cancel</button>
								<button type="submit" className="btn primary" disabled={saving}>
									{saving ? 'Saving…' : 'Update'}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>

			<FeedbackModal
				visible={successOpen}
				message="Equipment updated successfully. Returning…"
				onDone={() => {
					setSuccessOpen(false);
					setSelected(null); // back to paginated list on this page
				}}
			/>
		</>
	);
}