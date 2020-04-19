.PHONY: all
all: clean dist #test

dist: clean
	npm run build

.PHONY: test
test:
	npm run test

.PHONY: clean
clean:
	rm -rf dist
	rm -rf coverage
	rm -rf .tmp
	rm -rf .nyc_output

.PHONY: release
release: dist
	npm publish --access public
