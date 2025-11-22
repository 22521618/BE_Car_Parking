echo "Testing Residents API..."
curl -s http://localhost:3000/residents | grep "Nguyen Van A" && echo "Residents API: OK" || echo "Residents API: FAILED"

echo "Testing Vehicles API..."
curl -s http://localhost:3000/vehicles | grep "30A-12345" && echo "Vehicles API: OK" || echo "Vehicles API: FAILED"

echo "Testing Dashboard API..."
curl -s http://localhost:3000/dashboard/summary | grep "totalResidents" && echo "Dashboard API: OK" || echo "Dashboard API: FAILED"
