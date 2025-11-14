import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Equipment } from '../types';
import { listEquipment } from '../api/equipment';
import { PageHeader } from '../equipment-components/PageHeader';

export function ViewAllEquipmentsPage() {
	const navigate = useNavigate();

	const [items, setItems] = useState<Equipment[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// search + pagination
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

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

	// Filter by name or description (case-insensitive)
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((it) =>
			[it.name, it.description].some((v) => (v ?? '').toLowerCase().includes(q))
		);
	}, [items, query]);

	// Pagination calculations
	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIdx = (currentPage - 1) * pageSize;
	const pageItems = filtered.slice(startIdx, startIdx + pageSize);

	// Reset to first page when filters/pageSize change
	useEffect(() => {
		setPage(1);
	}, [query, pageSize]);

	function prevPage() {
		setPage((p) => Math.max(1, p - 1));
	}
	function nextPage() {
		setPage((p) => Math.min(totalPages, p + 1));
	}

	return (
		<div className="card">
			<div className="card-section">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
					<div style={{ display: 'flex', gap: 8 }}>
						<button className="btn ghost" onClick={() => navigate(-1)}>Back</button>
						<Link to="/" className="btn ghost">Portal</Link>
					</div>
					<h1 style={{ marginLeft: 'auto' }}>All Equipments</h1>
				</div>

				{error && <div className="error" role="alert" style={{ marginTop: 8 }}>{error}</div>}

				<div className="list-header" style={{ marginTop: 8, gap: 10 }}>
					<input
						className="input"
						placeholder="Search by name or description…"
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
					<p style={{ color: '#9ca3af', marginTop: 10 }}>No items.</p>
				) : (
					<>
						<div className="table-wrapper" style={{ marginTop: 10 }}>
							<table className="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Category</th>
										<th>Description</th>
                                        <th>Condition</th>
										<th className="num">Total</th>
										<th className="num">Available</th>
									</tr>
								</thead>
								<tbody>
									{pageItems.map((it) => (
										<tr key={it.id}>
											<td>{it.name}</td>
											<td>{it.category}</td>
											<td>{it.description}</td>
                                            <td>{it.condition}</td>
											<td className="num">{it.totalQuantity}</td>
											<td className="num">{it.availableQuantity}</td>
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
			</div>
		</div>
	);
}