all: benchmark

deps:
	npm install

benchmark: deps
	npm start
	
clean:
	rm -rf node_modules/

.PHONY: benchmark
