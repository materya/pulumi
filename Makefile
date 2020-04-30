#!make

PM = npm
PMCMD = run

export PRERELEASE_FLAG=beta

.PHONY: all
all: clean dist #test

dist:
	$(PM) $(PMCMD) build

.PHONY: test
test:
	$(PM) $(PMCMD) test

.PHONY: clean
clean:
	rm -rf dist
	rm -rf coverage
	rm -rf .tmp
	rm -rf .nyc_output

.PHONY: release
release: dist
	$(PM) $(PMCMD) release
	git push --follow-tags origin master
	npm publish --access public

.PHONY: prerelease
prerelease:
	$(PM) $(PMCMD) release -- --prerelease $(PRERELEASE_FLAG)
	git push --follow-tags origin master
	npm publish --tag prerelease --access public
