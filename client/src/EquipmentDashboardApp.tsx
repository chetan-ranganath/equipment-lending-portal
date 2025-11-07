import { Link, Route, Routes } from 'react-router-dom';
import { AddEquipmentPage } from './equipment-pages/AddEquipmentPage';
import { UpdateEquipmentPage } from './equipment-pages/UpdateEquipmentPage';
import { DeleteEquipmentPage } from './equipment-pages/DeleteEquipmentPage';
import { ViewAllEquipmentsPage } from './equipment-pages/ViewAllEquipmentsPage';
import './equipment-dashboard-styles.css';

/**
 * Equipment Dashboard App Component
 * 
 * This component can be imported and used as a route in your main App.tsx
 * Example: <Route path="/equipment-portal/*" element={<EquipmentDashboardApp />} />
 */
export default function EquipmentDashboardApp() {
	return (
		<div className="equipment-dashboard-app">
			<div className="container">
				<Routes>
					<Route
						path="/"
						element={
							<div className="card">
								<div className="card-section">
									<h1>Equipment Portal</h1>
									<p style={{ color: '#9ca3af' }}>Choose an action:</p>
									<div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
										<Link className="btn primary" to="/add">Add Equipment</Link>
										<Link className="btn" to="/update">Update Equipment</Link>
										<Link className="btn danger" to="/delete">Delete Equipment</Link>
										<Link className="btn" to="/view">View all Equipments</Link>
									</div>
								</div>
							</div>
						}
					/>
					<Route path="/add" element={<AddEquipmentPage />} />
					<Route path="/update" element={<UpdateEquipmentPage />} />
					<Route path="/delete" element={<DeleteEquipmentPage />} />
					<Route path="/view" element={<ViewAllEquipmentsPage />} />
				</Routes>
			</div>
		</div>
	);
}

// Also export as named export for flexibility
export { EquipmentDashboardApp };

