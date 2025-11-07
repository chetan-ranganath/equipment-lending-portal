import { Link, Route, Routes } from 'react-router-dom';
import { AddEquipmentPage } from '../equipment-pages/AddEquipmentPage';
import { UpdateEquipmentPage } from '../equipment-pages/UpdateEquipmentPage';
import { DeleteEquipmentPage } from '../equipment-pages/DeleteEquipmentPage';
import { ViewAllEquipmentsPage } from '../equipment-pages/ViewAllEquipmentsPage';

export function EquipmentDashboard() {
	return (
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
	);
}