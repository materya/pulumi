#!make

PM = npm
PMCMD = run
RM = rm

PRERELEASE_TAG ?= beta
PUBLISH_FLAGS = publish --access public

MODULES = node_modules
DIST = dist
COVERAGE = .nyc_output coverag

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
release: $(DIST)
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+$(PM) run release -- --dry-run
	+$(PM) $(PUBLISH_FLAGS) --dry-run
else
	$(PM) run release
	git push --follow-tags origin master
	$(PM) $(PUBLISH_FLAGS)
endif

.PHONY: prerelease
prerelease: $(DIST)
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+$(PM) run release -- --prerelease $(PRERELEASE_TAG) --dry-run
	+$(PM) $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG) --dry-run
else
	$(PM) run release -- --prerelease $(PRERELEASE_TAG)
	git push --follow-tags origin master
	$(PM) $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG)
endif
