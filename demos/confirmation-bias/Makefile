# Confirmation Bias Experiment Website Makefile

# Default target
.PHONY: help serve clean install

# Default port
PORT ?= 8000

# Help target
help:
	@echo "Confirmation Bias Experiment Website"
	@echo "===================================="
	@echo ""
	@echo "Available targets:"
	@echo "  serve     - Start local development server (default port 8000)"
	@echo "  serve-3000 - Start server on port 3000"
	@echo "  serve-8080 - Start server on port 8080"
	@echo "  clean     - Remove any temporary files"
	@echo "  install   - Install dependencies (none required for static site)"
	@echo "  help      - Show this help message"
	@echo ""
	@echo "Usage examples:"
	@echo "  make serve        # Start server on port 8000"
	@echo "  make serve PORT=3000  # Start server on custom port"
	@echo "  make serve-3000   # Start server on port 3000"

# Check if Python is available
PYTHON := $(shell which python3 2>/dev/null || which python 2>/dev/null)
NODE := $(shell which node 2>/dev/null)
PHP := $(shell which php 2>/dev/null)

# Serve the website using available HTTP server
serve:
	@echo "Starting Confirmation Bias Experiment website..."
	@echo "Server will be available at: http://localhost:$(PORT)"
	@echo "Press Ctrl+C to stop the server"
	@echo ""
	@if [ -n "$(PYTHON)" ]; then \
		echo "Using Python HTTP server..."; \
		$(PYTHON) -m http.server $(PORT); \
	elif [ -n "$(NODE)" ]; then \
		echo "Using Node.js HTTP server..."; \
		npx http-server -p $(PORT) -o; \
	elif [ -n "$(PHP)" ]; then \
		echo "Using PHP HTTP server..."; \
		php -S localhost:$(PORT); \
	else \
		echo "Error: No HTTP server found. Please install Python, Node.js, or PHP."; \
		echo "Or open index.html directly in your browser."; \
		exit 1; \
	fi

# Convenience targets for common ports
serve-3000:
	@$(MAKE) serve PORT=3000

serve-8080:
	@$(MAKE) serve PORT=8080

# Clean temporary files
clean:
	@echo "Cleaning temporary files..."
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	@echo "Clean complete."

# Install dependencies (none required for static site)
install:
	@echo "No dependencies required for this static website."
	@echo "The site uses:"
	@echo "  - HTML5"
	@echo "  - CSS3"
	@echo "  - Vanilla JavaScript"
	@echo "  - Chart.js (loaded via CDN)"
	@echo ""
	@echo "You can start the server with: make serve"

# Open in browser (macOS)
open:
	@echo "Opening website in default browser..."
	@open http://localhost:$(PORT) 2>/dev/null || echo "Please open http://localhost:$(PORT) in your browser"

# Development target that serves and opens browser
dev: serve open
