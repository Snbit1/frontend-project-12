build:
	cd frontend && npm install && npm run build
start:
	npx start-server -s ./frontend/dist
dev:
	cd frontend && npm install && npm run dev
socket:
	node server/index.js