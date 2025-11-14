import { Link, useNavigate } from 'react-router-dom';

export function PageHeader({ title }: { title: string }) {
	const navigate = useNavigate();
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
			<div style={{ display: 'flex', gap: 8 }}>
				<button className="btn ghost" onClick={() => navigate(-1)}>Back</button>
				<Link to="/" className="btn ghost">Portal</Link>
			</div>
			<h1 style={{ marginLeft: 'auto' }}>{title}</h1>
		</div>
	);
}