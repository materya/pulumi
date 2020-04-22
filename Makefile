#!make

export PRERELEASE_FLAG=beta

.PHONY: all
all: clean dist #test

dist:
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

.PHONY: publish
publish: dist
	npm publish --access public

.PHONY: release
release:
	npm run release

.PHONY: prerelease
prerelease:
	npm run release -- --prerelease $(PRERELEASE_FLAG)
